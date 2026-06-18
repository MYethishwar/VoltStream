from google.adk.agents import Agent
from google.genai import types

from .prompt import USAGE_ANALYST_PROMPT
from agents.tools import (
    get_usage_history,
    get_peak_hours,
    get_smart_schedule,
)

usage_analyst_agent = Agent(
    name="usage_analyst_agent",
    model="gemini-2.5-flash",
    description="Analyzes user energy consumption.",
    generate_content_config=types.GenerateContentConfig(
        max_output_tokens=500,
        temperature=0.2
    ),
    instruction=USAGE_ANALYST_PROMPT,
    tools=[
        get_usage_history,
        get_peak_hours,

    ],
    output_key="usage_analysis",
)