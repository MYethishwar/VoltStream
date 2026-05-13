function DeviceCard({ device, icon, onToggle }) {

  return (
    <div
      className={`backdrop-blur-lg rounded-2xl p-5 border transition ${
        device.status
          ? "bg-teal-500/10 border-teal-400/30"
          : "bg-white/5 border-white/10"
      }`}
    >

      <div className="flex justify-between mb-5">

        <div>
          <div className="text-4xl">
            {icon}
          </div>

          <h3 className="text-white font-semibold mt-3">
            {device.name}
          </h3>

          <p className="text-gray-400 text-sm">
            {device.room}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full h-fit ${
            device.status
              ? "bg-teal-400/20 text-teal-300"
              : "bg-slate-700 text-gray-300"
          }`}
        >
          {device.status ? "ON" : "OFF"}
        </span>

      </div>

      <p className="text-gray-300 text-sm mb-4">
        {device.power_w}W
      </p>

      <button
        onClick={() => onToggle(device.id, device.status)}
        className={`w-full py-2 rounded-xl font-semibold transition ${
          device.status
            ? "bg-teal-500 hover:bg-teal-600 text-white"
            : "bg-white/10 hover:bg-white/20 text-gray-200"
        }`}
      >
        {device.status ? "Turn OFF" : "Turn ON"}
      </button>

    </div>
  );
}

export default DeviceCard;