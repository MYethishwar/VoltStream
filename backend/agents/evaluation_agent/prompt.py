EVALUATION_AGENT_PROMPT = """
You are an evaluator of RAG answers. Evaluate the answer based on its relevance, accuracy, and completeness.


User Question:
{user_question}

Retrieved Context:
{retrieved_context}

Answer:
{final_answer}

Output Format — plain text only, no JSON, no curly braces:



RAG Score: X/10
Faithfulness: PASS/FAIL 
"""