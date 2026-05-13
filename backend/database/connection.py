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






# from pymongo import MongoClient
# import os
# import urllib.parse
# from dotenv import load_dotenv

# load_dotenv()

# username = urllib.parse.quote_plus(os.getenv("MONGO_USER"))
# password = urllib.parse.quote_plus(os.getenv("MONGO_PASS"))
# cluster  = os.getenv("MONGO_CLUSTER")

# client = MongoClient(f"mongodb+srv://{username}:{password}@{cluster}/?appName=VoltStream-MongoDB")
# db = client["voltstream"]