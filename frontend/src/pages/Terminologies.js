import { useState } from "react";

// SVG Icons
const Icons = {
  BookOpen: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" /></svg>,
  Zap: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Info: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

function Terminologies() {
  const [expandedTerm, setExpandedTerm] = useState(null);

  const terms = [
    {
      id: "grid-power",
      title: "Grid Power",
      short: "Utility electricity",
      desc: "Electricity supplied from the utility grid to power your home. This is the external source of energy that your home relies on when solar generation is insufficient.",
      example: "3.4 kW of grid power flowing to your home when solar is not producing."
    },
    {
      id: "solar-generation",
      title: "Solar Generation",
      short: "Renewable energy",
      desc: "Energy produced through rooftop solar panels in real time. This clean, renewable energy reduces your dependence on the grid and lowers your electricity bills.",
      example: "2.1 kW of solar energy being generated during peak sunlight hours."
    },
    {
      id: "net-consumption",
      title: "Net Consumption",
      short: "Final electricity usage",
      desc: "Final electricity usage after subtracting solar generation from grid power. This represents the actual net demand from the grid after accounting for self-generated solar energy.",
      example: "1.3 kW net consumption means you're using 1.3 kW more than you're generating."
    },
    {
      id: "battery-level",
      title: "Battery Level",
      short: "Energy storage charge",
      desc: "Current percentage of stored backup energy available in your home battery system. A fully charged battery provides backup power during outages or peak demand periods.",
      example: "72% battery level means you have 72% of your battery's capacity stored for later use."
    },
    {
      id: "energy-flow",
      title: "Energy Flow",
      short: "Electricity movement",
      desc: "Movement of electricity between the grid, solar system, battery storage, and your home. Understanding energy flow helps optimize your consumption patterns.",
      example: "Energy flows from solar panels → battery → home appliances."
    },
    {
      id: "solar-coverage",
      title: "Solar Coverage",
      short: "Self-sufficiency ratio",
      desc: "Percentage of total electricity demand fulfilled by solar energy. A higher solar coverage means greater energy independence and lower grid reliance.",
      example: "60% solar coverage means 60% of your electricity needs are met by solar panels."
    },
    {
      id: "co2-saved",
      title: "CO₂ Saved",
      short: "Environmental impact",
      desc: "Estimated carbon emissions reduced through renewable energy usage. Every kilowatt of solar energy generated prevents CO₂ from being released into the atmosphere.",
      example: "45 kg CO₂ saved today through solar energy generation (equivalent to planting trees)."
    },
    {
      id: "current-load",
      title: "Current Load",
      short: "Active power consumption",
      desc: "Total active power currently consumed by running devices in your home. This shows real-time electricity demand from all active appliances.",
      example: "A current load of 2.5 kW means all your running devices are consuming 2.5 kW together."
    },
    {
      id: "smart-devices",
      title: "Smart Devices",
      short: "Connected appliances",
      desc: "Connected appliances that can be remotely monitored and controlled through the VoltStream platform. Smart devices provide real-time data and automation capabilities.",
      example: "Smart AC, washing machine, and water heater that you can control from your phone."
    },
    {
      id: "active-devices",
      title: "Active Devices",
      short: "Powered-on appliances",
      desc: "Number of appliances currently powered ON in the system. Keeping track of active devices helps reduce unnecessary consumption and manage your load.",
      example: "5 out of 8 devices are currently active (AC, fan, fridge, TV, and heater)."
    },
    {
      id: "hourly-cost",
      title: "Hourly Cost",
      short: "Energy expense rate",
      desc: "Estimated electricity expense generated every hour based on current consumption. This helps you understand the real-time cost of running your devices.",
      example: "₹15 per hour means your current devices will cost ₹360 if they run for 24 hours."
    },
    {
      id: "energy-analytics",
      title: "Energy Analytics",
      short: "Usage patterns",
      desc: "Historical analysis of energy usage and solar generation patterns. Analytics reveal trends, peak consumption times, and opportunities for savings.",
      example: "Analytics show you use 35% more energy on weekends due to higher AC usage."
    },
    {
      id: "budget-tracker",
      title: "Budget Tracker",
      short: "Spending limit",
      desc: "Monitors your monthly electricity spending against a predefined budget. Helps control expenses and get alerts when approaching or exceeding your limit.",
      example: "Budget set at ₹5000/month, currently at 72% usage (₹3600 spent)."
    },
    {
      id: "solar-savings",
      title: "Solar Savings",
      short: "Cost reduction",
      desc: "Amount saved by generating solar energy instead of buying from the grid. Represents the financial benefit of your solar installation.",
      example: "₹2,400 saved this month through solar generation."
    }
  ];

  return (
    <div className="w-full bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Icons.BookOpen />
              </div>
              <h1 className="text-5xl font-bold text-white">VoltStream Terminologies</h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Key concepts and terms used throughout the VoltStream energy monitoring platform. Click any term to expand and learn more.
            </p>
          </div>

          {/* Search Bar (Optional Future Enhancement) */}
          <div className="mb-10 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search terminologies..."
              className="w-full px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {terms.map((term) => (
              <div
                key={term.id}
                onClick={() => setExpandedTerm(expandedTerm === term.id ? null : term.id)}
                className="group relative cursor-pointer overflow-hidden"
              >
                {/* Card Container */}
                <div className={`p-6 rounded-2xl border transition-all duration-300 backdrop-blur-sm ${
                  expandedTerm === term.id
                    ? "border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 shadow-lg shadow-cyan-500/20"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]"
                }`}>
                  {/* Title Section */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">
                        {term.title}
                      </h2>
                      <p className="text-sm text-gray-500">{term.short}</p>
                    </div>
                    <div className={`text-2xl transition-transform duration-300 ${expandedTerm === term.id ? "rotate-180" : ""}`}>
                      ▼
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {expandedTerm === term.id && (
                    <div className="space-y-4 mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                      {/* Description */}
                      <div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {term.desc}
                        </p>
                      </div>

                      {/* Example */}
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-xs font-semibold text-blue-300 uppercase mb-2">Example</p>
                        <p className="text-sm text-gray-300">
                          {term.example}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icons.Info />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Understanding Energy Management</h3>
                <p className="text-gray-400 leading-relaxed">
                  VoltStream uses these terminologies to help you understand and optimize your energy consumption. By monitoring these metrics, you can make informed decisions about your energy usage, reduce costs, and contribute to a more sustainable future. All values update in real-time to give you the most accurate information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-in { animation: in 0.3s ease-out; }
        .fade-in { animation: in 0.3s ease-out; }
        .slide-in-from-top-2 { animation: slideInFromTop 0.3s ease-out; }
        @keyframes slideInFromTop {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Terminologies;