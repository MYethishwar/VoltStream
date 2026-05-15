from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

from services.rag_service import (
    process_pdf,
    get_rag_response,

    # TEMP PDF FUNCTIONALITY DISABLED
    # process_temp_pdf,
    # get_temp_rag_response
)

router = APIRouter(
    prefix="/api/v1",
    tags=["RAG"]
)


class RAGRequest(BaseModel):
    message: str


@router.post("/chat/rag")
def rag_chat(request: RAGRequest):

    return get_rag_response(
        request.message
    )


# =========================================================
# TEMP PDF FUNCTIONALITY DISABLED
# =========================================================

"""
@router.post("/chat/temp/upload")
async def upload_temp_pdf(
    file: UploadFile = File(...)
):

    file_location = f"temp/{file.filename}"

    with open(file_location, "wb") as f:
        f.write(await file.read())

    return process_temp_pdf(
        file_location,
        file.filename
    )


@router.post("/chat/temp")
def temp_chat(request: RAGRequest):

    return get_temp_rag_response(
        request.message
    )
"""