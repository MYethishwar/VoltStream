# """
# tracing.py

# Central tracing setup for VoltStream.
# Import and call setup_tracing() once at the top of main.py — before everything else.

# What this does:
# - Starts a Phoenix server locally at http://localhost:6006
# - Creates a TracerProvider that sends spans to Phoenix
# - Auto-instruments FastAPI (HTTP request/response spans)
# - Exposes a get_tracer() function for manual agent spans

# Usage in main.py:
#     from tracing import setup_tracing, get_tracer
#     setup_tracing()
# """

# import phoenix as px
# from phoenix.otel import register
# # from openinference.instrumentation.fastapi import FastAPIInstrumentor
# from opentelemetry.trace import StatusCode
# import logging

# logger = logging.getLogger(__name__)

# # Module-level tracer — set once, used everywhere
# _tracer = None


# def setup_tracing(app=None):
#     """
#     Initialize Phoenix and OpenTelemetry tracing.

#     Call this once in main.py after creating the FastAPI app.
#     Pass the FastAPI app instance to also enable HTTP request tracing.

#     Args:
#         app: FastAPI app instance (optional — enables HTTP span auto-instrumentation)
#     """
#     global _tracer

#     # ── Launch Phoenix UI locally ──────────────────────────────────────────────
#     # Opens at http://localhost:6006
#     # All spans are sent here and visible as a trace tree
#     # px.launch_app()

#     # ── Register TracerProvider → sends traces to Phoenix ─────────────────────
#     tracer_provider = register(
#         project_name="voltstream-agents",
#         endpoint="http://localhost:6006/v1/traces",
#     )

#     # ── Auto-instrument FastAPI ────────────────────────────────────────────────
#     # Every HTTP request to /api/v1/agent, /api/devices/, etc.
#     # gets a span automatically — no manual code needed in routes
#     if app is not None:
#         # from openinference.instrumentation.fastapi import FastAPIInstrumentor
#         # FastAPIInstrumentor.instrument_app(app, tracer_provider=tracer_provider)
#         logger.info("✅ FastAPI instrumented for tracing")

#     # ── Get the tracer object for manual spans ─────────────────────────────────
#     _tracer = tracer_provider.get_tracer("voltstream")

#     logger.info("✅ Phoenix tracing started at http://localhost:6006")
#     print("🔭 Phoenix UI → http://localhost:6006")

#     return _tracer


# def get_tracer():
#     """
#     Get the global tracer. Call this in any agent or tool file
#     to create manual spans.

#     Returns:
#         OpenTelemetry Tracer instance
#     """
#     if _tracer is None:
#         raise RuntimeError(
#             "Tracer not initialized. Call setup_tracing() in main.py first."
#         )
#     return _tracer