from google.adk.agents import Agent
# from google.genai import types

from google.adk.tools import AgentTool #Here agent is acting as tool.
import os

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from .energy_pipeline import energy_pipeline

energy_agent = Agent(
    name="energy_agent",
    model=MODEL,
    description="Handles all energy-related queries.",
    #  generate_content_config=types.GenerateContentConfig(
    # max_output_tokens=500,
    # temperature=0.2
    # ),
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