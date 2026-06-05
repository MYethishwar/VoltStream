from google.adk.agents import Agent
import os

from .prompt import KNOWLEDGE_RETRIEVER_PROMPT
from agents.tools import rag_energy_search

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)
print("LOADED: knowledge_retriever_agent")

knowledge_retriever_agent = Agent(
    name="knowledge_retriever_agent",
    model=MODEL,
    description="Retrieves energy knowledge from PDFs.",
    instruction=KNOWLEDGE_RETRIEVER_PROMPT,
    tools=[
        rag_energy_search
    ],
    output_key="retrieved_context"
)