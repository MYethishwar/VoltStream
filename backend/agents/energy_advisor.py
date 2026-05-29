from google.adk.agents import Agent
from agents.tools import get_smart_schedule, list_devices


def get_energy_tips(device_type: str) -> str:
    """
    Get practical energy-saving tips for a device type.

    Args:
        device_type: ac / fan / light / heater / fridge / tv / washer / other
    """
    tips = {
        "ac": (
            "AC (1800W): Set to 24–26°C — each degree lower adds ~6% to bill. "
            "Clean filters every 2 weeks (dirty filters use 10–15% more power). "
            "Use fan-only mode when outdoor temp is below 28°C. "
            "Enable sleep timer — body temp drops at night so you don't need full cooling."
        ),
        "fan": (
            "Fan (75W): Costs ₹1.8/day vs AC's ₹43/day — always try fans first. "
            "Turn off when leaving the room (fans cool people, not air). "
            "Reverse blade direction in winter for warmth recirculation. "
            "Clean blades monthly — dust adds drag and reduces airflow."
        ),
        "light": (
            "Lights (20W LED): Already efficient if you've switched from incandescent. "
            "Add motion sensors to cut idle-on time by ~40%. "
            "Use 2700K warm LEDs in bedrooms (less stimulating at night). "
            "Dimmers can save 20–40% and extend bulb life 2×."
        ),
        "heater": (
            "Water heater (2000W): Use a 30-minute timer — preheat before use, not all day. "
            "Each 10°C lower setting = ~3% less energy. "
            "Insulate pipes to reduce heat loss between uses. "
            "Solar water heaters recover cost in 2–3 years and cut bills 60–70%."
        ),
        "fridge": (
            "Fridge (150W, always on): Set to 3–5°C fridge / -15 to -18°C freezer. "
            "Keep it 3/4 full — thermal mass reduces compressor cycles. "
            "Clean rear coils every 6 months (dust makes it work 10% harder). "
            "Never put hot food in directly — cool to room temp first."
        ),
        "tv": (
            "TV (120W): Enable auto-brightness — saves up to 30% on most screens. "
            "Use sleep timer to avoid overnight standby drain. "
            "OLED/LED uses ~40% less than old plasma. "
            "Unplug when on holiday — standby still draws 5–10W."
        ),
        "washer": (
            "Washer (500W): 90% of washing energy is water heating — cold wash works equally well. "
            "Always run full loads (half load ≠ half cost). "
            "Use quick wash (30 min) for lightly soiled clothes. "
            "Clean the lint filter monthly to maintain efficiency."
        ),
        "other": (
            "General: Unplug chargers and appliances when not in use (standby vampire drain). "
            "Use smart plugs to auto-cut power at night. "
            "Avoid peak grid hours 6–10 PM when possible. "
            "Regular servicing improves appliance efficiency by 10–15%."
        ),
    }
    return tips.get(device_type.lower().strip(), tips["other"])


def estimate_monthly_cost(device_type: str, hours_per_day: float) -> str:
    """
    Estimate monthly electricity cost for a device type.

    Args:
        device_type: ac / fan / light / heater / fridge / tv / washer / other
        hours_per_day: average daily usage hours
    """
    POWER_W = {
        "ac": 1800, "fan": 75, "light": 20, "heater": 2000,
        "fridge": 150, "tv": 120, "washer": 500, "other": 100,
    }
    RATE = 8
    power_w = POWER_W.get(device_type.lower().strip(), 100)
    daily_kwh = (power_w / 1000) * hours_per_day
    monthly_kwh = daily_kwh * 30
    cost = monthly_kwh * RATE

    # Savings if user replaced with best practice
    savings_tips = {
        "ac": f"  Tip: raising setpoint by 2°C saves ₹{monthly_kwh * RATE * 0.12:.2f}/month",
        "washer": f"  Tip: cold wash saves ₹{cost * 0.90:.2f}/month (90% of cost is heating)",
        "heater": f"  Tip: timer use (1h/day) would cost only ₹{(power_w/1000) * 1 * 30 * RATE:.2f}/month",
    }

    result = (
        f"{device_type.upper()} @ {power_w}W × {hours_per_day}h/day\n"
        f"  Monthly: {monthly_kwh:.2f} kWh = ₹{cost:.2f} (@ ₹{RATE}/kWh)"
    )
    if device_type.lower() in savings_tips:
        result += f"\n{savings_tips[device_type.lower()]}"
    return result


def compare_devices(device_type_a: str, device_type_b: str, hours_per_day: float) -> str:
    """
    Compare the monthly cost of two device types running the same hours.
    Great for 'AC vs fan' or 'heater vs solar' questions.

    Args:
        device_type_a: first device type
        device_type_b: second device type
        hours_per_day: same usage hours for both
    """
    POWER_W = {
        "ac": 1800, "fan": 75, "light": 20, "heater": 2000,
        "fridge": 150, "tv": 120, "washer": 500, "other": 100,
    }
    RATE = 8

    def cost(dtype):
        pw = POWER_W.get(dtype.lower().strip(), 100)
        return pw, (pw / 1000) * hours_per_day * 30 * RATE

    pw_a, cost_a = cost(device_type_a)
    pw_b, cost_b = cost(device_type_b)
    cheaper = device_type_a if cost_a < cost_b else device_type_b
    saving = abs(cost_a - cost_b)

    return (
        f"Comparison @ {hours_per_day}h/day:\n"
        f"  {device_type_a.upper()} ({pw_a}W): ₹{cost_a:.2f}/month\n"
        f"  {device_type_b.upper()} ({pw_b}W): ₹{cost_b:.2f}/month\n"
        f"  → {cheaper.upper()} is cheaper by ₹{saving:.2f}/month"
    )


energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model="gemini-2.5-flash-lite",
    description="Gives energy-saving recommendations based on usage data and device type.",
    instruction="""
You are VoltStream's Energy Advisor. You receive usage analysis in {usage_analysis}.

Use {usage_analysis} as context — it contains which devices ran, for how long, and at what cost.
Build your advice around this actual data, not generic tips.

Tools:
get_energy_tips(device_type)            → specific tips for a device
estimate_monthly_cost(type, hours)      → cost breakdown with savings potential
compare_devices(type_a, type_b, hours)  → side-by-side cost comparison
get_smart_schedule()                    → shift timing recommendations
list_devices()                          → see all registered devices

Response style:
- Lead with the biggest saving opportunity from the usage data
- Give 2–3 actionable tips with rupee savings where possible
- End with one quick win the user can do today
- Keep total response under 150 words
""",
    tools=[get_energy_tips, estimate_monthly_cost, compare_devices, get_smart_schedule, list_devices],
)