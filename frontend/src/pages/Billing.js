import { useState, useEffect } from "react";

// SVG Icons
const Icons = {
  CreditCard: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8H4V6h16m0 12H4v-6h16m0-8H4c-1.11 0-2 .9-2 2v16c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" /></svg>,
  TrendingDown: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 18l2.29-2.29-4.29-4.29-4 4L2 7.41 3.41 6 10 12.59l4-4 6.3 6.29L22 12v6z" /></svg>,
  AlertCircle: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M7.08 6.47A9 9 0 1121 12a9 9 0 01-13.92-5.53" /></svg>,
  Info: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>,
};

function Billing() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredTerm, setHoveredTerm] = useState(null);

  const tooltips = {
    currentMonth: "Total electricity charges for the current billing period.",
    projected: "Estimated total bill if consumption continues at current rate.",
    lastMonth: "Previous month's electricity bill for comparison.",
    savings: "Amount saved by generating solar energy.",
    budget: "Your monthly electricity spending limit.",
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  async function fetchBilling() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/billing`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching billing:", err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Loading billing analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl rounded-2xl p-8 text-red-300">
          Failed to load billing data
        </div>
      </div>
    );
  }

  const budgetColor = data.budget_used_percent > 90 
    ? "bg-red-500" 
    : data.budget_used_percent > 70 
    ? "bg-orange-500" 
    : "bg-emerald-500";

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Icons.CreditCard />
              </div>
              <h1 className="text-5xl font-bold text-white">Billing & Expenses</h1>
            </div>
            <p className="text-gray-400 text-lg">Monitor energy costs, solar savings, and monthly budget usage</p>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {/* This Month */}
            <div className="group relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-orange-500/10 to-amber-500/5 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">This Month</p>
                <button
                  onMouseEnter={() => setHoveredTerm('currentMonth')}
                  onMouseLeave={() => setHoveredTerm(null)}
                  className="relative p-1 text-gray-500 hover:text-orange-400"
                >
                  <Icons.Info />
                  {hoveredTerm === 'currentMonth' && (
                    <div className="absolute right-0 top-8 w-48 bg-slate-900 border border-orange-500/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl z-50">
                      {tooltips.currentMonth}
                    </div>
                  )}
                </button>
              </div>
              <p className="text-4xl font-bold text-white">₹{data.current_month_cost_inr}</p>
              <p className="text-sm text-orange-300 mt-2">{data.current_month_kwh} kWh consumed</p>
            </div>

            {/* Projected Bill */}
            <div className="group relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Projected Bill</p>
                <button
                  onMouseEnter={() => setHoveredTerm('projected')}
                  onMouseLeave={() => setHoveredTerm(null)}
                  className="relative p-1 text-gray-500 hover:text-blue-400"
                >
                  <Icons.Info />
                  {hoveredTerm === 'projected' && (
                    <div className="absolute right-0 top-8 w-48 bg-slate-900 border border-blue-500/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl z-50">
                      {tooltips.projected}
                    </div>
                  )}
                </button>
              </div>
              <p className="text-4xl font-bold text-white">₹{data.projected_month_cost_inr}</p>
              <p className="text-sm text-blue-300 mt-2">Estimated month-end cost</p>
            </div>

            {/* Last Month */}
            <div className="group relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-500/10 to-gray-500/5 backdrop-blur-sm hover:border-slate-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Last Month</p>
                <button
                  onMouseEnter={() => setHoveredTerm('lastMonth')}
                  onMouseLeave={() => setHoveredTerm(null)}
                  className="relative p-1 text-gray-500 hover:text-slate-300"
                >
                  <Icons.Info />
                  {hoveredTerm === 'lastMonth' && (
                    <div className="absolute right-0 top-8 w-48 bg-slate-900 border border-slate-500/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl z-50">
                      {tooltips.lastMonth}
                    </div>
                  )}
                </button>
              </div>
              <p className="text-4xl font-bold text-white">₹{data.last_month_cost_inr}</p>
              <p className="text-sm text-slate-300 mt-2">
                {data.current_month_cost_inr < data.last_month_cost_inr ? "Lower than last month" : "Higher than last month"}
              </p>
            </div>

            {/* Solar Savings */}
            <div className="group relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Solar Savings</p>
                <button
                  onMouseEnter={() => setHoveredTerm('savings')}
                  onMouseLeave={() => setHoveredTerm(null)}
                  className="relative p-1 text-gray-500 hover:text-emerald-400"
                >
                  <Icons.Info />
                  {hoveredTerm === 'savings' && (
                    <div className="absolute right-0 top-8 w-48 bg-slate-900 border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl z-50">
                      {tooltips.savings}
                    </div>
                  )}
                </button>
              </div>
              <p className="text-4xl font-bold text-white">₹{data.solar_savings_inr}</p>
              <p className="text-sm text-emerald-300 mt-2">Saved through solar generation</p>
            </div>
          </div>

          {/* Budget Tracker */}
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all duration-300 mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icons.TrendingDown />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Budget Tracker</h3>
                  <p className="text-gray-400 mt-1">Monthly spending and consumption analysis</p>
                </div>
              </div>
              <button
                onMouseEnter={() => setHoveredTerm('budget')}
                onMouseLeave={() => setHoveredTerm(null)}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 text-sm font-semibold hover:border-cyan-400/50 transition-colors"
              >
                {data.budget_used_percent}% Used
                {hoveredTerm === 'budget' && (
                  <div className="absolute -left-48 top-12 w-48 bg-slate-900 border border-cyan-500/30 rounded-lg p-3 text-xs text-gray-300 shadow-xl z-50">
                    {tooltips.budget}
                  </div>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400">
                <span>₹0</span>
                <span className="font-semibold">Budget Limit: ₹{data.budget_inr}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-white/10">
                <div
                  className={`${budgetColor} h-3 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/20`}
                  style={{ width: `${data.budget_used_percent}%` }}
                />
              </div>

              <div className="flex justify-between text-sm text-gray-300 pt-2">
                <span className="font-semibold">Spent: ₹{data.current_month_cost_inr}</span>
                <span className="font-semibold">Remaining: ₹{data.budget_inr - data.current_month_cost_inr}</span>
              </div>
            </div>

            {data.budget_used_percent > 80 && (
              <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm flex items-start gap-3">
                <Icons.AlertCircle />
                <div>
                  <p className="text-orange-300 font-semibold">Budget Alert</p>
                  <p className="text-orange-200 text-sm mt-1">
                    You have already used {data.budget_used_percent}% of your monthly budget.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Expense Breakdown */}
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all duration-300 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white">Expense Breakdown</h3>
              <p className="text-gray-400 mt-1">Device-level electricity usage analysis</p>
            </div>

            <div className="space-y-5">
              {data.breakdown && data.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-lg font-bold text-white">{item.category}</p>
                      <p className="text-sm text-gray-400 mt-1">{item.kwh} kWh consumed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-400">₹{item.cost_inr}</p>
                      <p className="text-sm text-cyan-300 font-semibold mt-1">{item.percent}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-xl font-bold text-white">Total This Month</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                ₹{data.current_month_cost_inr}
              </span>
            </div>
          </div>

          {/* Rate Info */}
          <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm text-center">
            <p className="text-gray-300">Current electricity rate:</p>
            <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mt-2">
              ₹{data.rate_per_kwh} per kWh
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default Billing;