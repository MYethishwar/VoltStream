from google.adk.agents import Agent
import os

from .prompt import EVALUATION_AGENT_PROMPT

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

print("LOADED: evaluation_agent")

evaluation_agent = Agent(
    name="evaluation_agent",
    model=MODEL,
    description="Evaluates faithfulness, relevance and completeness.",
    instruction=EVALUATION_AGENT_PROMPT,
    output_key="evaluation_report"
)