from database.connection import db
from pydantic import BaseModel
from bson import ObjectId


class DeviceCreate(BaseModel):
    name: str
    room: str
    type: str
    power_w: int


class DeviceUpdate(BaseModel):
    status: bool


def serialize(device):
    device["id"] = str(device["_id"])
    del device["_id"]
    return device


def get_all_devices(user_id: str):
    devices = db["devices"].find({"user_id": user_id})
    return [serialize(d) for d in devices]


def add_device(user_id: str, device: DeviceCreate):
    new_device = {
        "user_id": user_id,
        "name": device.name,
        "room": device.room,
        "type": device.type,
        "power_w": device.power_w,
        "status": False,
    }
    result = db["devices"].insert_one(new_device)
    new_device["id"] = str(result.inserted_id)
    del new_device["_id"]
    return new_device


def update_device_status(device_id: str, status: bool, user_id: str):
    db["devices"].update_one(
        {"_id": ObjectId(device_id), "user_id": user_id},
        {"$set": {"status": status}},
    )
    return {"message": "updated"}


def delete_device(device_id: str, user_id: str):
    db["devices"].delete_one(
        {"_id": ObjectId(device_id), "user_id": user_id}
    )
    return {"message": "deleted"}