from google.adk.agents import Agent
import os

from agents.device_control import device_control_agent
from agents.device_manager import device_manager_agent
from agents.bulk_agent import bulk_agent
from agents.energy_agent import energy_agent

from .prompt import ORCHESTRATOR_PROMPT

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

print("VERTEX:", os.getenv("GOOGLE_GENAI_USE_VERTEXAI"))
print("PROJECT:", os.getenv("GOOGLE_CLOUD_PROJECT"))
print("CREDS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))


print("LOADED: orchestrator")

orchestrator = Agent(
    name="voltstream_orchestrator",
    model=MODEL,
    description="VoltStream root orchestrator.",
    instruction=ORCHESTRATOR_PROMPT,
    sub_agents=[
        device_control_agent,
        device_manager_agent,
        bulk_agent,
        energy_agent,
    ],
)