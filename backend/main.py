from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.info import router as info_router
from routes.dashboard import router as dashboard_router
from routes.analytics import router as analytics_router
from routes.devices import router as devices_router
from routes.billing import router as billing_router
from routes.auth import router as auth_router
from routes.chat import router as chat_router

from routes.rag import router as rag_router
from routes.pdf import router as pdf_router
from routes.agent import router as agent_router

app = FastAPI(
    title="VoltStream API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

print("PROJECT:", os.getenv("GOOGLE_CLOUD_PROJECT"))
print("LOCATION:", os.getenv("GOOGLE_CLOUD_LOCATION"))
print("VERTEX:", os.getenv("GOOGLE_GENAI_USE_VERTEXAI"))
print("CREDS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(devices_router)
app.include_router(billing_router)
app.include_router(info_router)

# Existing chatbot
app.include_router(chat_router)

# RAG routes
app.include_router(rag_router)
app.include_router(pdf_router)
app.include_router(agent_router)

@app.get("/")
def root():
    return {
        "message": "VoltStream API is running!"
    }