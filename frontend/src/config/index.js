
const config = {
  // Node.js backend (auth, devices, billing, analytics)
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
 
  // FastAPI backend (AI chat, RAG, agent)
  AI_BASE_URL: process.env.REACT_APP_AI_URL || "http://localhost:8000",
 
  // App
  NODE_ENV: process.env.NODE_ENV || "development",
};
 
export default config;