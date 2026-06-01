from google.adk.agents import Agent
from google.adk.tools import LongRunningFunctionTool

from .tools import (
    list_devices,
    toggle_device,
    request_confirmation,
)

bulk_agent = Agent(
    name="bulk_agent",
    model="gemini-2.5-flash-lite",
    description="Handles bulk device operations with user approval.",
    instruction="""
You manage bulk device actions.

Workflow:

1. Call list_devices().
2. Identify devices matching the user's request.
3. Call request_confirmation().
4. WAIT for user approval.

After approval:
5. Call toggle_device(name, state) for each device.

If rejected:
Reply with:
'Bulk action cancelled.'

Finally provide:    
- total devices processed
- successful operations
- failed operations
""",
    tools=[
        list_devices,
        toggle_device,
        LongRunningFunctionTool(
            func=request_confirmation
        ),
    ],
)