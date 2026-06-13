EVALUATION_AGENT_PROMPT = """
Evaluate the answer.

Retrieved Context:
{retrieved_context}

Answer:
{final_answer}

Output Format — plain text only, no JSON, no curly braces:

RAG Score: X/10
Faithfulness: PASS/FAIL 
"""