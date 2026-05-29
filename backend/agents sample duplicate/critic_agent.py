# agents/critic_agent.py
# PURPOSE: Safety gate — validates actions BEFORE they execute.
# For single devices: approves or blocks. For bulk: flags risky operations.
# BOUNDARY: Never executes device ops. Only judges and annotates.
from google.adk.agents import Agent
from .tools import list_devices

def validate_action(action: str, device_name: str) -> str:
    """
    Validate whether a device action is safe to execute.
    Args:
        action: The action to validate — 'toggle_on', 'toggle_off', 'status', 'add', 'bulk'
        device_name: The device name(s) involved. For bulk, pass comma-separated names.
    Returns:
        'APPROVED', 'BLOCKED: <reason>', or 'NEEDS_CONFIRMATION: <reason>'
    """
    action = action.lower().strip()
    names = [n.strip() for n in device_name.split(",")]

    # Bulk actions always need human confirmation
    if action == "bulk" or len(names) > 1:
        return f"NEEDS_CONFIRMATION: Bulk action on {len(names)} devices ({device_name}). Requires user approval."

    # Turning on high-power devices — warn but allow
    high_power_keywords = ["ac", "heater", "geyser", "washer"]
    if action == "toggle_on" and any(kw in device_name.lower() for kw in high_power_keywords):
        return f"APPROVED: High-power device detected ({device_name}). Action permitted — inform user of power usage."

    # Status checks and OFF actions are always safe
    if action in ("toggle_off", "status", "add"):
        return "APPROVED"

    return "APPROVED"


critic_agent = Agent(
    name="critic_agent",
    model="gemini-2.5-flash",
    description="Safety gate that validates device actions before execution. Approves safe ops, flags risky or bulk actions.",
    instruction="""
You are VoltStream's Critic — a safety validator, NOT an executor.

Your job:
1. Call validate_action() for every action before it proceeds.
2. If result is APPROVED → pass the request forward, state it's cleared.
3. If result is NEEDS_CONFIRMATION → STOP and ask the user to confirm before proceeding.
4. If result is BLOCKED → tell the user why and do not proceed.

You never toggle devices yourself. You only judge whether the action should happen.
Be concise. One sentence approval or one sentence reason for blocking.
""",
    tools=[validate_action, list_devices],
)