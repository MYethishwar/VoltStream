from fastapi import APIRouter
from services.billing_service import get_billing_data

router = APIRouter()

@router.get("/billing")
def get_billing():

    return get_billing_data()