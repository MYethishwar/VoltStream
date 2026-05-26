from google.adk.agents import Agent
from .tools import list_devices


def get_energy_tips(device_type: str) -> str:
    """
    Get energy-saving tips for a specific device type.

    Args:
        device_type: The type of device (ac, fan, light, heater,
                     fridge, tv, washer, other).

    Returns:
        A string with practical energy-saving tips for that device.
    """
    tips = {
        "ac": "AC Tips: Set 24-26°C. Clean filters every 2 weeks. Use fan mode below 28°C. Close doors/windows. Use sleep timer.",
        "fan": "Fan Tips: 75W vs AC's 1800W — use fans first. Turn off when leaving. Reverse mode in winter. Clean blades monthly.",
        "light": "Light Tips: Switch to LED (80% less power). Use motion sensors. Maximize natural light. Dimmers save 20-40%.",
        "heater": "Heater Tips: Use timer — preheat 30min before. Insulate well. Set 18-20°C for sleep. Solar heaters cut costs 60-70%.",
        "fridge": "Fridge Tips: Set 3-5°C / -15 to -18°C freezer. Keep 3/4 full. Clean coils every 6 months. Cool food before storing.",
        "tv": "TV Tips: Enable auto-brightness (saves 30%). Use sleep timer. LED/OLED uses 40% less than plasma. Unplug on standby.",
        "washer": "Washer Tips: Cold water wash (90% energy is heating). Full loads only. Quick wash for light clothes. Clean lint filters.",
        "other": "General Tips: Unplug unused devices. Use smart plugs. Avoid peak hours 6-10 PM. Regular maintenance improves efficiency.",
    }
    return tips.get(device_type.lower().strip(), tips["other"])


def estimate_monthly_cost(device_type: str, hours_per_day: float) -> str:
    """
    Estimate the monthly electricity cost for a device type
    based on daily usage hours.

    Args:
        device_type: The type of device (ac, fan, light, heater,
                     fridge, tv, washer, other).
        hours_per_day: How many hours per day the device runs.

    Returns:
        A string with the estimated monthly cost breakdown.
    """
    POWER_W = {
        "ac": 1800, "fan": 75, "light": 20,
        "heater": 2000, "fridge": 150, "tv": 120,
        "washer": 500, "other": 100,
    }   
    RATE = 8  # ₹8 per kWh

    power_w = POWER_W.get(device_type.lower().strip(), 100)
    daily_kwh = (power_w / 1000) * hours_per_day
    monthly_kwh = daily_kwh * 30
    cost = monthly_kwh * RATE

    return (
        f"{device_type.upper()} @ {power_w}W × {hours_per_day}h/day\n"
        f"  Monthly: {monthly_kwh:.2f} kWh = ₹{cost:.2f} (@ ₹{RATE}/kWh)"
    )


energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model="gemini-2.5-flash",
    description="Provides energy tips, cost estimates, and efficiency advice for smart home devices.",
    instruction="""
You are VoltBot's Energy Advisor. Use tools always — never guess.

get_energy_tips      → user asks for saving tips or advice on a device
estimate_monthly_cost → user asks about cost, bill, or usage estimate
list_devices         → user asks about their specific devices

Use ₹ currency, Indian context. Be concise and actionable.
If device type is unclear, ask before calling tools.
""",
    tools=[
        get_energy_tips,
        estimate_monthly_cost,
        list_devices,
    ],
)