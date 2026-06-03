from google.adk.agents import Agent
# from google.genai import types

import os

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from .device_control import device_control_agent
from .device_manager import device_manager_agent
from .bulk_agent import bulk_agent
from .energy_agent import energy_agent
import os

print("VERTEX:", os.getenv("GOOGLE_GENAI_USE_VERTEXAI"))
print("PROJECT:", os.getenv("GOOGLE_CLOUD_PROJECT"))
print("CREDS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))
orchestrator = Agent(
    name="voltstream_orchestrator",
    model=MODEL,
    description="VoltStream root orchestrator.",
   #   generate_content_config=types.GenerateContentConfig(
   #  max_output_tokens=0,
   #  temperature=0.2
   #  ),
    instruction="""
You are VoltBot.

You MUST delegate every request.

Routing Rules:

1. bulk_agent
   Multiple devices.
   Examples:
   - turn off all devices
   - switch off all fans
   - turn on all lights

2. energy_agent
   Energy related requests.
   Examples:
   - energy report
   - electricity bill
   - usage analysis
   - energy recommendations
   - peak hours
   - power consumption

3. device_control_agent
   Single device control or status.
   Examples:
   - turn off AC
   - turn on fan
   - list devices
   - device status

4. device_manager_agent
   Add/register/remove devices.

Never answer directly.
Always delegate.
""",
    sub_agents=[
        device_control_agent,
        device_manager_agent,
        bulk_agent,
        energy_agent,
    ],
)