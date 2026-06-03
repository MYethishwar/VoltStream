from google.adk.agents import Agent
import os

from .prompt import DEVICE_CONTROL_PROMPT

from agents.tools import (
    get_device_status,
    toggle_device,
    list_devices,
)

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

device_control_agent = Agent(
    name="device_control_agent",
    model=MODEL,
    description=(
        "Handles single device ON/OFF control, "
        "status checks, and device listing."
    ),
    instruction=DEVICE_CONTROL_PROMPT,
    tools=[
        get_device_status,
        toggle_device,
        list_devices,
    ],
)