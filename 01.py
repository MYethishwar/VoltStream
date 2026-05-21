from pymongo import MongoClient
from dotenv import load_dotenv
import urllib.parse
import os

load_dotenv()

username = urllib.parse.quote_plus(os.getenv("MONGO_USER", ""))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASS", ""))
cluster = os.getenv("MONGO_CLUSTER", "")

client = MongoClient(
    f"mongodb+srv://{username}:{password}@{cluster}/?appName=VoltStream"
)

db = client["voltstream"]

collection = db["dashboard"]

dashboard_data = {
    "grid_power_kw": 3.4,
    "solar_generation_kw": 2.1,
    "net_consumption_kw": 1.3,
    "battery_percent": 72,
    "today_usage_kwh": 14.8,
    "today_solar_kwh": 9.2,
    "today_cost_inr": 142.5,
    "co2_saved_kg": 4.6,
    "grid_status": "connected",
    "solar_status": "active"
}

collection.insert_one(dashboard_data)

print("Dashboard data inserted successfully")