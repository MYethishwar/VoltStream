from sympy import python

from services.pdf_service import extract_text_from_pdf
from utils.chunking import chunk_text
from collections import Counter


from services.chroma_service import (
    store_chunks,
    search_chunks
)

from google import genai

import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION")
)


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
    You are VoltBot, the AI assistant for VoltStream.

    Guidelines:
    - Be professional, natural, and conversational.
    - On the first message, introduce yourself and explain your purpose in the RAG environment.
    - Use the provided context whenever relevant.
    - If the answer is in the context, answer confidently.
    - If only partial information exists, answer with the available details.
    - If the question is outside the knowledge base, politely explain that the available information is insufficient.
    - Never mention sources, filenames, PDFs, pages, IDs, or internal references.
    - Do not use generic replies like "I don't have that information."
    - For numerical or lengthy topics, provide a brief summary/conclusion first.
    - Keep responses concise: usually 10–25 words, up to 40 when necessary.
    - If the user asks general knowledge questions unrelated to the knowledge base, suggest switching to Normal Mode for broader answers. Only do this when appropriate.

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

    pdf_counter = Counter()

    for meta in metadatas:

        pdf_name = meta.get("pdf_name")

        if pdf_name:
            pdf_counter[pdf_name] += 1

        primary_source = None

    if pdf_counter:

        dominant_pdf = pdf_counter.most_common(1)[0][0]

        for meta in metadatas:

            if meta.get("pdf_name") == dominant_pdf:

                primary_source = {
                    "pdf_name": meta.get("pdf_name"),
                    "page_num": meta.get("page_num"),
                    "topic": meta.get("topic")
                }

                break
    return {
            "response": response.text,
            "primary_source": primary_source,
            "sources": sources,
            "has_knowledge_base_context": True
        }