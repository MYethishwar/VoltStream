import axios from "axios";
import config from "../config";

// ── Node.js backend instance (auth, devices, billing, analytics)
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── FastAPI backend instance (AI, RAG, agent)
export const aiApi = axios.create({
  baseURL: config.AI_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
const attachToken = (axiosInstance) => {
  axiosInstance.interceptors.request.use((reqConfig) => {
    const token = localStorage.getItem("vs_token");
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  });
};

attachToken(api);
attachToken(aiApi);

export default api;