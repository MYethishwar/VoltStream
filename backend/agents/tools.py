from database.connection import db
from services.devices_service import update_device_status
from bson import ObjectId
from contextvars import ContextVar

current_user_id: ContextVar[str] = ContextVar("current_user_id", default="demo_user")


POWER_DEFAULTS = {
    "ac":     1800,
    "fan":    75,
    "light":  20,
    "heater": 2000,
    "fridge": 150,
    "tv":     120,
    "washer": 500,
    "other":  100,
}

TYPE_ALIASES = {
    "air conditioner": "ac",
    "air conditioning": "ac",
    "ac": "ac",
    "fan": "fan",
    "ceiling fan": "fan",
    "table fan": "fan",
    "light": "light",
    "lights": "light",
    "bulb": "light",
    "lamp": "light",
    "heater": "heater",
    "geyser": "heater",
    "water heater": "heater",
    "fridge": "fridge",
    "refrigerator": "fridge",
    "freezer": "fridge",
    "tv": "tv",
    "television": "tv",
    "washer": "washer",
    "washing machine": "washer",
}

VALID_ROOMS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Garage"]


def resolve_type(raw_type: str) -> str:
    return TYPE_ALIASES.get(raw_type.strip().lower(), "other")


def find_device(devices: list, device_name: str) -> dict | None:
    """
    Smart device matcher with 3-tier priority:
      1. Exact name match (case-insensitive)         → "fan" matches "fan" only
      2. Full-word contained match                   → "living room fan" matches "Living Room Fan"
      3. Partial substring match (last resort)       → "ac" matches "Living Room AC"

    Returns the SINGLE best match or None.
    Never returns duplicates — always the most specific match wins.
    """
    query = device_name.strip().lower()

    # Tier 1 — exact match
    for device in devices:
        if device["name"].lower() == query:
            return device

    # Tier 2 — query is fully contained in name AND name words are all in query
    # e.g. "living room fan" → matches "Living Room Fan" but not "Bedroom Fan"
    tier2 = []
    for device in devices:
        db_name = device["name"].lower()
        db_words = set(db_name.split())
        q_words  = set(query.split())
        # Both directions must overlap meaningfully
        if db_words == q_words or db_words.issubset(q_words) or q_words.issubset(db_words):
            tier2.append(device)

    if len(tier2) == 1:
        return tier2[0]

    # If multiple tier-2 matches, pick the one whose name length is closest to query
    if len(tier2) > 1:
        tier2.sort(key=lambda d: abs(len(d["name"]) - len(device_name)))
        return tier2[0]

    # Tier 3 — substring fallback (only if nothing else matched)
    tier3 = []
    for device in devices:
        db_name = device["name"].lower()
        if query in db_name or db_name in query:
            tier3.append(device)
    
    if len(tier3) == 1:
        return tier3[0]

    # Multiple partial matches — return closest length match
    if len(tier3) > 1:
        tier3.sort(key=lambda d: abs(len(d["name"]) - len(device_name)))
        return tier3[0]

    return None



def get_device_status(device_name: str) -> str:
    """
    Get the current ON/OFF status of a smart device by name.

    Args:
        device_name: The name of the device to check. Use the exact device name
                     from list_devices() for best results.

    Returns:
        A string describing the current status of the device.
    """
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))

    matched = find_device(devices, device_name)
    if not matched:
        names = [d["name"] for d in devices]
        return (
            f"No device found matching '{device_name}'. "
            f"Available devices: {', '.join(names)}."
        )

    status = "ON" if matched["status"] else "OFF"
    return (
        f"{matched['name']} ({matched['room']}) is currently {status}."
    )


def toggle_device(device_name: str, state: bool) -> str:
    """
    Turn a specific smart device ON or OFF by its exact name.

    IMPORTANT: Always use the exact device name as returned by list_devices().
    If the user says "turn on all devices", call list_devices() first, then
    call toggle_device() once per device using the exact name from the list.

    Args:
        device_name: The EXACT name of the device (e.g. "Living Room Fan",
                     "Bedroom AC"). Do NOT use generic names like "fan" if
                     there are multiple fans — use the full name instead.
        state: True to turn ON, False to turn OFF.

    Returns:
        A string confirming the action or reporting an error.
    """
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))

    matched = find_device(devices, device_name)
    if not matched:
        names = [d["name"] for d in devices]
        return (
            f"No device found matching '{device_name}'. "
            f"Available: {', '.join(names)}."
        )

    # ── Idempotency check — prevents duplicate writes ─────────────────────────
    action = "ON" if state else "OFF"
    if matched["status"] == state:
        return (
            f"{matched['name']} is already {action}. No change made."
        )

    # ── Perform the update ────────────────────────────────────────────────────
    update_device_status(
        str(matched["_id"]),
        state,
        user_id
    )

    return (
        f"{matched['name']} ({matched['room']}) has been turned {action} successfully."
    )


def list_devices() -> str:
    """
    List all smart devices for the current user with their exact names,
    types, rooms, and current ON/OFF status.

    Always call this first before toggle_device() when:
    - The user wants to control multiple devices at once
    - You are unsure of the exact device name
    - The user says "all devices", "everything", etc.

    Returns:
        A formatted list of all devices with their exact names and statuses.
    """
    user_id = current_user_id.get()
    devices = list(db["devices"].find({"user_id": user_id}))

    if not devices:
        return "No devices found for your account."

    lines = ["Available devices (use exact names when controlling them):"]
    for device in devices:
        status = "ON" if device["status"] else "OFF"
        lines.append(
            f"  - \"{device['name']}\" | {device['type']} | {device['room']} | {status}"
        )

    return "\n".join(lines)


def add_device(device_name: str, room: str, device_type: str) -> str:
    """
    Add a new smart device to the VoltStream system for the current user.

    Args:
        device_name: Clean, properly capitalized name (e.g. "Bedroom AC", "Kitchen Light").
        room: The room. Must be one of:
              Living Room, Bedroom, Kitchen, Bathroom, Office, Garage.
              Infer from context: "my bedroom" → "Bedroom", "the kitchen" → "Kitchen".
              If truly unclear, ask the user.
        device_type: Device type in any form — "air conditioner", "tv", "washing machine"
                     are all valid and normalized automatically.

    Returns:
        A confirmation string with the created device's details, or an error message.
        
        IMPORTANT: If there are multiple devices of the same type
    (e.g. multiple ACs), always call list_devices() first to get
    exact names, then use the FULL name including room
    (e.g. "Kitchen AC" not just "AC") when calling toggle_device().

    """
    user_id = current_user_id.get()

    # ── Normalize room ─────────────────────────────────────────────────────────
    room_normalized = room.strip().title()
    matched_room = None
    for valid in VALID_ROOMS:
        if (
            room_normalized.lower() in valid.lower()
            or valid.lower() in room_normalized.lower()
        ):
            matched_room = valid
            break

    if not matched_room:
        return (
            f"Room '{room}' is not recognized. "
            f"Please use one of: {', '.join(VALID_ROOMS)}."
        )

    # ── Normalize device type ──────────────────────────────────────────────────
    canonical_type = resolve_type(device_type)
    power_w = POWER_DEFAULTS.get(canonical_type, 100)

    # ── Duplicate check (same user + name + room) ──────────────────────────────
    existing = db["devices"].find_one({
        "user_id": user_id,
        "name":    {"$regex": f"^{device_name.strip()}$", "$options": "i"},
        "room":    matched_room,
    })
    if existing:
        return (
            f"A device named '{device_name}' already exists in {matched_room}. "
            f"Please use a different name."
        )

    # ── Insert ─────────────────────────────────────────────────────────────────
    new_device = {
        "user_id": user_id,
        "name":    device_name.strip(),
        "room":    matched_room,
        "type":    canonical_type,
        "power_w": power_w,
        "status":  False,
    }

    result    = db["devices"].insert_one(new_device)
    device_id = str(result.inserted_id)

    return (
        f"'{device_name}' added successfully!\n"
        f"  Room   : {matched_room}\n"
        f"  Type   : {canonical_type}\n"
        f"  Power  : {power_w}W\n"
        f"  Status : OFF (default)\n"
        f"  ID     : {device_id}"
    )