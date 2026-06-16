from database.connection import db


def get_billing_data():
    collection = db["billing"]
    data = collection.find_one({}, {"_id": 0})
    return data