
FROM python:3.11-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade --no-cache-dir pip setuptools wheel

RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt


# ============================ STAGE 2: RUNTIME ==============================
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV GOOGLE_GENAI_USE_VERTEXAI=true
ENV PORT=8080
ENV LOG_LEVEL=info
ENV CHROMA_DB_PATH=/tmp/chroma_db

# Create non-root user and writable tmp dirs
RUN useradd -m -u 1000 appuser && \
    mkdir -p /tmp/chroma_db /tmp/uploads /tmp/sessions && \
    chown -R appuser:appuser /tmp/chroma_db /tmp/uploads /tmp/sessions

# Copy app code
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8080

LABEL maintainer="VoltStream Team"
LABEL version="2.0.0"
LABEL description="VoltStream Energy Management API with RAG Support - GCP Cloud Run"

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1 --log-level $LOG_LEVEL --proxy-headers --forwarded-allow-ips '*' --access-log"]