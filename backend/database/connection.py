from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in your .env file")

client = MongoClient(MONGO_URI)

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB Atlas!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    raise

db = client["voltstream"]