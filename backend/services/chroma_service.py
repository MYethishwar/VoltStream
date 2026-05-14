import chromadb
import uuid
import os

from services.embedding_service import generate_embedding

# -----------------------------
# Persistent DB (Old System)
# -----------------------------

CHROMA_DB_PATH = os.getenv(
    "CHROMA_DB_PATH",
    "./chroma_db"
)

persistent_client = chromadb.PersistentClient(
    path=CHROMA_DB_PATH
)

persistent_collection = (
    persistent_client.get_or_create_collection(
        name="voltstream_docs"
    )
)

# -----------------------------
# Temporary In-Memory DB
# -----------------------------

temp_client = chromadb.Client()

temp_collection = temp_client.get_or_create_collection(
    name="temp_docs"
)


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

    temp_collection = temp_client.get_or_create_collection(
        name="temp_docs"
    )


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