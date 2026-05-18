from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from fastapi.concurrency import run_in_threadpool

import os
import uuid
import shutil

from services.rag_service import process_pdf

router = APIRouter(
    prefix="/api/v1",
    tags=["PDF"]
)

PDF_STORAGE_PATH = os.getenv(
    "PDF_STORAGE_PATH",
    "./uploaded_pdfs"
)

os.makedirs(PDF_STORAGE_PATH, exist_ok=True)

uploaded_pdfs = []


@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    topic: str = Form("general")
):

    try:

        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )

        unique_name = f"{uuid.uuid4()}_{file.filename}"

        file_path = os.path.join(
            PDF_STORAGE_PATH,
            unique_name
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = await run_in_threadpool(
            process_pdf,
            file_path,
            unique_name,
            topic
        )

        uploaded_pdfs.append({
            "name": unique_name,
            "topic": topic,
            "chunks": result["chunks_created"]
        })

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/pdfs")
def get_pdfs():

    return {
        "pdfs": uploaded_pdfs
    }