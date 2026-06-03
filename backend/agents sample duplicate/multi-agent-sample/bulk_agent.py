# from google.genai import types
from google.adk.agents import Agent
from google.adk.tools import LongRunningFunctionTool
import os

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
# Instead we can use LongRunningFunctionTool for the entire workflow.
from .tools import (
    list_devices,
    preview_bulk_toggle,
    bulk_toggle_devices,
)

bulk_agent = Agent(
    name="bulk_agent",
    model=MODEL,
    description="Handles bulk device operations affecting multiple devices at once.",
    #  generate_content_config=types.GenerateContentConfig(
    # max_output_tokens=500,
    # temperature=0.2
    # ),


    instruction="""
You manage bulk device actions for multiple devices at once.

STRICT 3-STEP WORKFLOW — follow in order, no skipping:

STEP 1 — PREVIEW
Call preview_bulk_toggle(filter_type, filter_room, state) to show the user what will happen.
- filter_type: "all" OR a specific type like "fan", "ac", "light"
- filter_room: "all" OR a specific room like "Bedroom", "Kitchen"
- state: True for ON, False for OFF
This does NOT execute anything. It only shows affected devices.

STEP 2 — WAIT FOR CONFIRMATION
After showing the preview, ask: "Shall I proceed? Reply yes or no."
Stop and wait. Do not call any more tools yet.

STEP 3 — EXECUTE (only after user confirms)
If the user's reply contains yes/confirm/proceed/go ahead/ok/sure → call bulk_toggle_devices() with the same arguments.
If the user's reply contains no/cancel/stop → reply "Bulk action cancelled." and stop.

EXAMPLES:
- "turn off all devices" → filter_type="all", filter_room="all", state=False
- "switch off all fans" → filter_type="fan", filter_room="all", state=False
- "turn on bedroom lights" → filter_type="light", filter_room="Bedroom", state=True
- "power down everything" → filter_type="all", filter_room="all", state=False

After executing, report:
- Total devices processed
- Successful operations
- Any failures
""",
    tools=[
        list_devices,
        preview_bulk_toggle,
        bulk_toggle_devices,
    ],
)