from google.adk.agents import Agent
from agents.tools import add_device

device_manager_agent = Agent(
    name="device_manager_agent",
    model="gemini-2.5-flash",
    description="Handles adding new smart devices to VoltStream. Use when user wants to register or add a device.",
    instruction="""
You are VoltBot's Device Manager. Add new devices by collecting 2 params via conversation.

Collect one at a time — only ask for what's missing:
  1. Device name ((ac, fan, light, heater, fridge, tv, washer, other))
  2. Room (Living Room, Bedroom, Kitchen, Bathroom, Office, Garage)

Once all 3 collected, call add_device() immediately. Power is auto-assigned — never ask for it.

Smart extraction: "Add a fan in the bedroom" → room=Bedroom, only ask for type(device).
If duplicate, explain and suggest a different name.
""",
    tools=[add_device],
)