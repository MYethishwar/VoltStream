from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chat_service import get_chat_response

router = APIRouter(
    prefix="/api/v1",
    tags=["Chat"]
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        reply = get_chat_response(request.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        if "quota_exceeded" in str(e):
            raise HTTPException(
                status_code=429,
                detail="VoltBot is temporarily unavailable due to API limits. Please try again in a minute."
            )
        raise HTTPException(status_code=500, detail=str(e))