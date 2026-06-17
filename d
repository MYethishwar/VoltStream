[1mdiff --git a/backend/agents/energy_pipeline/agent.py b/backend/agents/energy_pipeline/agent.py[m
[1mindex 988d0dd..f9ff91d 100644[m
[1m--- a/backend/agents/energy_pipeline/agent.py[m
[1m+++ b/backend/agents/energy_pipeline/agent.py[m
[36m@@ -1,10 +1,10 @@[m
[31m-from google.adk.agents.sequential_agent import SequentialAgent[m
[31m-from google.adk.agents.parallel_agent import ParallelAgent[m
[32m+[m[32mfrom google.adk.agents import SequentialAgent, ParallelAgent[m
 [m
 from agents.usage_analyst import usage_analyst_agent[m
 from agents.knowledge_retriever import knowledge_retriever_agent[m
 from agents.energy_advisor import energy_advisor_agent[m
 from agents.evaluation_agent import evaluation_agent[m
[32m+[m[32m# from agents.cost_forecast import cost_forecast_agent[m
 [m
 print("LOADED: energy_pipeline")[m
 [m
[1mdiff --git a/backend/services/rag_service.py b/backend/services/rag_service.py[m
[1mindex 9ebc31e..2b4b663 100644[m
[1m--- a/backend/services/rag_service.py[m
[1m+++ b/backend/services/rag_service.py[m
[36m@@ -1,3 +1,5 @@[m
[32m+[m[32mfrom sympy import python[m
[32m+[m
 from services.pdf_service import extract_text_from_pdf[m
 from utils.chunking import chunk_text[m
 from collections import Counter[m
[36m@@ -7,11 +9,6 @@[m [mfrom services.chroma_service import ([m
     store_chunks,[m
     search_chunks[m
 )[m
[31m-# from services.chroma_service import ([m
[31m-#     store_temp_chunks,[m
[31m-#     search_temp_chunks,[m
[31m-#     clear_temp_collection[m
[31m-# )[m
 [m
 from google import genai[m
 [m
[36m@@ -25,120 +22,7 @@[m [mclient = genai.Client([m
     project=os.getenv("GOOGLE_CLOUD_PROJECT"),[m
     location=os.getenv("GOOGLE_CLOUD_LOCATION")[m
 )[m
[31m-# def process_temp_pdf(pdf_path, pdf_name):[m
[31m-[m
[31m-#     clear_temp_collection()[m
[31m-[m
[31m-#     extracted = extract_text_from_pdf(pdf_path)[m
[31m-[m
[31m-#     text = extracted["text"][m
[31m-[m
[31m-#     chunks = chunk_text(text)[m
[31m-[m
[31m-#     metadata_list = [][m
[31m-[m
[31m-#     for idx, chunk in enumerate(chunks):[m
[31m-[m
[31m-#         metadata_list.append({[m
[31m-#             "pdf_name": pdf_name,[m
[31m-#             "chunk_id": idx,[m
[31m-#             "page_num": idx + 1[m
[31m-#         })[m
[31m-[m
[31m-#     store_temp_chunks(chunks, metadata_list)[m
[31m-[m
[31m-#     return {[m
[31m-#         "success": True,[m
[31m-#         "message": "Temporary PDF loaded successfully",[m
[31m-#         "chunks_created": len(chunks)[m
[31m-# }[m
[31m-    [m
[31m-    [m
[31m-    [m
[31m-# def get_temp_rag_response(user_question):[m
[31m-[m
[31m-#     results = search_temp_chunks(user_question)[m
[31m-[m
[31m-#     documents = results["documents"][0][m
[31m-[m
[31m-#     if not documents:[m
[31m-[m
[31m-#         return {[m
[31m-#             "response":[m
[31m-#                 "I could not find relevant information in the uploaded document."[m
[31m-#         }[m
[31m-[m
[31m-#     context = "\n\n".join(documents)[m
[31m-[m
[31m-#     prompt = f"""[m
[31m-# You are VoltBot AI.[m
[31m-[m
[31m-# Answer naturally and conversationally.[m
[31m-[m
[31m-# Use ONLY the provided PDF context.[m
[31m-[m
[31m-# If information is unavailable,[m
[31m-# politely explain limitations.[m
[31m-[m
[31m-# CONTEXT:[m
[31m-# {context}[m
 [m
[31m-# QUESTION:[m
[31m-# {user_question}[m
[31m-# """[m
[31m-[m
[31m-#     response = client.models.generate_content([m
[31m-#         model="gemini-2.5-flash",[m
[31m-#         contents=prompt[m
[31m-#     )[m
[31m-[m
[31m-#     return {[m
[31m-#         "response": response.text[m
[31m-# }[m
[31m-    [m
[31m-    [m
[31m-    [m
[31m-# # def get_temp_rag_response(user_question):[m
[31m-[m
[31m-#     results = search_temp_chunks(user_question)[m
[31m-[m
[31m-#     documents = results["documents"][0][m
[31m-[m
[31m-#     if not documents:[m
[31m-[m
[31m-#         return {[m
[31m-#             "response":[m
[31m-#                 "I could not find relevant information in the uploaded document."[m
[31m-#         }[m
[31m-[m
[31m-#     context = "\n\n".join(documents)[m
[31m-[m
[31m-#     prompt = f"""[m
[31m-# You are VoltBot AI.[m
[31m-[m
[31m-# Answer naturally and conversationally.[m
[31m-[m
[31m-# Use ONLY the provided PDF context.[m
[31m-[m
[31m-# If information is unavailable,[m
[31m-# politely explain limitations.[m
[31m-[m
[31m-# CONTEXT:[m
[31m-# {context}[m
[31m-[m
[31m-# QUESTION:[m
[31m-# {user_question}[m
[31m-# """[m
[31m-[m
[31m-#     response = client.models.generate_content([m
[31m-#         model="gemini-2.5-flash",[m
[31m-#         contents=prompt[m
[31m-#     )[m
[31m-[m
[31m-#     return {[m
[31m-#         "response": response.text[m
[31m-#     }[m
[31m-    [m
 [m
 def process_pdf(pdf_path, pdf_name, topic="general"):[m
     """[m
[36m@@ -196,34 +80,29 @@[m [mdef get_rag_response(user_question):[m
     context = "\n\n".join(documents)[m
 [m
     prompt = f"""[m
[31m-You are VoltBot, an intelligent AI assistant for VoltStream.[m
[31m-[m
[31m-Your job is to:[m
[31m-- answer naturally and conversationally[m
[31m-- use the provided context whenever relevant[m
[31m-- help users professionally[m
[31m-- behave like a smart assistant, not a search engine[m
[31m-[m
[31m-RULES:[m
[31m-- initial chat message should be professional first reponse the default one suggests you are in a rag based  environment and tell the purpose.[m
[31m-- If the answer exists in context, answer confidently.[m
[31m-- If partial information exists, answer with available information.[m
[31m-- If the question is unrelated to the provided context,[m
[31m-  politely explain that the current knowledge base[m
[31m-  does not contain enough information.[m
[31m-- - NEVER mention source filenames, PDF names, page numbers, or UUIDs in your response. Keep sources completely hidden from the user.[m
[31m-- Do NOT blindly say:[m
[31m-  "I don't have that information"[m
[31m-- Instead respond naturally and very professionally.[m
[31m-- Mostly summarize the reponse if it i related to numericals. or jsur breifly conclude in a single line, if user need any further explination.[m
[31m-- if user asks general knowledge questions, suggest him yo switch the above button to enable a normal conversational mode without RAG, so that you can answer general knowledge questions more freely without being restricted to the context of the knowledge base. but do not suggest this every time, only when you feel that user is asking general knowledge questions or questions that are unlikely to be answered well with the current knowledge base, then suggest them in a friendly way to switch to normal mode for better answers on such topics.[m
[31m-Golden rule: repond with the best possible answer and in small sentenses... mostly donot exeed 10 - 25 words in a single reponse, if needed by chance you can  extend it to maximum 40 words.   [m
[31m-CONTEXT:[m
[31m-{context}[m
[31m-[m
[31m-QUESTION:[m
[31m-{user_question}[m
[31m-"""[m
[32m+[m[32m    You are VoltBot, the AI assistant for VoltStream.[m
[32m+[m
[32m+[m[32m    Guidelines:[m
[32m+[m[32m    - Be professional, natural, and conversational.[m
[32m+[m[32m    - On the first message, introduce yourself and explain your purpose in the RAG environment.[m
[32m+[m[32m    - Use the provided context whenever relevant.[m
[32m+[m[32m    - If the answer is in the context, answer confidently.[m
[32m+[m[32m    - If only partial information exists, answer with the available details.[m
[32m+[m[32m    - If the question is outside the knowledge base, politely explain that the available information is insufficient.[m
[32m+[m[32m    - Never mention sources, filenames, PDFs, pages, IDs, or internal references.[m
[32m+[m[32m    - Do not use generic replies like "I don't have that information."[m
[32m+[m[32m    - For numerical or lengthy topics, provide a brief summary/conclusion first.[m
[32m+[m[32m    - Keep responses concise: usually 10–25 words, up to 40 when necessary.[m
[32m+[m[32m    - If the user asks general knowledge questions unrelated to the knowledge base, suggest switching to Normal Mode for broader answers. Only do this when appropriate.[m
[32m+[m
[32m+[m[32m    CONTEXT:[m
[32m+[m[32m    {context}[m
[32m+[m
[32m+[m[32m    QUESTION:[m
[32m+[m[32m    {user_question}[m
[32m+[m[32m    """[m
[32m+[m
[32m+[m
     response = client.models.generate_content([m
         model="gemini-2.5-flash",[m
         contents=prompt[m
[36m@@ -272,6 +151,4 @@[m [mQUESTION:[m
             "primary_source": primary_source,[m
             "sources": sources,[m
             "has_knowledge_base_context": True[m
[31m-        }[m
[31m-        [m
[31m-    [m
\ No newline at end of file[m
[32m+[m[32m        }[m
\ No newline at end of file[m
