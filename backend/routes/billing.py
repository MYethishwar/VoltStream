from fastapi import APIRouter

router = APIRouter()

billing_data = {
    "current_month_kwh": 312.4,
    "current_month_cost_inr": 2968,
    "projected_month_cost_inr": 3850,
    "last_month_cost_inr": 3420,
    "budget_inr": 4000,
    "budget_used_percent": 74,
    "solar_savings_inr": 890,
    "rate_per_kwh": 9.5,
    "breakdown": [
        {
            "category": "Air Conditioning",
            "kwh": 124.8,
            "cost_inr": 1186,
            "percent": 40
        },
        {
            "category": "Water Heating",
            "kwh": 62.4,
            "cost_inr": 593,
            "percent": 20
        },
        {
            "category": "Refrigeration",
            "kwh": 46.8,
            "cost_inr": 445,
            "percent": 15
        }
    ]
}

@router.get("/billing")
def get_billing():
    return billing_data