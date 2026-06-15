import api from "./api";

const authService = {
  login: async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data; // { user, token }
  },

  register: async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", { name, email, password });
    return data; // { user, token }
  },

  getProfile: async () => {
    const { data } = await api.get("/api/auth/profile");
    return data;
  },
};

export default authService;