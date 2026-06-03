from google.adk.agents import Agent
# from google.genai import types

import os

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from .tools import add_device

device_manager_agent = Agent(
    name="device_manager_agent",
    model=MODEL,
    description="Adds new smart devices to VoltStream. Use when user wants to register or add a device.",
    #  generate_content_config=types.GenerateContentConfig(
    # max_output_tokens=1000,
    # temperature=0.2
    # ),
    instruction="""
You are VoltBot's Device Manager.

To add a device you need exactly 3 things:
  1. Name  — e.g. "Bedroom AC", "Kitchen Light", "Office Fan"
  2. Room  — must be one of: Living Room, Bedroom, Kitchen, Bathroom, Office, Garage
  3. Type  — must be one of: ac, fan, light, heater, fridge, tv, washer, other

Smart extraction rules:
- "Add a fan in the bedroom" → type=fan, room=Bedroom, ask only for name
- "Register bedroom AC" → type=ac, room=Bedroom, ask only for name
- "Add a device" → ask for all 3 one at a time

Once you have all 3, call add_device(device_name, room, device_type) immediately.
Do NOT ask for power — it is auto-assigned.
If a duplicate exists, explain and ask for a different name.
""",
    tools=[add_device],
)