from database.connection import db


def get_analytics_data(period: str):
    collection = db["analytics"]
    data = collection.find_one({}, {"_id": 0})

    if not data or period not in data:
        return {"data": []}

    return {"data": data[period]}