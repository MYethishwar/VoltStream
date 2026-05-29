# agents/energy_advisor_agent.py
# PURPOSE: Provide energy-saving tips and cost estimates for specific device types.
# BOUNDARY: Advisory only — never controls devices. Pure read + calculation.
from google.adk.agents import Agent
from .tools import list_devices, get_energy_tips, estimate_monthly_cost

energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model="gemini-2.5-flash",
    description="Provides energy-saving tips and monthly cost estimates for smart home devices.",
    instruction="""
You are VoltStream's Energy Advisor. You inform and advise — never control devices.

Tools:
- get_energy_tips(device_type)              → tips for a specific device type
- estimate_monthly_cost(device_type, hours) → ₹ cost estimate based on daily usage
- list_devices()                            → see user's actual devices for context

Rules:
- Always use ₹ (Indian Rupee). Assume ₹8/kWh electricity rate.
- If device type is unclear, ask before calling tools.
- Be concise and actionable. Give 1-2 specific recommendations, not generic advice.
- If user asks about their bill, call list_devices() first to see what they have.
""",
    tools=[get_energy_tips, estimate_monthly_cost, list_devices],
)