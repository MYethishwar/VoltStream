import os
import logging
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
os.environ["GOOGLE_CLOUD_PROJECT"]      = os.getenv("GOOGLE_CLOUD_PROJECT", "voltstream-yethishwar")
os.environ["GOOGLE_CLOUD_LOCATION"]     = os.getenv("GOOGLE_CLOUD_LOCATION", "us-east5")
os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "true"

for var in ["JWT_SECRET", "GOOGLE_CLOUD_PROJECT", "MONGO_URI"]:
    if not os.getenv(var):
        logger.warning(f"⚠️  Environment variable '{var}' not set")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.info       import router as info_router
from routes.dashboard  import router as dashboard_router
from routes.analytics  import router as analytics_router
from routes.devices    import router as devices_router
from routes.billing    import router as billing_router
from routes.auth       import router as auth_router
from routes.chat       import router as chat_router
from routes.rag        import router as rag_router
from routes.pdf        import router as pdf_router
from routes.agent      import router as agent_router

app = FastAPI(
    title="VoltStream API",
    version="2.0.0",
    description="VoltStream: Energy Management Platform with RAG-enabled AI Assistant"
)

logger.info("🚀 Starting VoltStream API v2.0.0")

# CORS — supports both local dev and production Firebase hosting
allowed_origins_raw = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://voltstream-yethishwar-68e21.web.app,https://voltstream-yethishwar-68e21.firebaseapp.com",
)
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",")]
logger.info(f"✅ CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"❌ Unhandled error: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(devices_router)
app.include_router(billing_router)
app.include_router(info_router)
app.include_router(chat_router)
app.include_router(rag_router)
app.include_router(pdf_router)
app.include_router(agent_router)

@app.get("/")
def root():
    return {
        "message": "VoltStream API v2.0 is running!",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }

@app.get("/readiness")
def readiness():
    try:
        from database.connection import client
        client.admin.command("ping")
        return {"ready": True, "message": "All systems operational"}
    except Exception as e:
        logger.warning(f"⚠️  Readiness check failed: {str(e)}")
        return {"ready": False, "message": str(e)}

@app.on_event("startup")
async def startup_event():
    logger.info("✅ Application startup complete")
    # Rebuild ChromaDB index from GCS on every cold start
    from services.chroma_service import rebuild_index_from_gcs
    from fastapi.concurrency import run_in_threadpool
    await run_in_threadpool(rebuild_index_from_gcs)
    
    
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 Application shutdown")