from fastapi import APIRouter, HTTPException, Header
from services.devices_service import (
    get_all_devices, add_device, 
    update_device_status, delete_device, DeviceCreate, DeviceUpdate
)
from jose import jwt, JWTError
import os

router = APIRouter(prefix="/api/devices", tags=["devices"])
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")

def get_user_id(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["id"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/")
def list_devices(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    return get_all_devices(user_id)

@router.post("/")
def create_device(device: DeviceCreate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    return add_device(user_id, device)

@router.patch("/{device_id}")
def toggle_device(device_id: str, body: DeviceUpdate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    return update_device_status(device_id, body.status, user_id)

@router.delete("/{device_id}")
def remove_device(device_id: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    return delete_device(device_id, user_id)