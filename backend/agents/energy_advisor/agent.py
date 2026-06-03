from google.adk.agents import Agent
import os

from .prompt import ENERGY_ADVISOR_PROMPT

from agents.tools import (
    get_energy_knowledge,
    get_smart_schedule,
)

print("LOADED: energy_advisor_agent")

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model=MODEL,
    description="Provides personalized energy recommendations.",
    instruction=ENERGY_ADVISOR_PROMPT,
    tools=[
        get_energy_knowledge,
        get_smart_schedule,
    ],
)