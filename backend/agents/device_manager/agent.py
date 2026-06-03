from google.adk.agents import Agent
import os

from .prompt import DEVICE_MANAGER_PROMPT
from agents.tools import add_device

MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-2.5-flash"
)

device_manager_agent = Agent(
    name="device_manager_agent",
    model=MODEL,
    description="Registers new smart devices.",
    instruction=DEVICE_MANAGER_PROMPT,
    tools=[
        add_device,
    ],
)