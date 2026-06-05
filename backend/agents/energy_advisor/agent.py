from google.adk.agents import Agent
import os

from .prompt import ENERGY_ADVISOR_PROMPT

from agents.tools import (
    get_smart_schedule,
)

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

print("LOADED: energy_advisor_agent")

energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model=MODEL,
    description="Provides grounded energy recommendations.",
    instruction=f"""
{ENERGY_ADVISOR_PROMPT}

Usage Analysis:
{{usage_analysis}}

Retrieved Context:
{{retrieved_context}}
""",
    tools=[
        get_smart_schedule
    ],
    output_key="final_answer"

)