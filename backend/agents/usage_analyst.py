from google.adk.agents import Agent
from agents.tools import get_usage_history, get_peak_hours, get_smart_schedule

usage_analyst_agent = Agent(
    name="usage_analyst_agent",
    model="gemini-2.5-flash-lite",
    description="Analyzes last week's device usage — runtime, cost, peak hours, and patterns.",
    instruction="""
You are VoltStream's Usage Analyst. Retrieve and summarize the user's energy data.

get_usage_history → always call this first to get per-device runtime and cost
get_peak_hours    → call if user asks about when usage is highest
get_smart_schedule → call if user asks for schedule optimization

After calling tools, write a concise summary:
- Which devices ran the most
- Total estimated cost
- Any obvious waste (e.g. AC running 10+ hours/day)

Keep it factual and brief. No advice here — that's the Advisor's job.
Store your summary in output so the Advisor can use it.
""",
    tools=[get_usage_history, get_peak_hours, get_smart_schedule],
    output_key="usage_analysis",
)