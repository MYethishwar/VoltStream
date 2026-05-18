import { useEffect, useState } from "react";

// SVG Icons
const Icons = {
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  ArrowRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
  Zap: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  BarChart: () => <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" /></svg>,
  Shield: () => <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>,
  TrendingUp: () => <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.29 4.29-4-4L2 16.59 3.41 18 10 11.41l4 4 6.3-6.29L22 12v-6z" /></svg>,
};

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Icons.BarChart,
      title: "Real-Time Analytics",
      description: "Monitor energy consumption and production with live dashboards and detailed metrics.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Icons.Zap,
      title: "Smart Control",
      description: "Manage connected devices and optimize energy usage automatically with AI insights.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Icons.Shield,
      title: "Data Security",
      description: "Enterprise-grade encryption and privacy protection for all your energy data.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Icons.TrendingUp,
      title: "Predictive Insights",
      description: "Get AI-powered forecasts and recommendations to reduce costs and carbon footprint.",
      color: "from-orange-500 to-amber-500"
    }
  ];

  const stats = [
    { value: "250K+", label: "Active Households", highlight: true },
    { value: "15.2M", label: "MWh Monitored", highlight: false },
    { value: "42%", label: "Avg. Savings", highlight: true },
    { value: "99.9%", label: "Uptime", highlight: false }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-black overflow-hidden">

      {/* ========== BACKGROUND EFFECTS ========== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-colors duration-300">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-cyan-300">Trusted by 250K+ households worldwide</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block text-white">Energy Intelligence</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                For the Modern Home
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Monitor, analyze, and optimize your energy consumption in real-time. Powered by AI, designed for simplicity.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleNavigation("/pricing")}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Get Started Free <Icons.ArrowRight />
            </button>
          
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
                <p className={`text-2xl font-bold ${stat.highlight ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent' : 'text-white'}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to take control of your energy
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(idx)}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section id="stats" className="relative py-24 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Real Impact, Real Numbers
              </h2>
              <p className="text-xl text-gray-400">
                See what our community has achieved
              </p>
            </div>

            {/* Large Stats */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm">
                <p className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  2.5M
                </p>
                <p className="text-gray-300 font-medium">Tons of CO₂ Prevented</p>
                <p className="text-sm text-gray-500 mt-2">Equivalent to planting 40M trees</p>
              </div>

              <div className="p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm">
                <p className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                  $1.2B
                </p>
                <p className="text-gray-300 font-medium">Savings Generated</p>
                <p className="text-sm text-gray-500 mt-2">Average $4,800 per household annually</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LIVE METRICS SECTION ========== */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Live Energy Monitoring
            </h2>
            <p className="text-xl text-gray-400">
              Real-time data from your connected devices
            </p>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Grid Power", value: "3.4 kW", unit: "kW", color: "from-blue-500 to-cyan-500" },
              { label: "Solar Generation", value: "2.1 kW", unit: "kW", color: "from-amber-500 to-orange-500" },
              { label: "Battery Level", value: "72%", unit: "%", color: "from-emerald-500 to-teal-500" },
              { label: "Net Consumption", value: "1.3 kW", unit: "kW", color: "from-purple-500 to-pink-500" }
            ].map((metric, idx) => (
              <div
                key={idx}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:border-white/10 transition-all duration-300"
              >
                <p className="text-sm text-gray-500 mb-4">{metric.label}</p>
                <div className="space-y-2">
                  <p className={`text-4xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {metric.value}
                  </p>
                  <div className="h-1 bg-gradient-to-r from-white/20 to-transparent rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${metric.color} w-3/4 rounded-full`}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">Updated just now</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-600/10 via-blue-600/10 to-emerald-600/10 backdrop-blur-xl p-12 md:p-16 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to save on energy?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of households already monitoring and optimizing their energy usage with VoltStream.
            </p>
            <button
              onClick={() => handleNavigation("/pricing")}
              className="px-10 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              Start Your Free Trial <Icons.ArrowRight />
            </button>
            <p className="text-sm text-gray-500">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative border-t border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icons.Zap />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  VoltStream
                </span>
              </div>
              <p className="text-sm text-gray-500">Energy intelligence for everyone.</p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0">Features</button></li>
<li>
  <button
    onClick={() => handleNavigation("/pricing")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Pricing
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/security")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Security
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/roadmap")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Roadmap
  </button>
</li>               
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
<li>
  <button
    onClick={() => handleNavigation("/about")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    About
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/blog")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Blog
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/careers")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Careers
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/contact")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Contact
  </button>
</li>              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
<li>
  <button
    onClick={() => handleNavigation("/privacy")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Privacy
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/terms")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Terms
  </button>
</li>

<li>
  <button
    onClick={() => handleNavigation("/cookies")}
    className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0"
  >
    Cookies
  </button>
</li>              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
              <p>&copy; 2024 VoltStream. All rights reserved.</p>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <button className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0">Twitter</button>
                <button className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0">LinkedIn</button>
                <button className="hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer p-0">GitHub</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ========== STYLES ========== */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Home;