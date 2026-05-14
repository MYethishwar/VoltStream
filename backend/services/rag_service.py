from services.pdf_service import extract_text_from_pdf
from utils.chunking import chunk_text

from services.chroma_service import (
    store_chunks,
    search_chunks
)
from services.chroma_service import (
    store_temp_chunks,
    search_temp_chunks,
    clear_temp_collection
)

from google import genai

import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def process_temp_pdf(pdf_path, pdf_name):

    clear_temp_collection()

    extracted = extract_text_from_pdf(pdf_path)

    text = extracted["text"]

    chunks = chunk_text(text)

    metadata_list = []

    for idx, chunk in enumerate(chunks):

        metadata_list.append({
            "pdf_name": pdf_name,
            "chunk_id": idx,
            "page_num": idx + 1
        })

    store_temp_chunks(chunks, metadata_list)

    return {
        "success": True,
        "message": "Temporary PDF loaded successfully",
        "chunks_created": len(chunks)
}
    
    
def get_temp_rag_response(user_question):

    results = search_temp_chunks(user_question)

    documents = results["documents"][0]

    if not documents:

        return {
            "response":
                "I could not find relevant information in the uploaded document."
        }

    context = "\n\n".join(documents)

    prompt = f"""
You are VoltBot AI.

Answer naturally and conversationally.

Use ONLY the provided PDF context.

If information is unavailable,
politely explain limitations.

CONTEXT:
{context}

QUESTION:
{user_question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "response": response.text
}
    
    
    
# def get_temp_rag_response(user_question):

#     results = search_temp_chunks(user_question)

#     documents = results["documents"][0]

#     if not documents:

#         return {
#             "response":
#                 "I could not find relevant information in the uploaded document."
#         }

#     context = "\n\n".join(documents)

#     prompt = f"""
# You are VoltBot AI.

# Answer naturally and conversationally.

# Use ONLY the provided PDF context.

# If information is unavailable,
# politely explain limitations.

# CONTEXT:
# {context}

# QUESTION:
# {user_question}
# """

#     response = client.models.generate_content(
#         model="gemini-2.5-flash",
#         contents=prompt
#     )

#     return {
#         "response": response.text
#     }
    

def process_pdf(pdf_path, pdf_name, topic="general"):
    """
    Full PDF ingestion pipeline.
    """

    extracted = extract_text_from_pdf(pdf_path)

    text = extracted["text"]

    pages_extracted = extracted["pages_extracted"]

    chunks = chunk_text(text)

    metadata_list = []

    for idx, chunk in enumerate(chunks):

        metadata_list.append({
            "pdf_name": pdf_name,
            "chunk_id": idx,
            "topic": topic,
            "page_num": idx + 1
        })

    store_chunks(chunks, metadata_list)

    return {
        "success": True,
        "message": "PDF uploaded successfully",
        "pdf_name": pdf_name,
        "pages_extracted": pages_extracted,
        "chunks_created": len(chunks)
    }


def get_rag_response(user_question):
    """
    Complete RAG flow.
    """

    results = search_chunks(user_question)

    documents = results["documents"][0]

    metadatas = results["metadatas"][0]

    if not documents:
        return {
            "response": "I don't have that information",
            "sources": [],
            "has_knowledge_base_context": False
        }

    context = "\n\n".join(documents)

    prompt = f"""
You are VoltBot, an intelligent AI assistant for VoltStream.

Your job is to:
- answer naturally and conversationally
- use the provided context whenever relevant
- help users professionally
- behave like a smart assistant, not a search engine

RULES:
- If the answer exists in context, answer confidently.
- If partial information exists, answer with available information.
- If the question is unrelated to the provided context,
  politely explain that the current knowledge base
  does not contain enough information.
- Do NOT blindly say:
  "I don't have that information"
- Instead respond naturally and professionally.
- Mostly summarize the reponse if it i related to numericals. or jsur breifly conclude in a single line, if user need any further explination.
CONTEXT:
{context}

QUESTION:
{user_question}
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    sources = []

    for meta in metadatas:

        sources.append({
            "pdf_name": meta.get("pdf_name"),
            "page_num": meta.get("page_num"),
            "topic": meta.get("topic"),
            "relevance_score": 0.95
        })

    return {
        "response": response.text,
        "sources": sources,
        "has_knowledge_base_context": True
    }