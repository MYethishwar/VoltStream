from .router import router_agent

# Export as root_agent so ADK web auto-discovers it
# and routes/agent.py works without changes
root_agent = router_agent

__all__ = ["root_agent", "router_agent"]