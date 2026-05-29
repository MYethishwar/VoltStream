# agents/analytics_agent.py
# PURPOSE: Sequential analytics pipeline — fetch devices → calculate usage → rank by consumption.
# Uses SequentialAgent: each step passes output_key to the next via state interpolation.
# BOUNDARY: Read-only. Never modifies devices. Returns insights and rankings only.
from google.adk.agents import Agent, SequentialAgent
from .tools import list_devices, get_energy_tips, estimate_monthly_cost, current_user_id
from database.connection import db


def fetch_device_data() -> str:
    """Fetch all devices with power ratings for the current user."""
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))
    if not devices:
        return "No devices found."
    lines = ["Device | Type | Room | Power(W) | Status"]
    for d in devices:
        lines.append(f'{d["name"]} | {d["type"]} | {d["room"]} | {d["power_w"]}W | {"ON" if d["status"] else "OFF"}')
    return "\n".join(lines)


def calculate_usage_estimate(hours_per_day: float = 8.0) -> str:
    """
    Calculate estimated monthly kWh and cost for all devices, assuming given daily hours.
    Args:
        hours_per_day: Average hours each device runs per day (default 8).
    Returns:
        Per-device cost breakdown sorted by consumption.
    """
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))
    if not devices:
        return "No devices found."
    RATE = 8  # ₹ per kWh
    results = []
    for d in devices:
        power_w = d.get("power_w", 100)
        monthly_kwh = (power_w / 1000) * hours_per_day * 30
        cost = monthly_kwh * RATE
        results.append((d["name"], d["type"], d["room"], power_w, monthly_kwh, cost))
    results.sort(key=lambda x: x[5], reverse=True)  # rank by cost descending
    lines = [f"Usage estimate @ {hours_per_day}h/day | Rate: ₹{RATE}/kWh\n"]
    total_cost = 0
    for name, dtype, room, power, kwh, cost in results:
        lines.append(f"  {name} ({room}) — {power}W → {kwh:.1f} kWh → ₹{cost:.0f}/month")
        total_cost += cost
    lines.append(f"\n  TOTAL ESTIMATED BILL: ₹{total_cost:.0f}/month")
    return "\n".join(lines)


# Step 1: Fetcher — pulls raw device data
data_fetcher = Agent(
    name="data_fetcher",
    model="gemini-2.5-flash",
    description="Fetches raw device data for analytics.",
    instruction="""
Call fetch_device_data() and return the raw result verbatim. Do not add commentary.
""",
    output_key="raw_device_data",
    tools=[fetch_device_data],
)

# Step 2: Calculator — computes usage from raw data
usage_calculator = Agent(
    name="usage_calculator",
    model="gemini-2.5-flash",
    description="Calculates monthly energy usage and cost per device.",
    instruction="""
You have raw device data: {raw_device_data}

Call calculate_usage_estimate() with a reasonable hours_per_day value (default 8).
Return the result verbatim. Do not add commentary.
""",
    output_key="usage_breakdown",
    tools=[calculate_usage_estimate],
)

# Step 3: Ranker — produces the final human-readable insight report
insight_ranker = Agent(
    name="insight_ranker",
    model="gemini-2.5-flash",
    description="Ranks devices by energy consumption and produces actionable insights.",
    instruction="""
You have a usage breakdown: {usage_breakdown}

Produce a clean report with 3 sections:
1. **Top Energy Consumers** — list top 3 devices by monthly cost.
2. **Quick Wins** — 2 specific actions the user can take to reduce their bill.
3. **Monthly Estimate** — restate the total bill estimate clearly.

Keep it concise, use ₹ for currency, and address the user directly.
""",
    tools=[get_energy_tips],
)

# SequentialAgent chains the 3 steps: fetch → calculate → rank
analytics_agent = SequentialAgent(
    name="analytics_agent",
    description="Sequential pipeline: fetches device data, calculates energy usage, then ranks and reports insights.",
    sub_agents=[data_fetcher, usage_calculator, insight_ranker],
)