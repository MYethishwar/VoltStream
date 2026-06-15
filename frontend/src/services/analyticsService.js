import api from "./api";

const analyticsService = {
  getSummary: async () => {
    const { data } = await api.get("/api/analytics/summary");
    return data;
  },

  getUsageHistory: async (period = "30d") => {
    const { data } = await api.get(`/api/analytics/usage?period=${period}`);
    return data;
  },

  getBillingStats: async () => {
    const { data } = await api.get("/api/analytics/billing");
    return data;
  },
};

export default analyticsService;