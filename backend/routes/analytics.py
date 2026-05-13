from fastapi import APIRouter
from services.analytics_service import get_analytics_data

router = APIRouter()

@router.get("/analytics")
def get_analytics(period: str = "daily"):

    return get_analytics_data(period)