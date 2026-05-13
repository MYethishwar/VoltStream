import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ROOM_OPTIONS = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Garage",
];

const TYPE_OPTIONS = [
  { value: "ac", label: "Air Conditioner", icon: "❄️", defaultW: 1800 },
  { value: "fan", label: "Fan", icon: "🌀", defaultW: 75 },
  { value: "light", label: "Light", icon: "💡", defaultW: 20 },
  { value: "heater", label: "Heater", icon: "🔥", defaultW: 2000 },
  { value: "fridge", label: "Refrigerator", icon: "🧊", defaultW: 150 },
  { value: "tv", label: "Television", icon: "📺", defaultW: 120 },
  { value: "washer", label: "Washing Machine", icon: "🫧", defaultW: 500 },
  { value: "other", label: "Other", icon: "🔌", defaultW: 100 },
];

const iconMap = {
  ac: "❄️",
  fan: "🌀",
  light: "💡",
  heater: "🔥",
  fridge: "🧊",
  tv: "📺",
  washer: "🫧",
  other: "🔌",
};

export default function Devices() {

  const { user } = useAuth();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    room: "Living Room",
    type: "ac",
    power_w: 1800,
  });

  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("vs_token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const API = process.env.REACT_APP_API_URL;

  // ₹8 per kWh
  const ELECTRICITY_RATE = 8;

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/devices/`, {
        headers,
      });

      const data = await res.json();

      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function handleAdd() {
    setSaving(true);

    try {
      const res = await fetch(`${API}/api/devices/`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setDevices((prev) => [...prev, data]);

      setShowModal(false);

      setForm({
        name: "",
        room: "Living Room",
        type: "ac",
        power_w: 1800,
      });

    } catch (err) {
      console.error(err);
    }

    setSaving(false);
  }

  async function handleToggle(device) {
    try {
      await fetch(`${API}/api/devices/${device.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          status: !device.status,
        }),
      });

      setDevices((prev) =>
        prev.map((d) =>
          d.id === device.id
            ? { ...d, status: !d.status }
            : d
        )
      );

    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/api/devices/${id}`, {
        method: "DELETE",
        headers,
      });

      setDevices((prev) =>
        prev.filter((d) => d.id !== id)
      );

    } catch (err) {
      console.error(err);
    }
  }

  const activeDevices = devices.filter((d) => d.status);

  const totalLoad =
    activeDevices.reduce((sum, d) => sum + d.power_w, 0) / 1000;

  const totalHourlyCost = activeDevices.reduce(
    (sum, d) =>
      sum + ((d.power_w / 1000) * ELECTRICITY_RATE),
    0
  );

  return (
    <div className="w-full min-h-screen bg-black text-white">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-5xl font-bold">
              Device Control Center
            </h1>

            <p className="text-gray-400 mt-2">
              Monitor energy usage and manage smart devices
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-all duration-300 font-semibold"
          >
            + Add Device
          </button>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

          {[
            {
              label: "Total Devices",
              value: devices.length,
            },

            {
              label: "Active Devices",
              value: activeDevices.length,
            },

            {
              label: "Current Load",
              value: `${totalLoad.toFixed(2)} kW`,
            },

            {
              label: "Hourly Cost",
              value: `₹${totalHourlyCost.toFixed(2)}/hr`,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
            >

              <p className="text-gray-400 text-sm">
                {stat.label}
              </p>

              <p className="text-4xl font-bold mt-2">
                {stat.value}
              </p>

            </div>
          ))}

        </div>

        {/* Devices */}
        {loading ? (
          <div className="flex justify-center items-center h-64">

            <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>

          </div>
        ) : devices.length === 0 ? (
          <div className="text-center py-24">

            <p className="text-7xl mb-5">🔌</p>

            <h2 className="text-3xl font-semibold text-gray-300">
              No Devices Added
            </h2>

            <p className="text-gray-500 mt-2">
              Start building your smart energy ecosystem
            </p>

          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {devices.map((device) => {

              const hourlyCost =
                (device.power_w / 1000) * ELECTRICITY_RATE;

              return (
                <div
                  key={device.id}
                  className={`rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
                    device.status
                      ? "bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/10"
                      : "bg-red-500/5 border-red-500/20 opacity-80"
                  }`}
                >

                  <div className="flex justify-between items-start mb-5">

                    <div className="text-5xl">
                      {iconMap[device.type]}
                    </div>

                    <button
                      onClick={() => handleDelete(device.id)}
                      className="text-gray-500 hover:text-red-400 text-lg"
                    >
                      ✕
                    </button>

                  </div>

                  <h2 className="text-2xl font-bold">
                    {device.name}
                  </h2>

                  <p className="text-gray-400 mt-1">
                    {device.room}
                  </p>

                  <div className="mt-6 space-y-3">

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Power
                      </span>

                      <span className="font-semibold">
                        {device.power_w}W
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Hourly Cost
                      </span>

                      <span className="text-cyan-400 font-semibold">
                        ₹{hourlyCost.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">

                      <div className="flex items-center gap-2">

                        <div
                          className={`w-3 h-3 rounded-full ${
                            device.status
                              ? "bg-green-400 animate-pulse"
                              : "bg-red-400"
                          }`}
                        ></div>

                        <span
                          className={`font-medium ${
                            device.status
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {device.status ? "ACTIVE" : "OFFLINE"}
                        </span>

                      </div>

                      <button
                        onClick={() => handleToggle(device)}
                        className={`relative w-14 h-7 rounded-full transition-all ${
                          device.status
                            ? "bg-green-500"
                            : "bg-gray-700"
                        }`}
                      >

                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                            device.status
                              ? "left-8"
                              : "left-1"
                          }`}
                        ></span>

                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

          <div className="w-full max-w-md bg-gray-950 border border-white/10 rounded-3xl p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold">
                Add Device
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white text-xl"
              >
                ✕
              </button>

            </div>

            <div className="space-y-5">

              <input
                type="text"
                placeholder="Device Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-500"
              />

              <select
                value={form.room}
                onChange={(e) =>
                  setForm({
                    ...form,
                    room: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
              >

                {ROOM_OPTIONS.map((room) => (
                  <option
                    key={room}
                    value={room}
                  >
                    {room}
                  </option>
                ))}

              </select>

              <div className="grid grid-cols-4 gap-2">

                {TYPE_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() =>
                      setForm({
                        ...form,
                        type: t.value,
                        power_w: t.defaultW,
                      })
                    }
                    className={`p-3 rounded-xl border transition-all ${
                      form.type === t.value
                        ? "border-cyan-500 bg-cyan-500/10"
                        : "border-white/10"
                    }`}
                  >

                    <div className="text-2xl">
                      {t.icon}
                    </div>

                  </button>
                ))}

              </div>

              <input
                type="number"
                value={form.power_w}
                onChange={(e) =>
                  setForm({
                    ...form,
                    power_w: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-cyan-500"
              />

              <button
                onClick={handleAdd}
                disabled={!form.name || saving}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {saving ? "Adding Device..." : "Add Device"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}