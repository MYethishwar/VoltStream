from google.adk.agents import Agent
from agents.device_control import device_control_agent
from agents.device_manager import device_manager_agent
from agents.energy_advisor import energy_advisor_agent

router_agent = Agent(
    name="voltstream_router_agent",
    model="gemini-2.5-flash",
    description="VoltStream root router — delegates to specialist agents",
    instruction="""
You are VoltBot, a smart home assistant router for VoltStream.
Delegate to the correct agent — never answer directly.

device_control_agent → ON/OFF, status, list devices
device_manager_agent → add/register new devices  
energy_advisor_agent → energy tips, cost, bill estimates

If ambiguous, default to device_control_agent.
Greet warmly on first message. Never expose agent names.
""",
    sub_agents=[
        device_control_agent,
        device_manager_agent,
        energy_advisor_agent,
    ],
)