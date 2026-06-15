import { aiApi } from "./api";

const chatService = {
  // General AI chat (VoltBot AI mode)
  sendAIMessage: async (message) => {
    const { data } = await aiApi.post("/api/v1/chat", { message });
    return data.reply;
  },

  // RAG — answers from uploaded PDFs (VoltBot Intelligence mode)
  sendRAGMessage: async (message) => {
    const { data } = await aiApi.post("/api/v1/chat/rag", { message });
    return data.response;
  },

  // Agent — device control commands (VoltBot Agent mode)
  sendAgentCommand: async (message) => {
    const { data } = await aiApi.post("/api/v1/agent", { message });
    return data.reply;
  },
};

export default chatService;