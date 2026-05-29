from google.adk.agents import Agent, SequentialAgent
from agents.device_control import device_control_agent
from agents.device_manager import device_manager_agent
from agents.usage_analyst import usage_analyst_agent
from agents.energy_advisor import energy_advisor_agent

# ── Week 5 core: Analyst → Advisor pipeline ───────────────────────────────────
# usage_analyst runs first, stores result in output_key="usage_analysis"
# energy_advisor reads {usage_analysis} from session state automatically

energy_pipeline = SequentialAgent(
    name="energy_pipeline",
    description=(
        "Run when user asks about energy saving, usage analysis, bill reduction, "
        "last week's consumption, or cost optimization. "
        "Analyst retrieves usage data first, then Advisor gives personalized recommendations."
    ),
    sub_agents=[usage_analyst_agent, energy_advisor_agent],
)

# ── Root orchestrator ─────────────────────────────────────────────────────────
orchestrator = Agent(
    name="voltstream_orchestrator",
    model="gemini-2.5-flash-lite",
    description="VoltStream root orchestrator — routes user intent to the right specialist.",
    instruction="""
You are VoltBot, a smart home assistant. Route every request to the right agent — never answer directly.

energy_pipeline      → user asks about energy saving, usage history, bills, last week's data, cost reduction
device_control_agent → turn devices ON/OFF, check status, list devices
device_manager_agent → add or register a new device

Routing rules:
- "save energy" / "reduce bill" / "last week" / "usage" / "how much did I spend" → energy_pipeline
- "turn on/off" / "status" / "is X on" / "list devices"                          → device_control_agent
- "add device" / "register" / "new device"                                        → device_manager_agent

Greet warmly on first message. Never expose internal agent names.
""",
    sub_agents=[energy_pipeline, device_control_agent, device_manager_agent],
)