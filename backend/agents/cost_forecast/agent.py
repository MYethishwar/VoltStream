from google.adk.agents import Agent
from google.genai import types
import os

from .prompt import COST_FORECAST_PROMPT
from agents.tools import forecast_monthly_cost, compare_with_average

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

print("LOADED: cost_forecast_agent")

cost_forecast_agent = Agent(
    name="cost_forecast_agent",
    model=MODEL,
    description="Forecasts next month electricity bill and compares usage against Indian averages.",
    instruction=COST_FORECAST_PROMPT,
    generate_content_config=types.GenerateContentConfig(
        max_output_tokens=150,
        temperature=0.1
    ),
    tools=[
        forecast_monthly_cost,
        compare_with_average,
    ],
    output_key="cost_forecast"
)