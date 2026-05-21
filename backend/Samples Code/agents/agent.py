from google.adk.agents import Agent

from .tools import (
    get_device_status,
    toggle_device,
    list_devices
)

root_agent = Agent(

    name="voltstream_device_agent",

    model="gemini-2.5-flash",

    description="VoltStream Device Controller",

    instruction="""
You are VoltStream smart home device agent.

Use available tools whenever required based on the user request. Always try to be concise and to the point in your responses.4

""",

    tools=[
        get_device_status,
        toggle_device,
        list_devices,
    ]
)