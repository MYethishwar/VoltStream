# VoltStream Project Documentation

## Project Overview
VoltStream is an intelligent energy management platform designed to optimize electricity usage, monitor renewable energy generation, and provide real-time analytics. The platform consists of a React-based frontend and a FastAPI backend, with Dockerized deployment for scalability.

---

## Project Structure

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Deployment**: Firebase Hosting
- **Key Directories**:
  - `src/components`: Contains reusable UI components like `ChatWidget`, `Navbar`, and `Sidebar`.
  - `src/pages`: Implements individual pages such as `Home`, `Dashboard`, `Chat`, and `About`.
  - `public`: Static assets like `index.html` and `manifest.json`.

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (via ChromaDB)
- **Deployment**: Google Cloud Run
- **Key Directories**:
  - `routes`: API endpoints for chat, RAG, and PDF uploads.
  - `services`: Business logic for analytics, billing, and chatbot functionalities.
  - `utils`: Utility scripts for text chunking and other helper functions.

---

## File Functionalities

### Frontend
#### `src/components/ChatWidget.js`
- **Purpose**: Implements the chatbot interface.
- **Key Functions**:
  - `sendMessage`: Sends user input to the backend.
  - `toggleRAG`: Switches between RAG and general AI modes.
- **Interactions**: Communicates with backend endpoints `/chat` and `/chat/rag`.

#### `src/pages/Chat.jsx`
- **Purpose**: Renders the chat page.
- **Key Functions**:
  - `sendMessage`: Handles user input and displays bot responses.
  - `handleKeyDown`: Triggers message sending on pressing Enter.
- **Interactions**: Uses `ChatWidget` for the chatbot interface.

#### `src/pages/Dashboard.js`
- **Purpose**: Displays energy analytics and statistics.
- **Key Components**:
  - `StatRow`: Shows metrics like net consumption and solar coverage.

### Backend
#### `routes/chat.py`
- **Purpose**: Handles general chatbot requests.
- **Endpoints**:
  - `/chat`: Processes user messages via `chat_service`.

#### `routes/rag.py`
- **Purpose**: Manages RAG-based chatbot interactions.
- **Endpoints**:
  - `/chat/rag`: Retrieves context-aware responses.

#### `services/chat_service.py`
- **Purpose**: Implements general chatbot logic.
- **Key Functions**:
  - `get_chat_response`: Generates responses using the Gemini API.

#### `services/rag_service.py`
- **Purpose**: Handles RAG-specific logic.
- **Key Functions**:
  - `get_rag_response`: Retrieves context-aware answers from indexed documents.

---

## Tools, Libraries, and Technologies

### Frontend
- **React.js**: Core framework for building the UI.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Recharts**: Library for data visualization.

### Backend
- **FastAPI**: Framework for building RESTful APIs.
- **SQLite**: Lightweight database for storing document chunks.
- **ChromaDB**: Manages document indexing and retrieval.
- **Google GenAI**: Provides AI capabilities for chatbot responses.

### Deployment
- **Docker**: Containerization for consistent deployment.
- **Firebase Hosting**: Serves the frontend.
- **Google Cloud Run**: Hosts the backend.

---

## Program Flow

### General Chatbot
1. **Frontend**:
   - User inputs a message in `ChatWidget`.
   - Message is sent to `/chat` via `sendMessage`.
2. **Backend**:
   - `chat.py` routes the request to `chat_service`.
   - `get_chat_response` generates a reply using the Gemini API.
3. **Frontend**:
   - Response is displayed in the chat interface.

### RAG Chatbot
1. **Frontend**:
   - User enables RAG mode in `ChatWidget`.
   - Message is sent to `/chat/rag`.
2. **Backend**:
   - `rag.py` routes the request to `rag_service`.
   - `get_rag_response` retrieves context-aware answers from indexed documents.
3. **Frontend**:
   - Response is displayed with source references.

---

## Chatbot Details

### General Conversational AI
- **Purpose**: Provides general energy-related advice.
- **Capabilities**:
  - Answers questions about energy usage, billing, and devices.
  - Uses the Gemini API for generating responses.
- **Limitations**: Does not use external context.

### RAG Chatbot
- **Purpose**: Offers context-aware responses based on uploaded documents.
- **Capabilities**:
  - Retrieves answers from indexed PDFs.
  - Displays source references for transparency.
- **Workflow**:
  - PDFs are uploaded via `/upload-pdf`.
  - Text is chunked and indexed in ChromaDB.
  - Queries are processed by `get_rag_response`.

---

## Conclusion
VoltStream integrates modern technologies to deliver a robust energy management platform. The chatbot, with its dual modes, enhances user interaction by providing both general advice and context-aware insights. The modular architecture ensures scalability and maintainability.