from google.adk.agents import Agent, SequentialAgent
from agents.tools import (
    get_usage_history,
    get_peak_hours,
    get_energy_knowledge,
    get_smart_schedule,
)

usage_analyst_agent = Agent(
    name="usage_analyst_agent",
    model="gemini-2.5-flash-lite",
    description="Analyzes energy usage.",

instruction="""
You have NO access to energy data.

The ONLY source of truth is:

1. get_usage_history
2. get_peak_hours

Before responding:

ALWAYS call get_usage_history.

ALWAYS call get_peak_hours.

If tools are not called,
you are unable to answer.

Never invent data.

Never estimate.

Never answer from general knowledge.
""",
    tools=[
        get_usage_history,
        get_peak_hours,
    ],

    output_key="usage_analysis",
)

energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model="gemini-2.5-flash-lite",

    instruction="""
Review usage_analysis.

Always call:

get_energy_knowledge(
    query="energy saving recommendations for home appliances"
)

get_smart_schedule()

Generate:

- Recommendations
- Savings Opportunities
- Smart Schedule

Use tool outputs only.
""",

    tools=[
        get_energy_knowledge,
        get_smart_schedule,
    ],
)


energy_pipeline = SequentialAgent(
    name="energy_pipeline",
    sub_agents=[
        usage_analyst_agent,
        energy_advisor_agent,
    ],
)