from google.adk.agents import Agent

from agents.tools import list_devices


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
        "ac": (
            "AC Energy Tips:\n"
            "  - Set temperature to 24-26°C for optimal efficiency\n"
            "  - Clean filters every 2 weeks — dirty filters use 15% more power\n"
            "  - Use fan mode when temperature is below 28°C\n"
            "  - Keep doors and windows closed while running\n"
            "  - Use a timer to auto-off after sleeping"
        ),
        "fan": (
            "Fan Energy Tips:\n"
            "  - Fans use ~75W vs AC's 1800W — use fans first\n"
            "  - Ceiling fans on reverse mode in winter circulate warm air\n"
            "  - Turn off fans when leaving the room — fans cool people, not rooms\n"
            "  - Clean blades monthly for better airflow efficiency"
        ),
        "light": (
            "Lighting Energy Tips:\n"
            "  - Switch to LED — uses 80% less power than incandescent\n"
            "  - Use motion sensors or timers in low-traffic areas\n"
            "  - Natural light during daytime reduces lighting load\n"
            "  - Dimmer switches can reduce consumption by 20-40%"
        ),
        "heater": (
            "Heater Energy Tips:\n"
            "  - Use timer — heat the room 30 min before you need it\n"
            "  - Insulate doors and windows to retain heat longer\n"
            "  - Set to 18-20°C for sleeping — every degree above adds 8% to bill\n"
            "  - Solar water heaters can cut water heating cost by 60-70%"
        ),
        "fridge": (
            "Refrigerator Energy Tips:\n"
            "  - Set fridge to 3-5°C and freezer to -15 to -18°C\n"
            "  - Keep it 3/4 full — empty fridges work harder\n"
            "  - Clean condenser coils every 6 months\n"
            "  - Allow hot food to cool before placing inside\n"
            "  - Check door seals — a loose seal wastes significant energy"
        ),
        "tv": (
            "TV Energy Tips:\n"
            "  - Enable auto-brightness — reduces power by up to 30%\n"
            "  - Use sleep timer to auto-off\n"
            "  - OLED/LED TVs use 40% less power than plasma\n"
            "  - Unplug when not in use — standby mode still draws power"
        ),
        "washer": (
            "Washing Machine Energy Tips:\n"
            "  - Wash with cold water — 90% of washing machine energy goes to heating water\n"
            "  - Run full loads only\n"
            "  - Use quick wash for lightly soiled clothes\n"
            "  - Clean lint filters after every wash for dryer efficiency"
        ),
        "other": (
            "General Energy Tips:\n"
            "  - Unplug devices when not in use — phantom load adds up\n"
            "  - Use smart plugs to schedule and monitor usage\n"
            "  - Peak hours (6-10 PM) have higher tariffs — shift usage if possible\n"
            "  - Regular maintenance keeps devices running efficiently"
        ),
    }
    return tips.get(
        device_type.lower().strip(),
        tips["other"]
    )


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
    RATE_PER_KWH = 8  # ₹8 per kWh (India average)

    power_w = POWER_W.get(device_type.lower().strip(), 100)
    daily_kwh = (power_w / 1000) * hours_per_day
    monthly_kwh = daily_kwh * 30
    monthly_cost = monthly_kwh * RATE_PER_KWH

    return (
        f"Monthly cost estimate for {device_type.upper()}:\n"
        f"  Power consumption : {power_w}W\n"
        f"  Daily usage       : {hours_per_day} hours\n"
        f"  Daily units       : {daily_kwh:.2f} kWh\n"
        f"  Monthly units     : {monthly_kwh:.2f} kWh\n"
        f"  Monthly cost      : ₹{monthly_cost:.2f}\n"
        f"  (At ₹{RATE_PER_KWH}/kWh)"
    )


energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model="gemini-2.5-flash",

    description="""
    Provides energy-saving tips, cost estimates, and efficiency advice
    for smart home devices. Use this agent when the user asks about
    energy consumption, electricity bills, saving tips, or cost estimates.
    """,

    instruction="""
You are VoltBot's Energy Advisor specialist.

You help users:
- Get energy-saving tips for specific device types
- Estimate monthly electricity costs based on usage
- Understand which devices consume the most power
- Make smart decisions to reduce electricity bills

## Tool Rules

### get_energy_tips
Use when user asks for tips, advice, or how to save energy for a device.
Examples: "How do I save energy on my AC?", "Tips for reducing fan power"

### estimate_monthly_cost
Use when user asks about cost, bill, or how much a device costs to run.
Examples: "How much does my AC cost per month?", "What's the bill for running a heater 8 hours a day?"

### list_devices
Use when user asks about their specific devices and wants cost/tip advice
based on what they actually have.

## Behavior
- Always give practical, actionable advice
- Use Indian context — ₹ currency, typical Indian usage patterns
- Be encouraging — frame advice as savings opportunities, not criticism
- If unsure about device type, ask before giving tips
- Keep responses concise but complete
""",

    tools=[
        get_energy_tips,
        estimate_monthly_cost,
        list_devices,
    ],
)