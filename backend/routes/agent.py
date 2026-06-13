from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from jose import jwt, JWTError
from agents.orchestrator import orchestrator
from agents.tools import current_user_id
import os

router = APIRouter(prefix="/api/v1", tags=["Agent"])
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")


class AgentRequest(BaseModel):
    message: str


session_service = InMemorySessionService()
runner = Runner(
    app_name="voltstream_agent",
    agent=orchestrator,
    session_service=session_service,
)


def extract_user_id(authorization: str) -> str:
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["id"]
    except (JWTError, IndexError, KeyError):
        raise HTTPException(status_code=401, detail="Invalid or missing token")


def _extract_text(event) -> str:
    """Safely extract text from any event content."""
    try:
        if event.content and event.content.parts:
            for part in event.content.parts:
                if hasattr(part, "text") and part.text and part.text.strip():
                    return part.text.strip()
    except Exception:
        pass
    return ""


@router.post("/agent")
async def agent_chat(request: AgentRequest, authorization: str = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    user_id = extract_user_id(authorization)
    session_id = f"session_{user_id}"

    existing = await session_service.get_session(
        app_name="voltstream_agent", user_id=user_id, session_id=session_id
    )
    if not existing:
        await session_service.create_session(
            app_name="voltstream_agent", user_id=user_id, session_id=session_id
        )

    token_ctx = current_user_id.set(user_id)
    response_text = ""
    agent_steps = []

    try:
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=types.Content(
                role="user", parts=[types.Part(text=request.message)]
            ),
        ):
            # Track tool calls and results for trace/debug
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
                            "result": str(fr.response)[:300],
                        })

            # Track agent handoffs
            if hasattr(event, "author") and event.author:
                if not agent_steps or agent_steps[-1].get("agent") != event.author:
                    agent_steps.append({
                        "step": "agent_handoff",
                        "agent": event.author,
                    })

            # ── Capture response text ──────────────────────────────────────
            text = _extract_text(event)
            if text:
                author = getattr(event, "author", None)
                # Priority 1: energy_advisor_agent is the answer we want
                if author == "energy_advisor_agent":
                    response_text = text
                # Priority 2: device/bulk agents for non-energy queries
                elif author in (
                    "device_control_agent",
                    "device_manager_agent",
                    "bulk_agent",
                ):
                    response_text = text
                # Priority 3: fallback — only set if nothing captured yet
                elif not response_text:
                    response_text = text

    finally:
        current_user_id.reset(token_ctx)

    if not response_text:
        response_text = "I processed your request but couldn't generate a text response. Please try again."

    return {"reply": response_text, "steps": agent_steps}


# ── Seed endpoint ─────────────────────────────────────────────────────────────
@router.post("/agent/seed-usage")
async def seed_usage_history(authorization: str = Header(...)):
    """Populates usage_history with 7 days of realistic demo data."""
    from database.connection import db
    from datetime import datetime, timedelta
    import random

    user_id = extract_user_id(authorization)
    from agents.tools import POWER_DEFAULTS

    sample_devices_raw = list(db["devices"].find({"user_id": user_id}))
    if not sample_devices_raw:
        raise HTTPException(
            status_code=400, detail="No devices found. Add devices first."
        )

    now = datetime.utcnow()
    inserted = 0

    for device in sample_devices_raw:
        dtype = device.get("type", "other")
        daily_hours = {
            "ac": 8, "fan": 12, "light": 6, "heater": 1,
            "fridge": 24, "tv": 4, "washer": 1,
        }.get(dtype, 2)

        for day_offset in range(7):
            base = now - timedelta(days=day_offset)
            on_hour = random.randint(7, 20)
            on_time = base.replace(
                hour=on_hour,
                minute=random.randint(0, 59),
                second=0,
                microsecond=0,
            )
            off_time = on_time + timedelta(
                hours=daily_hours + random.uniform(-1, 1)
            )

            db["usage_history"].insert_many([
                {
                    "user_id": user_id,
                    "device_id": str(device["_id"]),
                    "device_name": device["name"],
                    "device_type": dtype,
                    "power_w": device.get(
                        "power_w", POWER_DEFAULTS.get(dtype, 100)
                    ),
                    "action": "ON",
                    "timestamp": on_time,
                },
                {
                    "user_id": user_id,
                    "device_id": str(device["_id"]),
                    "device_name": device["name"],
                    "device_type": dtype,
                    "power_w": device.get(
                        "power_w", POWER_DEFAULTS.get(dtype, 100)
                    ),
                    "action": "OFF",
                    "timestamp": off_time,
                },
            ])
            inserted += 2

    return {
        "message": f"Seeded {inserted} usage events for {len(sample_devices_raw)} devices over 7 days."
    }