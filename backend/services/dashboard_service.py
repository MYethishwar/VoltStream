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


def get_dashboard_data():

    collection = db["dashboard"]

    data = collection.find_one({}, {"_id": 0})

    return data