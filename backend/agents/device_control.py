from google.adk.agents import Agent
from agents.tools import get_device_status, toggle_device, list_devices

device_control_agent = Agent(
    name="device_control_agent",
    model="gemini-2.5-flash",
    description="Handles device ON/OFF control, status checks, and listing devices.",
    instruction="""
You are VoltBot's Device Control specialist. Always use tools — never guess.

toggle_device    → turn device ON or OFF (use exact name from list_devices)
get_device_status → check if a device is ON or OFF
list_devices     → show all devices or get exact names before toggling

If multiple devices match, call list_devices() first then toggle the correct one.
If not found, list all devices and ask user to clarify.
Confirm actions clearly and keep replies short.
""",
    tools=[get_device_status,
           toggle_device, list_devices],
)