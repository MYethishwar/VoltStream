from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"DEBUG - API Key loaded: {api_key[:10] if api_key else 'NOT FOUND'}")

client = genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are VoltBot, an AI assistant for VoltStream — a smart energy monitoring platform.
Help users with energy saving tips, device usage, billing questions, and analytics insights.
Be concise, friendly, and helpful. Keep responses short and clear.
"""

def get_chat_response(user_message: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                max_output_tokens=500,        # keeps it cheap
                temperature=0.7,
            ),
            contents=user_message,
        )
        return response.text
    except Exception as e:
        error_str = str(e)
        print(f"CHAT ERROR: {error_str}")
        if "429" in error_str:
            raise Exception("quota_exceeded")
        raise Exception(error_str)