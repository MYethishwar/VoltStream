from google.adk.agents import SequentialAgent

from agents.usage_analyst import usage_analyst_agent
from agents.energy_advisor import energy_advisor_agent


print("LOADED: energy_pipeline")

energy_pipeline = SequentialAgent(
    name="energy_pipeline",
    description="Energy analysis workflow.",
    sub_agents=[
        usage_analyst_agent,
        energy_advisor_agent,
    ],
)