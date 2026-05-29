# agents/device_control_agent.py
# PURPOSE: Execute individual device operations — toggle, status check, list.
# BOUNDARY: Does NOT validate safety, does NOT handle bulk. One device at a time.
from google.adk.agents import Agent
from .tools import get_device_status, toggle_device, list_devices, add_device

device_control_agent = Agent(
    name="device_control_agent",
    model="gemini-2.5-flash",
    description="Executes individual smart device operations: ON/OFF control, status checks, listing, and adding devices.",
    instruction="""
You are VoltStream's Device Control executor. You act — you don't plan or validate.

Rules:
- toggle_device   → turn a device ON or OFF (always use exact name from list_devices first)
- get_device_status → check current state of one device
- list_devices    → show all devices or resolve exact names before acting
- add_device      → register a new device (collect name, room, type if missing)

If a device name is ambiguous, call list_devices() first, then act.
Confirm every action concisely. Never guess device names.
""",
    tools=[get_device_status, toggle_device, list_devices, add_device],
)