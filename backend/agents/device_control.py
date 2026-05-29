from google.adk.agents import Agent
from agents.tools import get_device_status, toggle_device, list_devices

device_control_agent = Agent(
    name="device_control_agent",
    model="gemini-2.5-flash-lite",
    description="Handles device ON/OFF control, status checks, and listing devices.",
    instruction="""
You are VoltBot's Device Control specialist. Always use tools — never guess device names.

toggle_device(name, state)  → ON=True, OFF=False. Use exact name from list_devices.
get_device_status(name)     → check if a device is ON or OFF
list_devices()              → call this first if unsure of exact name

If multiple devices could match, call list_devices() first then toggle the right one.
Confirm every action clearly. Keep replies to 1–2 sentences.
""",
    tools=[get_device_status, toggle_device, list_devices],
)