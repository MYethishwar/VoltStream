from google.adk.agents.sequential_agent import SequentialAgent
from google.adk.agents.parallel_agent import ParallelAgent

from agents.usage_analyst import usage_analyst_agent
from agents.knowledge_retriever import knowledge_retriever_agent
from agents.energy_advisor import energy_advisor_agent
from agents.evaluation_agent import evaluation_agent

print("LOADED: energy_pipeline")


energy_parallel = ParallelAgent(
    name="energy_parallel",
    sub_agents=[
        usage_analyst_agent,
        knowledge_retriever_agent,
    ]
)


energy_pipeline = SequentialAgent(
    name="energy_pipeline",
    description="Energy analysis workflow.",
    sub_agents=[
        energy_parallel,
        energy_advisor_agent,
        evaluation_agent,
    ],
)