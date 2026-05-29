"""
agents/__init__.py — VoltStream Week 5

Exports:
    root_agent  → used by ADK web (`adk web agents`) and routes/agent.py
    memory_agent → used directly by routes/agent.py for pre/post memory ops
"""

from .orchestrator_agent import orchestrator_agent
from .memory_agent import memory_agent

# ADK convention: root_agent is the entry point for `adk web` and Runner
root_agent = orchestrator_agent

__all__ = ["root_agent", "orchestrator_agent", "memory_agent"]