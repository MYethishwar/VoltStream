from database.connection import db


def get_dashboard_data():
    collection = db["dashboard"]
    data = collection.find_one({}, {"_id": 0})
    return data