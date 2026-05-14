from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel

import shutil
import os

from services.rag_service import (
    get_rag_response,
    process_temp_pdf,
    get_temp_rag_response
)

router = APIRouter(
    prefix="/api/v1",
    tags=["RAG"]
)

TEMP_FOLDER = "./temp_pdfs"

os.makedirs(TEMP_FOLDER, exist_ok=True)


class RAGRequest(BaseModel):
    message: str


# ==========================================
# EXISTING PERSISTENT RAG
# ==========================================

@router.post("/chat/rag")
def rag_chat(request: RAGRequest):

    return get_rag_response(
        request.message
    )


# ==========================================
# TEMP PDF UPLOAD
# ==========================================

@router.post("/chat/temp/upload")
async def upload_temp_pdf(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        TEMP_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_temp_pdf(
        file_path,
        file.filename
    )

    return result


# ==========================================
# TEMP RAG CHAT
# ==========================================

@router.post("/chat/temp")
def temp_rag_chat(request: RAGRequest):

    return get_temp_rag_response(
        request.message
    )