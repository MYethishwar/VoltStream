from google.adk.agents import Agent
from google.adk.tools import AgentTool #Here agent is acting as tool.

from .energy_pipeline import energy_pipeline

energy_agent = Agent(
    name="energy_agent",
    model="gemini-2.5-flash",
    description="Handles all energy-related queries.",
    instruction="""
You are VoltStream's Energy Specialist.

For ANY request related to:

- energy usage
- electricity consumption
- bills
- energy reports
- savings
- recommendations
- peak hours
- device consumption

ALWAYS execute the energy pipeline.

Never answer from your own knowledge.
Always use the energy workflow.
""",
    tools=[
        AgentTool(energy_pipeline)
    ],
)