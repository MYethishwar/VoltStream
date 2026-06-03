from google.adk.agents import Agent
import os

from .prompt import BULK_AGENT_PROMPT

from agents.tools import (
    list_devices,
    preview_bulk_toggle,
    bulk_toggle_devices,
)

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

bulk_agent = Agent(
    name="bulk_agent",
    model=MODEL,
    description="Handles bulk device operations affecting multiple devices at once.",
    instruction=BULK_AGENT_PROMPT,
    tools=[
        list_devices,
        preview_bulk_toggle,
        bulk_toggle_devices,
    ],
)