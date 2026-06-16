import chromadb
import uuid
import os
import io

from services.embedding_service import generate_embedding

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "/tmp/chroma_db")
GCS_BUCKET = os.getenv("GCS_BUCKET", "voltstream-pdfs")

persistent_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

persistent_collection = persistent_client.get_or_create_collection(
    name="voltstream_docs"
)

temp_client = chromadb.Client()
temp_collection = temp_client.get_or_create_collection(name="temp_docs")


# =====================================================
# GCS HELPERS
# =====================================================

def _get_gcs_client():
    from google.cloud import storage
    return storage.Client()

def upload_pdf_to_gcs(local_path: str, blob_name: str) -> str:
    """Upload a PDF file to GCS and return the GCS URI."""
    client = _get_gcs_client()
    bucket = client.bucket(GCS_BUCKET)
    blob = bucket.blob(f"pdfs/{blob_name}")
    blob.upload_from_filename(local_path, content_type="application/pdf")
    return f"gs://{GCS_BUCKET}/pdfs/{blob_name}"

def list_gcs_pdfs():
    """List all PDFs stored in GCS."""
    client = _get_gcs_client()
    bucket = client.bucket(GCS_BUCKET)
    return list(bucket.list_blobs(prefix="pdfs/"))

def download_pdf_from_gcs(blob_name: str, local_path: str):
    """Download a PDF from GCS to a local path."""
    client = _get_gcs_client()
    bucket = client.bucket(GCS_BUCKET)
    blob = bucket.blob(blob_name)
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    blob.download_to_filename(local_path)


# =====================================================
# STARTUP: Rebuild index from GCS
# =====================================================

def rebuild_index_from_gcs():
    """
    On startup, download all PDFs from GCS and re-index them
    into ChromaDB if the collection is empty.
    """
    import logging
    logger = logging.getLogger(__name__)

    try:
        count = persistent_collection.count()
        if count > 0:
            logger.info(f"✅ ChromaDB already has {count} chunks — skipping rebuild")
            return

        blobs = list_gcs_pdfs()
        if not blobs:
            logger.info("ℹ️  No PDFs in GCS bucket — nothing to index")
            return

        logger.info(f"🔄 Rebuilding ChromaDB index from {len(blobs)} GCS PDFs...")

        from services.pdf_service import extract_text_from_pdf
        from utils.chunking import chunk_text

        for blob in blobs:
            try:
                blob_name = blob.name  # e.g. "pdfs/uuid_filename.pdf"
                filename = blob_name.split("/")[-1]
                local_path = f"/tmp/gcs_downloads/{filename}"

                download_pdf_from_gcs(blob_name, local_path)
                extracted = extract_text_from_pdf(local_path)
                chunks = chunk_text(extracted["text"])

                metadata_list = [
                    {"pdf_name": filename, "chunk_id": i, "topic": "general", "page_num": i + 1}
                    for i in range(len(chunks))
                ]
                store_chunks(chunks, metadata_list)
                logger.info(f"  ✅ Indexed {filename} — {len(chunks)} chunks")

            except Exception as e:
                logger.warning(f"  ⚠️  Failed to index {blob.name}: {e}")

        logger.info("✅ ChromaDB rebuild complete")

    except Exception as e:
        logger.error(f"❌ GCS rebuild failed: {e}")


# =====================================================
# PERSISTENT STORAGE
# =====================================================

def store_chunks(chunks, metadata_list):
    for idx, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)
        persistent_collection.add(
            ids=[str(uuid.uuid4())],
            documents=[chunk],
            embeddings=[embedding],
            metadatas=[metadata_list[idx]]
        )


def search_chunks(query, top_k=3):
    query_embedding = generate_embedding(query)
    results = persistent_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results


# =====================================================
# TEMPORARY SESSION STORAGE
# =====================================================

def clear_temp_collection():
    global temp_collection
    temp_client.delete_collection("temp_docs")
    temp_collection = temp_client.get_or_create_collection(name="temp_docs")


def store_temp_chunks(chunks, metadata_list):
    for idx, chunk in enumerate(chunks):
        embedding = generate_embedding(chunk)
        temp_collection.add(
            ids=[str(uuid.uuid4())],
            documents=[chunk],
            embeddings=[embedding],
            metadatas=[metadata_list[idx]]
        )


def search_temp_chunks(query, top_k=3):
    query_embedding = generate_embedding(query)
    results = temp_collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
    return results