from google.adk.agents import Agent
# from google.genai import types

import os

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

from agents.tools import (
    get_energy_knowledge,
    get_smart_schedule,
)

energy_advisor_agent = Agent(
    name="energy_advisor_agent",
    model=MODEL,
    description="Provides personalized energy recommendations using usage analysis and VoltStream knowledge base.",
    #  generate_content_config=types.GenerateContentConfig(
    # max_output_tokens=500,
    # temperature=0.2
    # ),
    instruction="""
You are VoltStream's Energy Advisor.

You are VoltStream's Energy Advisor.

The previous agent provides an energy usage summary.
Use that summary when generating recommendations.
Workflow:

1. Review the usage analysis provided by the previous agent.
2. Identify the device causing the highest energy consumption
3. Identify major usage patterns
4. Call get_energy_knowledge()
5. Call get_smart_schedule() when useful
6. Generate personalized recommendations

IMPORTANT:

- Use the usage analysis as the primary context.
- Do not give generic recommendations.
- Base recommendations on the user's actual usage.
- Use information retrieved from the knowledge base.
- Focus on the biggest saving opportunities.

Response Format:

1. Key Finding
2. Recommendations
3. Expected Benefit
4. One Quick Action User Can Take Today
""",
    tools=[
        get_energy_knowledge,
        get_smart_schedule,
    ],
)