from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from jose import jwt, JWTError

from agents.router import router_agent
from agents.tools import current_user_id
import os

router = APIRouter(prefix="/api/v1", tags=["Agent"])

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")


# ─── Request model ─────────────────────────────────────────────────────────────
class AgentRequest(BaseModel):
    message: str


# ─── Session service & runner (module-level singletons) ───────────────────────
session_service = InMemorySessionService()

runner = Runner(
    app_name="voltstream_agent",
    agent=router_agent,
    session_service=session_service,
)


# ─── JWT helper ───────────────────────────────────────────────────────────────
def extract_user_id(authorization: str) -> str:
    """Decode Bearer token and return the user_id from payload['id']."""
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["id"]
    except (JWTError, IndexError, KeyError):
        raise HTTPException(status_code=401, detail="Invalid or missing token")


# ─── Agent endpoint ────────────────────────────────────────────────────────────
@router.post("/agent")
async def agent_chat(
    request: AgentRequest,
    authorization: str = Header(...),
):
    """
    Send a natural language message to the VoltStream ADK agent.
    Requires a valid JWT in the Authorization: Bearer <token> header.

    The agent will:
    1. Plan — understand the user's intent
    2. Select — pick the right tool
    3. Execute — run the tool against MongoDB (scoped to this user only)
    4. Observe — read the tool result
    5. Respond — return a human-readable reply
    """

    # ── Extract real user_id from JWT ─────────────────────────────────────────
    user_id = extract_user_id(authorization)

    # ── Each user gets their own isolated session ─────────────────────────────
    # Using user_id as session_id ensures conversation history is per-user
    # and never leaks between accounts.
    session_id = f"session_{user_id}"

    existing = await session_service.get_session(
        app_name="voltstream_agent",
        user_id=user_id,
        session_id=session_id,
    )
    if not existing:
        await session_service.create_session(
            app_name="voltstream_agent",
            user_id=user_id,
            session_id=session_id,
        )

    # ── Set user_id in context so all tools read the correct user ─────────────
    # This uses Python contextvars — thread-safe, async-safe, invisible to agent
    token_ctx = current_user_id.set(user_id)

    response_text = ""
    agent_steps = []

    try:
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=types.Content(
                role="user",
                parts=[types.Part(text=request.message)],
            ),
        ):
            # ── Capture tool calls and results (agent loop trace) ──────────────
            if hasattr(event, "content") and event.content and event.content.parts:
                for part in event.content.parts:

                    if hasattr(part, "function_call") and part.function_call:
                        fn = part.function_call
                        agent_steps.append({
                            "step": "tool_call",
                            "tool": fn.name,
                            "args": dict(fn.args) if fn.args else {},
                        })

                    if hasattr(part, "function_response") and part.function_response:
                        fr = part.function_response
                        agent_steps.append({
                            "step": "tool_result",
                            "tool": fr.name,
                            "result": str(fr.response),
                        })

            # ── Final response ─────────────────────────────────────────────────
            if event.is_final_response():
                if event.content and event.content.parts:
                    response_text = event.content.parts[0].text

    finally:
        # ── Always reset context var after request completes ──────────────────
        current_user_id.reset(token_ctx)

    return {
        "reply": response_text,
        "steps": agent_steps,
    }