from database.connection import db

from services.devices_service import (
    update_device_status
)


def get_device_status(device_name: str):

    print(list(db["devices"].find()))

    devices = db["devices"].find()

    for device in devices:

        db_name = device["name"].lower()

        if (
            device_name.lower() in db_name
            or db_name in device_name.lower()
        ):

            status = "ON" if device["status"] else "OFF"

            return f"{device['name']} is currently {status}"

    return f"{device_name} not found"

def toggle_device(device_name: str, state: bool):

    devices = db["devices"].find()

    matched_device = None

    for device in devices:

        db_name = device["name"].lower()

        if (
            device_name.lower() in db_name
            or db_name in device_name.lower()
        ):

            matched_device = device
            break

    if not matched_device:

        return f"{device_name} not found"

    update_device_status(
        str(matched_device["_id"]),
        state,
        matched_device["user_id"]
    )

    return f"{matched_device['name']} turned {'ON' if state else 'OFF'} successfully"


def list_devices():

    devices = db["devices"].find()

    names = []

    for device in devices:

        names.append(device["name"])

    return f"Available devices are: {', '.join(names)}"