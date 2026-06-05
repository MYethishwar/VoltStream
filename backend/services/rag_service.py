from services.pdf_service import extract_text_from_pdf
from utils.chunking import chunk_text
from collections import Counter


from services.chroma_service import (
    store_chunks,
    search_chunks
)
# from services.chroma_service import (
#     store_temp_chunks,
#     search_temp_chunks,
#     clear_temp_collection
# )

from google import genai

import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION")
)
# def process_temp_pdf(pdf_path, pdf_name):

#     clear_temp_collection()

#     extracted = extract_text_from_pdf(pdf_path)

#     text = extracted["text"]

#     chunks = chunk_text(text)

#     metadata_list = []

#     for idx, chunk in enumerate(chunks):

#         metadata_list.append({
#             "pdf_name": pdf_name,
#             "chunk_id": idx,
#             "page_num": idx + 1
#         })

#     store_temp_chunks(chunks, metadata_list)

#     return {
#         "success": True,
#         "message": "Temporary PDF loaded successfully",
#         "chunks_created": len(chunks)
# }
    
    
    
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
# }
    
    
    
# # def get_temp_rag_response(user_question):

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
- initial chat message should be professional first reponse the default one suggests you are in a rag based  environment and tell the purpose.
- If the answer exists in context, answer confidently.
- If partial information exists, answer with available information.
- If the question is unrelated to the provided context,
  politely explain that the current knowledge base
  does not contain enough information.
- Do NOT blindly say:
  "I don't have that information"
- Instead respond naturally and very professionally.
- Mostly summarize the reponse if it i related to numericals. or jsur breifly conclude in a single line, if user need any further explination.
- if user asks general knowledge questions, suggest him yo switch the above button to enable a normal conversational mode without RAG, so that you can answer general knowledge questions more freely without being restricted to the context of the knowledge base. but do not suggest this every time, only when you feel that user is asking general knowledge questions or questions that are unlikely to be answered well with the current knowledge base, then suggest them in a friendly way to switch to normal mode for better answers on such topics.
Golden rule: repond with the best possible answer and in small sentenses... mostly donot exeed 10 - 25 words in a single reponse, if needed by chance you can  extend it to maximum 40 words.   
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
        
    