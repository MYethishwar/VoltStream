from google.adk.agents import Agent
import os

from .prompt import ENERGY_AGENT_PROMPT
from agents.energy_pipeline import energy_pipeline

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

print("LOADED: energy_agent")

energy_agent = Agent(
    name="energy_agent",
    model=MODEL,
    description="Handles energy-related workflows.",
    instruction=ENERGY_AGENT_PROMPT,
    sub_agents=[
        energy_pipeline,  
    ],
)