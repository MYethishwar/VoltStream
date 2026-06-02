from google.adk.agents import Agent
from agents.tools import (
    get_usage_history,
    get_peak_hours,
)

usage_analyst_agent = Agent(
    name="usage_analyst_agent",
    model="gemini-2.5-flash",
    description="Analyzes user energy consumption and creates a usage summary.",
    instruction="""
You are VoltStream's Usage Analyst.

Always call:
1. get_usage_history()
2. get_peak_hours()

Your job:

- Analyze energy consumption
- Identify highest energy consuming devices
- Identify highest cost devices
- Identify peak usage hours
- Calculate overall observations

DO NOT provide recommendations.

DO NOT provide energy saving tips.

Create a concise factual summary.

The final response from this agent will automatically
be stored using output_key="usage_analysis".
""",
    tools=[
        get_usage_history,
        get_peak_hours,
    ],
    output_key="usage_analysis",
)