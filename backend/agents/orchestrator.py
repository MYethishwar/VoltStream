from google.adk.agents import Agent

from .device_control import device_control_agent
from .device_manager import device_manager_agent
from .bulk_agent import bulk_agent
from .energy_agent import energy_agent

orchestrator = Agent(
    name="voltstream_orchestrator",
    model="gemini-2.5-flash",
    description="VoltStream root orchestrator.",
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