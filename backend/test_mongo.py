from pymongo import MongoClient

uri = "YOUR_MONGODB_URI"

client = MongoClient(uri)

print(client.admin.command("ping"))