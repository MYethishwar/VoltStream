from google.adk.agents import Agent, SequentialAgent
# from google.genai import types

import os

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from .tools import (
    get_usage_history,
    get_peak_hours,
    get_energy_knowledge,
    get_smart_schedule,
)


usage_analyst_agent = Agent(
    name="usage_analyst_agent",
    model=MODEL,
    description="Retrieves and summarizes real energy usage data.",
    #  generate_content_config=types.GenerateContentConfig(
    # max_output_tokens=500,
    # temperature=0.2
    # ),
    instruction="""
You are VoltStream's Usage Analyst.

MANDATORY:
1. Call get_usage_history(days=7)
2. Call get_peak_hours()

Then provide:

- Runtime hours per device
- kWh per device
- Cost per device
- Highest consuming device
- Total cost
- Peak usage hours

Do not provide recommendations.
Only provide factual analysis.
""",
    tools=[
        get_usage_history,
        get_peak_hours,
    ],
    output_key="usage_analysis",
)


energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model=MODEL,
    description="Provides personalized energy recommendations.",
    instruction="""
You are VoltStream's Energy Advisor.

Usage Analysis:

{usage_analysis}

MANDATORY:
1. Call get_energy_knowledge(query="energy saving tips for home appliances India")
2. Call get_smart_schedule()

Return:

## Key Finding

## Top Recommendations

## Smart Schedule

## One Quick Action Today

If usage data is unavailable,
tell the user to seed usage data.
""",
    tools=[
        get_energy_knowledge,
        get_smart_schedule,
    ],
)


energy_pipeline = SequentialAgent(
    name="energy_pipeline",
    description="Energy analysis workflow.",
    sub_agents=[
        usage_analyst_agent,
        energy_advisor_agent,
    ],
)