from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

import os

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

        file_path = os.path.join(
            PDF_STORAGE_PATH,
            file.filename
        )

        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        result = process_pdf(
            file_path,
            file.filename,
            topic
        )

        uploaded_pdfs.append({
            "name": file.filename,
            "topic": topic,
            "chunks": result["chunks_created"]
        })

        return result

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


@router.get("/pdfs")
def get_pdfs():

    return {
        "pdfs": uploaded_pdfs
    }