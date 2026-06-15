import api from "./api";

const deviceService = {
  getAll: async () => {
    const { data } = await api.get("/api/devices/");
    return data;
  },

  toggle: async (deviceId, currentStatus) => {
    const { data } = await api.patch(`/api/devices/${deviceId}`, {
      status: !currentStatus,
    });
    return data;
  },

  add: async (devicePayload) => {
    const { data } = await api.post("/api/devices/", devicePayload);
    return data;
  },

  remove: async (deviceId) => {
    const { data } = await api.delete(`/api/devices/${deviceId}`);
    return data;
  },
};

export default deviceService;