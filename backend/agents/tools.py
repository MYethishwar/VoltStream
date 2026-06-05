from database.connection import db
from services.devices_service import update_device_status
from services.rag_service import get_rag_response          # FIX: moved to top
from contextvars import ContextVar
from datetime import datetime, timedelta

from functools import wraps

from google import genai
import os

client = genai.Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION")
)

def device_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"\n🔵 DEVICE TOOL: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


def energy_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"\n🟢 ENERGY TOOL: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


def bulk_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"\n🟠 BULK TOOL: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


def rag_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"\n🟣 RAG TOOL: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


def db_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"\n🟡 DB TOOL: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper


def hitl_tool(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"\n🔴 HITL CHECKPOINT: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

current_user_id: ContextVar[str] = ContextVar("current_user_id", default="demo_user")

POWER_DEFAULTS = {
    "ac": 1800, "fan": 75, "light": 20, "heater": 2000,
    "fridge": 150, "tv": 120, "washer": 500, "other": 100,
}

TYPE_ALIASES = {
    "air conditioner": "ac", "air conditioning": "ac", "ac": "ac",
    "fan": "fan", "ceiling fan": "fan", "table fan": "fan",
    "light": "light", "lights": "light", "bulb": "light", "lamp": "light",
    "heater": "heater", "geyser": "heater", "water heater": "heater",
    "geysar": "heater",
    "fridge": "fridge", "refrigerator": "fridge", "freezer": "fridge",
    "tv": "tv", "television": "tv",
    "washer": "washer", "washing machine": "washer",
}

VALID_ROOMS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Garage"]
RATE_PER_KWH = 8  # ₹8/kWh


def resolve_type(raw_type: str) -> str:
    return TYPE_ALIASES.get(raw_type.strip().lower(), "other")


def find_device(devices: list, device_name: str) -> dict | None:
    query = device_name.strip().lower()
    for device in devices:
        if device["name"].lower() == query:
            return device
    tier2 = []
    for device in devices:
        db_words = set(device["name"].lower().split())
        q_words = set(query.split())
        if db_words == q_words or db_words.issubset(q_words) or q_words.issubset(db_words):
            tier2.append(device)
    if len(tier2) == 1:
        return tier2[0]
    if len(tier2) > 1:
        return sorted(tier2, key=lambda d: abs(len(d["name"]) - len(device_name)))[0]
    tier3 = [d for d in devices if query in d["name"].lower() or d["name"].lower() in query]
    if len(tier3) == 1:
        return tier3[0]
    if len(tier3) > 1:
        return sorted(tier3, key=lambda d: abs(len(d["name"]) - len(device_name)))[0]
    return None


# ── Device control tools ───────────────────────────────────────────────────────
@device_tool
def get_device_status(device_name: str) -> str:
    """Get the current ON/OFF status of a device by name."""
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))
    matched = find_device(devices, device_name)
    if not matched:
        return f"No device matching '{device_name}'. Available: {', '.join(d['name'] for d in devices)}."
    return f"{matched['name']} ({matched['room']}) is {'ON' if matched['status'] else 'OFF'}."


@device_tool
def toggle_device(device_name: str, state: bool) -> str:
    """Turn a device ON (state=True) or OFF (state=False). Use exact name from list_devices()."""
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))
    matched = find_device(devices, device_name)
    if not matched:
        return f"No device matching '{device_name}'. Available: {', '.join(d['name'] for d in devices)}."
    action = "ON" if state else "OFF"
    if matched["status"] == state:
        return f"{matched['name']} is already {action}."
    update_device_status(str(matched["_id"]), state, user_id)
    _log_device_event(user_id, str(matched["_id"]), matched["name"], matched["type"], matched["power_w"], action)
    return f"{matched['name']} ({matched['room']}) turned {action}."


@device_tool
def list_devices() -> str:
    """List all devices with exact names, types, rooms, and status."""
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))
    if not devices:
        return "No devices found."
    lines = ["Your devices:"]
    for d in devices:
        lines.append(f'  "{d["name"]}" | {d["type"]} | {d["room"]} | {"ON" if d["status"] else "OFF"}')
    return "\n".join(lines)

@db_tool    
def add_device(device_name: str, room: str, device_type: str) -> str:
    """Add a new device. room must be one of the valid rooms. device_type is normalized automatically."""
    user_id = current_user_id.get()
    room_normalized = room.strip().title()
    matched_room = next(
        (v for v in VALID_ROOMS if room_normalized.lower() in v.lower() or v.lower() in room_normalized.lower()),
        None
    )
    if not matched_room:
        return f"Room '{room}' not recognized. Use: {', '.join(VALID_ROOMS)}."
    canonical_type = resolve_type(device_type)
    power_w = POWER_DEFAULTS.get(canonical_type, 100)
    existing = db["devices"].find_one({
        "user_id": user_id,
        "name": {"$regex": f"^{device_name.strip()}$", "$options": "i"},
        "room": matched_room,
    })
    if existing:
        return f"'{device_name}' already exists in {matched_room}. Use a different name."
    result = db["devices"].insert_one({
        "user_id": user_id, "name": device_name.strip(), "room": matched_room,
        "type": canonical_type, "power_w": power_w, "status": False,
    })
    return f"'{device_name}' added in {matched_room} ({canonical_type}, {power_w}W). ID: {result.inserted_id}"


# ── Bulk operation tools ───────────────────────────────────────────────────────
@bulk_tool
def bulk_toggle_devices(filter_type: str, filter_room: str, state: bool) -> str:
    """
    Toggle multiple devices at once based on optional type and room filters.
    Executes immediately — confirmation must be done before calling this.

    Args:
        filter_type: device type to filter by (e.g. 'fan', 'ac', 'all' for no filter)
        filter_room: room to filter by (e.g. 'Bedroom', 'all' for no filter)
        state: True=ON, False=OFF
    """
    user_id = current_user_id.get()
    query: dict = {"user_id": user_id}

    if filter_type and filter_type.lower() != "all":
        canonical = resolve_type(filter_type)
        query["type"] = canonical

    if filter_room and filter_room.lower() != "all":
        room_normalized = filter_room.strip().title()
        matched_room = next(
            (v for v in VALID_ROOMS if room_normalized.lower() in v.lower() or v.lower() in room_normalized.lower()),
            None
        )
        if matched_room:
            query["room"] = matched_room

    devices = list(db["devices"].find(query))
    if not devices:
        return "No matching devices found."

    action = "ON" if state else "OFF"
    results = []
    success = 0
    failed = 0

    for device in devices:
        try:
            if device["status"] != state:
                update_device_status(str(device["_id"]), state, user_id)
                _log_device_event(
                    user_id, str(device["_id"]),
                    device["name"], device["type"],
                    device["power_w"], action
                )
            results.append(f'  ✓ {device["name"]} ({device["room"]}) → {action}')
            success += 1
        except Exception as e:
            results.append(f'  ✗ {device["name"]} failed: {e}')
            failed += 1

    summary = f"Bulk action complete: {success} succeeded, {failed} failed.\n"
    return summary + "\n".join(results)


@hitl_tool
@bulk_tool
def preview_bulk_toggle(filter_type: str, filter_room: str, state: bool) -> str:
    """
    Preview which devices will be affected by a bulk toggle — WITHOUT executing it.
    Call this FIRST to show the user what will happen, then ask for confirmation.

    Args:
        filter_type: device type to filter by (e.g. 'fan', 'ac', 'all' for no filter)
        filter_room: room to filter by (e.g. 'Bedroom', 'all' for no filter)
        state: True=ON, False=OFF
    """
    user_id = current_user_id.get()
    query: dict = {"user_id": user_id}

    if filter_type and filter_type.lower() != "all":
        canonical = resolve_type(filter_type)
        query["type"] = canonical

    if filter_room and filter_room.lower() != "all":
        room_normalized = filter_room.strip().title()
        matched_room = next(
            (v for v in VALID_ROOMS if room_normalized.lower() in v.lower() or v.lower() in room_normalized.lower()),
            None
        )
        if matched_room:
            query["room"] = matched_room

    devices = list(db["devices"].find(query))
    if not devices:
        return "No matching devices found."

    action = "ON" if state else "OFF"
    lines = [f"The following {len(devices)} device(s) will be turned {action}:"]
    for d in devices:
        lines.append(f'  - "{d["name"]}" | {d["type"]} | {d["room"]} | currently {"ON" if d["status"] else "OFF"}')
    lines.append('\nReply "yes" to confirm or "no" to cancel.')
    return "\n".join(lines)


# ── Usage history tools ────────────────────────────────────────────────────────

def _log_device_event(user_id: str, device_id: str, device_name: str, device_type: str, power_w: int, action: str):
    """Internal: record ON/OFF event to usage_history collection."""
    db["usage_history"].insert_one({
        "user_id": user_id,
        "device_id": device_id,
        "device_name": device_name,
        "device_type": device_type,
        "power_w": power_w,
        "action": action,
        "timestamp": datetime.utcnow(),
    })

@energy_tool
def get_usage_history(days: int = 7) -> str:
    """
    Retrieve and summarize device usage for the past N days (default 7).
    Returns per-device runtime hours, kWh consumed, and estimated cost in ₹.

    Args:
        days: Number of past days to analyze (1–30).
    """
    user_id = current_user_id.get()
    since = datetime.utcnow() - timedelta(days=max(1, min(days, 30)))
    events = list(db["usage_history"].find(
        {"user_id": user_id, "timestamp": {"$gte": since}},
        sort=[("timestamp", 1)]
    ))

    if not events:
        return (
            f"No usage data found for the past {days} days. "
            "Call the /api/v1/agent/seed-usage endpoint first to populate demo data."
        )

    sessions: dict[str, dict] = {}
    for e in events:
        did = e["device_id"]
        if did not in sessions:
            sessions[did] = {
                "name": e["device_name"], "type": e["device_type"],
                "power_w": e["power_w"], "total_minutes": 0, "on_at": None,
            }
        s = sessions[did]
        if e["action"] == "ON":
            s["on_at"] = e["timestamp"]
        elif e["action"] == "OFF" and s["on_at"]:
            s["total_minutes"] += (e["timestamp"] - s["on_at"]).total_seconds() / 60
            s["on_at"] = None

    lines = [f"Usage summary — last {days} days:", ""]
    total_cost = 0.0
    highest_device = None
    highest_kwh = 0.0

    for did, s in sessions.items():
        hours = s["total_minutes"] / 60
        kwh = (s["power_w"] / 1000) * hours
        cost = kwh * RATE_PER_KWH
        total_cost += cost
        if kwh > highest_kwh:
            highest_kwh = kwh
            highest_device = s["name"]
        lines.append(f"  {s['name']} ({s['type']}): {hours:.1f}h → {kwh:.2f} kWh → ₹{cost:.2f}")

    lines.append(f"\n  Highest consuming device: {highest_device or 'N/A'}")
    lines.append(f"  Total estimated cost: ₹{total_cost:.2f}")
    return "\n".join(lines)

@energy_tool
def get_peak_hours() -> str:
    """
    Identify the peak usage hours in the last 7 days — when the most devices
    were ON simultaneously.
    """
    user_id = current_user_id.get()
    since = datetime.utcnow() - timedelta(days=7)
    events = list(db["usage_history"].find({"user_id": user_id, "timestamp": {"$gte": since}}))

    if not events:
        return "No usage data to analyze peak hours yet. Seed usage data first."

    hour_counts: dict[int, int] = {h: 0 for h in range(24)}
    for e in events:
        if e["action"] == "ON":
            hour_counts[e["timestamp"].hour] += 1

    top_hours = sorted(hour_counts.items(), key=lambda x: -x[1])[:4]
    lines = ["Peak usage hours (last 7 days):"]
    for hr, count in top_hours:
        label = f"{hr:02d}:00–{hr + 1:02d}:00"
        lines.append(f"  {label} → {count} device activations")

    peak_hour = top_hours[0][0] if top_hours else -1
    if 18 <= peak_hour <= 22:
        lines.append("\n  ⚠ Peak overlaps high-tariff grid hours (6–10 PM). Consider shifting to morning.")
    return "\n".join(lines)

@energy_tool
def get_smart_schedule() -> str:
    """
    Suggest an optimized device schedule based on the user's usage history.
    """
    user_id = current_user_id.get()
    since = datetime.utcnow() - timedelta(days=7)
    events = list(db["usage_history"].find({"user_id": user_id, "timestamp": {"$gte": since}}))

    if not events:
        return "No usage history yet to generate a schedule. Seed usage data first."

    device_hours: dict[str, list[int]] = {}
    for e in events:
        if e["action"] == "ON":
            dt = e["device_type"]
            device_hours.setdefault(dt, []).append(e["timestamp"].hour)

    suggestions = []
    for dtype, hours in device_hours.items():
        avg_hour = sum(hours) / len(hours)
        if dtype == "washer" and avg_hour >= 18:
            suggestions.append("  Washer: shift to 6–8 AM (cold morning wash saves heating energy + off-peak tariff)")
        if dtype == "ac" and avg_hour >= 14:
            suggestions.append("  AC: pre-cool at 12–1 PM (before peak sun) then raise setpoint to 26°C by 3 PM")
        if dtype == "heater" and avg_hour >= 20:
            suggestions.append("  Water heater: use timer — heat at 5:30 AM instead of evening peak")
        if dtype == "light" and avg_hour >= 19:
            suggestions.append("  Lights: install motion sensors to cut idle-on time by ~40%")

    if not suggestions:
        return "Your current schedule looks efficient! No major shifts recommended."

    return "Smart schedule suggestions based on your usage:\n" + "\n".join(suggestions)

@rag_tool
def get_energy_knowledge(query: str) -> str:
    """
    Search VoltStream knowledge base for energy saving guidance.

    Args:
        query: question to search in uploaded PDF knowledge base
    """
    result = get_rag_response(query)
    if isinstance(result, dict):
        return result.get("response", "No recommendations found.")
    return str(result)

from services.rag_service import get_rag_response

def rag_energy_search(query: str):
    print("RAG RETRIEVAL EXECUTED")

    result = get_rag_response(query)

    response = result["response"]

    primary_source = result.get("primary_source")

    if primary_source:

        source_text = (
            f"{primary_source['pdf_name']} "
            f"(Page {primary_source['page_num']})"
        )

    else:

        source_text = "No source identified"

    print("RAG TOOL:", query)
    print("PRIMARY SOURCE:", source_text)

    return f"""
Retrieved Context:
{response}

Primary Source:
{source_text}
"""
    
def evaluate_rag_answer(
    question: str,
    context: str,
    answer: str
):
    print("EVALUATION RUNNING")
    print("QUESTION:", question)

    prompt = f"""
You are an expert RAG evaluator.

Question:
{question}

Retrieved Context:
{context}

Answer:
{answer}

Evaluate:

1. Faithfulness (1-10)
2. Relevance (1-10)

PASS if both >= 7

Return:

Faithfulness:
Relevance:
Result:
Reason:
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text