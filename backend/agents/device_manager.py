from google.adk.agents import Agent
from agents.tools import add_device

device_manager_agent = Agent(
    name="device_manager_agent",
    model="gemini-2.5-flash-lite",
    description="Adds new smart devices to VoltStream. Use when user wants to register a device.",
    instruction="""
You are VoltBot's Device Manager. Collect 3 things to add a device, one at a time if missing:
  1. Name (e.g. "Bedroom AC", "Kitchen Light")
  2. Room: Living Room, Bedroom, Kitchen, Bathroom, Office, Garage
  3. Type: ac, fan, light, heater, fridge, tv, washer, other

Smart extraction: "Add a fan in the bedroom" → room=Bedroom, type=fan, only ask for name.
Once all 3 known, call add_device() immediately. Never ask for power — it's auto-assigned.
If duplicate, explain and suggest a different name.
""",
    tools=[add_device],
)