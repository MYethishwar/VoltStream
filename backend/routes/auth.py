from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from database.connection import db
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey123")
ALGORITHM = "HS256"

class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str

class LoginSchema(BaseModel):
    email: str
    password: str

def create_token(user_id: str):
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"id": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

@router.post("/register")
def register(body: RegisterSchema):
    existing = db["users"].find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    hashed = hash_password(body.password)
    result = db["users"].insert_one({
        "name": body.name,
        "email": body.email,
        "password": hashed
    })
    user_id = str(result.inserted_id)
    token = create_token(user_id)
    return {"token": token, "user": {"id": user_id, "name": body.name, "email": body.email}}

@router.post("/login")
def login(body: LoginSchema):
    user = db["users"].find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user_id = str(user["_id"])
    token = create_token(user_id)
    return {"token": token, "user": {"id": user_id, "name": user["name"], "email": user["email"]}}