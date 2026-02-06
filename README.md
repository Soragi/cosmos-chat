# AIQ Research Assistant Web UI

A stunning ChatGPT-style interface for the NVIDIA AIQ Research Assistant with an animated cosmic neural network background and agent orchestration visualization.

![NVIDIA](https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🚀 Quick Start

### Step 0: Set Up API Keys (Required First!)

**Security Note:** This project uses secure methods to handle API keys via environment variables.

```bash
# Required: NVIDIA API Key for NIM microservices
export NVIDIA_API_KEY="your-nvidia-api-key"

# Optional: Tavily API Key for web search functionality
export TAVILY_API_KEY="your-tavily-api-key"
```

> **Where to get API keys:**
> - **NVIDIA API Key**: Get from [NVIDIA NGC](https://ngc.nvidia.com/) or [NVIDIA AI Enterprise](https://www.nvidia.com/en-us/data-center/products/ai-enterprise/)
> - **Tavily API Key**: Get from [Tavily](https://tavily.com/) (optional, enables web search)

### Step 1: Authenticate Docker with NGC

```bash
echo $NVIDIA_API_KEY | docker login nvcr.io -u '$oauthtoken' --password-stdin
```

---

## 📦 Full Deployment Guide

### Step 2: Deploy NVIDIA RAG Blueprint

Clone the NVIDIA RAG blueprint repository:

```bash
git clone https://github.com/NVIDIA-AI-Blueprints/rag.git -b main
```

Set the environment variables for hosted NVIDIA NIM microservices:

```bash
export APP_EMBEDDINGS_MODELNAME="nvidia/llama-3.2-nv-embedqa-1b-v2"
export APP_RANKING_MODELNAME="nvidia/llama-3.2-nv-rerankqa-1b-v2"
export APP_EMBEDDINGS_SERVERURL=""
export APP_LLM_SERVERURL=""
export APP_LLM_MODELNAME="nvidia/llama-3.3-nemotron-super-49b-v1.5"
export APP_FILTEREXPRESSIONGENERATOR_MODELNAME="nvidia/llama-3.3-nemotron-super-49b-v1.5"
export APP_FILTEREXPRESSIONGENERATOR_SERVERURL=""
export SUMMARY_LLM="nvidia/llama-3.3-nemotron-super-49b-v1.5"
export APP_RANKING_SERVERURL=""
export SUMMARY_LLM_SERVERURL=""
export OCR_HTTP_ENDPOINT="https://ai.api.nvidia.com/v1/cv/baidu/paddleocr"
export OCR_INFER_PROTOCOL="http"
export OCR_MODEL_NAME="paddle"
export YOLOX_HTTP_ENDPOINT="https://ai.api.nvidia.com/v1/cv/nvidia/nemoretriever-page-elements-v2"
export YOLOX_INFER_PROTOCOL="http"
export YOLOX_GRAPHIC_ELEMENTS_HTTP_ENDPOINT="https://ai.api.nvidia.com/v1/cv/nvidia/nemoretriever-graphic-elements-v1"
export YOLOX_GRAPHIC_ELEMENTS_INFER_PROTOCOL="http"
export YOLOX_TABLE_STRUCTURE_HTTP_ENDPOINT="https://ai.api.nvidia.com/v1/cv/nvidia/nemoretriever-table-structure-v1"
export YOLOX_TABLE_STRUCTURE_INFER_PROTOCOL="http"
export APP_QUERYREWRITER_SERVERURL=""
export APP_QUERYREWRITER_MODELNAME="nvidia/llama-3.3-nemotron-super-49b-v1.5"
export ENABLE_RERANKER="false"
```

Start the RAG services:

```bash
# Start vector database
docker compose -f rag/deploy/compose/vectordb.yaml up -d

# Start ingestion server
docker compose -f rag/deploy/compose/docker-compose-ingestor-server.yaml up -d

# Start RAG server
docker compose -f rag/deploy/compose/docker-compose-rag-server.yaml up -d
```

Verify RAG containers are running:

```bash
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

Expected containers:
| Container | Description |
|-----------|-------------|
| rag-server | RAG API server |
| compose-nv-ingest-ms-runtime-1 | Ingestion runtime |
| ingestor-server | Ingestion API |
| milvus-standalone | Vector database |
| milvus-minio | Object storage |
| milvus-etcd | Configuration store |
| rag-frontend | RAG web UI (port 8090) |
| compose-redis-1 | Cache |

Test RAG at: http://localhost:8090

### Step 3: Deploy AI-Q Research Assistant Backend

Clone and enter the AI-Q Research Assistant repository:

```bash
git clone https://github.com/NVIDIA-AI-Blueprints/aiq-research-assistant.git
cd aiq-research-assistant
```

Set environment variables:

```bash
export AIRA_HOSTED_NIMS="true"
# TAVILY_API_KEY should already be set from Step 0
```

Deploy the backend services:

```bash
docker compose -f deploy/compose/docker-compose.yaml --profile aira up -d
```

Verify additional containers:
- `aira-backend` - Research Assistant API (port 3838)
- `aira-frontend` - Original frontend (port 3000)
- `aira-nginx` - Reverse proxy

API documentation available at: http://localhost:3838/docs

### Step 4: Deploy This Web UI (Optional Custom Frontend)

This repository provides an alternative, enhanced web UI with:
- 🌌 Animated neural network background
- 🤖 Agent orchestration visualization
- 💬 Streaming chat interface with markdown support
- 📁 Conversation history with local storage

```bash
# From this repository root
docker compose up -d --build
```

Access the UI at: **http://localhost:8080**

### Step 5: Upload Default Collections (Optional)

Upload example datasets for the demo prompts:

```bash
docker run \
  -e RAG_INGEST_URL=http://ingestor-server:8082/v1 \
  -e PYTHONUNBUFFERED=1 \
  -v /tmp:/tmp-data \
  --network nvidia-rag \
  nvcr.io/nvidia/blueprint/aira-load-files:v1.2.0
```

> **Note:** This can take up to 30 minutes. If you see 429 errors, re-run the command - it will resume from where it left off.

---

## 🔧 Configuration

### Backend URL

The UI connects to the AIQ backend at `http://localhost:3838` by default. To change:

1. Click the **Settings** icon in the sidebar
2. Update the **Backend URL**
3. Click **Test** to verify connection
4. Click **Save Changes**

### Animations

Toggle the cosmic background and agent visualizations in Settings for better performance on lower-end devices.

---

## 🛑 Stopping Services

```bash
# Stop this Web UI
docker compose down

# Stop AI-Q Research Assistant
docker compose -f deploy/compose/docker-compose.yaml --profile aira down

# Stop RAG services
docker compose -f rag/deploy/compose/docker-compose-rag-server.yaml down
docker compose -f rag/deploy/compose/docker-compose-ingestor-server.yaml down
docker compose -f rag/deploy/compose/vectordb.yaml down

# Clean up cache (optional)
rm -rf rag/deploy/compose/volumes
```

Verify all stopped:
```bash
docker ps
```

---

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── CosmicBackground.tsx   # Neural network animation
│   │   ├── ChatArea.tsx           # Main chat interface
│   │   ├── ChatSidebar.tsx        # Conversation list
│   │   ├── AgentOrchestration.tsx # Agent visualization
│   │   └── ...
│   ├── hooks/
│   │   ├── useChat.ts             # Chat & streaming logic
│   │   └── useConversations.ts    # Conversation management
│   └── types/
│       └── chat.ts                # TypeScript interfaces
├── Dockerfile                      # Production container
├── docker-compose.yaml             # Container orchestration
└── nginx.conf                      # Web server config
```

---

## 🔗 Service Ports

| Service | Port | Description |
|---------|------|-------------|
| AIQ Web UI | 8080 | This custom frontend |
| AIQ Backend | 3838 | Research Assistant API |
| AIQ Frontend (Original) | 3000 | NVIDIA's default frontend |
| RAG Frontend | 8090 | RAG testing interface |

---

## 📚 Resources

- [NVIDIA AIQ Research Assistant](https://github.com/NVIDIA-AI-Blueprints/aiq-research-assistant)
- [NVIDIA RAG Blueprint](https://github.com/NVIDIA-AI-Blueprints/rag)
- [NVIDIA NIM Microservices](https://developer.nvidia.com/nim)
- [NVIDIA NGC](https://ngc.nvidia.com/)

---

## 📄 License

This project is provided as-is for use with NVIDIA AI Blueprints.
