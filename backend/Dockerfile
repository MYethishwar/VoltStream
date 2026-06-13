# ============================================================================
# Multi-Stage Build: VoltStream RAG-Enabled Energy Management Platform
# Stage 1: Builder - Compile dependencies with all build tools
# Stage 2: Runtime - Minimal production image
# ============================================================================

# ============================ STAGE 1: BUILDER =============================
FROM python:3.10-slim as builder

WORKDIR /app

# Install system dependencies for building packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements early for better layer caching
COPY requirements.txt .

# Create virtual environment and install dependencies
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip, setuptools, wheel
RUN pip install --upgrade --no-cache-dir pip setuptools wheel

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt


# ============================ STAGE 2: RUNTIME ==============================
FROM python:3.10-slim

WORKDIR /app

# Install runtime-only dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Set environment PATH to use venv
ENV PATH="/opt/venv/bin:$PATH"

# Set Python to run in unbuffered mode (prints output immediately)
ENV PYTHONUNBUFFERED=1

# Google Cloud Configuration
ENV GOOGLE_CLOUD_PROJECT=voltstream-yethishwar
ENV GOOGLE_CLOUD_LOCATION=us-east5
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account.json
ENV GOOGLE_GENAI_USE_VERTEXAI=true

# Application Configuration
ENV PORT=8080
ENV LOG_LEVEL=info
ENV WORKERS=4
ENV CHROMA_DB_PATH=/data/chroma_db

# Create non-root user for security
RUN useradd -m -u 1000 appuser && \
    mkdir -p /data && \
    chown -R appuser:appuser /data

# Copy application code (after user creation for permission consistency)
COPY --chown=appuser:appuser . .

# Create data directory for ChromaDB persistence
RUN mkdir -p /data/chroma_db && chown -R appuser:appuser /data

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check - verifies container is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Startup logging
RUN echo "VoltStream RAG API Container - Production Build" > /app/startup.log

# Start application with proper signal handling
CMD ["uvicorn", "main:app", \
     "--host", "0.0.0.0", \
     "--port", "8080", \
     "--workers", "4", \
     "--log-level", "info", \
     "--access-log", \
     "--ssl-keyfile=None", \
     "--ssl-certfile=None"]

# Labels for metadata
LABEL maintainer="VoltStream Team"
LABEL version="2.0.0"
LABEL description="VoltStream Energy Management API with RAG-enabled Energy Advisor Agent"
LABEL org.opencontainers.image.source="https://github.com/voltstream/voltstream-api"