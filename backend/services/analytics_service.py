analytics_data = {
    "daily": [
        {
            "label": "Mon",
            "usage": 12.4,
            "solar": 8.1,
            "cost": 118
        },
        {
            "label": "Tue",
            "usage": 13.2,
            "solar": 8.5,
            "cost": 125
        },
        {
            "label": "Wed",
            "usage": 11.8,
            "solar": 7.9,
            "cost": 112
        },
        {
            "label": "Thu", 
            "usage": 14.1,
            "solar": 9.4,
            "cost": 134
        }
    ],

    "weekly": [
        {
            "label": "Week 1",
            "usage": 82,
            "solar": 58,
            "cost": 780
        },
        {
            "label": "Week 2",
            "usage": 76,
            "solar": 61,
            "cost": 720
        }
    ],

    "monthly": [
        {
            "label": "Jan",
            "usage": 320,
            "solar": 210,
            "cost": 3100
        },
        {
            "label": "Feb",
            "usage": 295,
            "solar": 220,
            "cost": 2840
        }
    ]
}

def get_analytics_data(period: str):

    if period not in analytics_data:
        return {"data": []}

    return {
        "data": analytics_data[period]
    }