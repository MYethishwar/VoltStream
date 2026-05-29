# agents/memory_agent.py
# PURPOSE: Persistent user memory — loads preferences before session, saves summary after.
# BOUNDARY: Never controls devices. Pure memory read/write.
# Uses in-process MongoDB store (can swap to vector store later).
from google.adk.agents import Agent
from .tools import current_user_id
from database.connection import db
from datetime import datetime


def load_user_memory() -> str:
    """
    Load the user's past interaction summary and preferences from MongoDB.
    Returns their stored context so the session can be personalized.
    """
    user_id = current_user_id.get()
    record = db["user_memory"].find_one({"user_id": user_id})
    if not record:
        return "No memory found for this user. This appears to be a new session."
    return (
        f"User memory loaded:\n"
        f"  Last active: {record.get('last_active', 'unknown')}\n"
        f"  Preferences: {record.get('preferences', 'none recorded')}\n"
        f"  Last session summary: {record.get('last_summary', 'none')}"
    )


def save_session_summary(summary: str, preferences: str = "") -> str:
    """
    Save a summary of the current session and any user preferences to MongoDB.
    Args:
        summary: Brief summary of what happened this session.
        preferences: Any preferences inferred (e.g. 'prefers AC at 24°C', 'turns off lights at night').
    Returns:
        Confirmation string.
    """
    user_id = current_user_id.get()
    db["user_memory"].update_one(
        {"user_id": user_id},
        {"$set": {
            "user_id": user_id,
            "last_summary": summary,
            "preferences": preferences,
            "last_active": datetime.utcnow().isoformat(),
        }},
        upsert=True,
    )
    return f"Session summary saved for user {user_id}."


memory_agent = Agent(
    name="memory_agent",
    model="gemini-2.5-flash",
    description="Manages persistent user memory — loads past context at session start and saves a summary at session end.",
    instruction="""
You are VoltStream's Memory Agent. You handle user context — nothing else.

On session START:
  Call load_user_memory() and return the result so the orchestrator can personalize the session.

On session END (when asked to save):
  Call save_session_summary(summary, preferences) with:
    - summary: 1-2 sentences on what actions were taken this session.
    - preferences: any patterns observed (optional, can be empty string).

Never control devices. Never give energy advice. Pure memory operations only.
""",
    tools=[load_user_memory, save_session_summary],
)