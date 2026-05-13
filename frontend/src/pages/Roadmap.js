import {
  Rocket,
  Cpu,
  Globe,
  BatteryCharging,
  Brain,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function Roadmap() {

  const roadmap = [
    {
      phase: "Q1 2026",
      title: "Advanced Smart Dashboard",
      description:
        "Expansion of real-time analytics dashboards with customizable widgets, predictive consumption tracking, and multi-device monitoring.",
      status: "Completed",
    },

    {
      phase: "Q2 2026",
      title: "AI Energy Optimization Engine",
      description:
        "Integration of AI-driven recommendations for reducing electricity costs and improving renewable energy efficiency automatically.",
      status: "In Progress",
    },

    {
      phase: "Q3 2026",
      title: "Smart Grid Integration",
      description:
        "Direct integration with distributed smart-grid infrastructure and intelligent energy balancing systems.",
      status: "Planned",
    },

    {
      phase: "Q4 2026",
      title: "Enterprise Sustainability Suite",
      description:
        "Advanced carbon reporting, sustainability forecasting, and enterprise-level environmental analytics tools.",
      status: "Planned",
    },

    {
      phase: "2027",
      title: "Global IoT Ecosystem Expansion",
      description:
        "Support for large-scale IoT energy devices, industrial infrastructure, and smart-city deployments worldwide.",
      status: "Future Vision",
    },
  ];

  const innovations = [
    {
      title: "AI Forecasting",
      description:
        "Predictive energy analytics powered by machine learning and infrastructure intelligence.",
    },

    {
      title: "Renewable Intelligence",
      description:
        "Advanced optimization for solar systems, battery infrastructure, and sustainable energy networks.",
    },

    {
      title: "Cloud-Native Scaling",
      description:
        "Global infrastructure expansion with secure distributed cloud architecture.",
    },

    {
      title: "Smart-City Infrastructure",
      description:
        "Future-ready monitoring systems designed for connected urban ecosystems and digital infrastructure.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <Rocket className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              VoltStream Product Roadmap
            </span>

          </div>

          <h1 className="text-6xl p-3 md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Building the Future of Energy Intelligence
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            Explore VoltStream’s strategic vision for intelligent energy
            management, AI-powered infrastructure analytics, renewable energy
            optimization, and next-generation smart-grid ecosystems.
          </p>

        </div>

        {/* INTRO */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Cpu className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Vision for the Next Generation
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream is evolving into a comprehensive energy intelligence
            platform designed to support households, enterprises, renewable
            infrastructure providers, and smart-city ecosystems through
            scalable cloud-native technologies.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our roadmap focuses on AI automation, predictive analytics,
            infrastructure intelligence, and sustainable digital transformation
            for modern energy systems.
          </p>

        </div>

        {/* ROADMAP TIMELINE */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Product Timeline
          </h2>

          <div className="space-y-10">

            {roadmap.map((item, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-10 hover:border-cyan-500 transition"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">

                  <div>

                    <div className="flex items-center gap-3 mb-4">

                      <span className="bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm">
                        {item.phase}
                      </span>

                      <span className={`px-4 py-1 rounded-full text-sm ${
                        item.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "In Progress"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {item.status}
                      </span>

                    </div>

                    <h3 className="text-3xl font-bold mb-4">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed max-w-4xl">
                      {item.description}
                    </p>

                  </div>

                  <ArrowRight
                    className="text-cyan-400 hidden md:block"
                    size={32}
                  />

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* INNOVATION SECTION */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Strategic Innovations
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {innovations.map((innovation, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <CheckCircle2
                  className="text-cyan-400 mb-5"
                  size={40}
                />

                <h3 className="text-3xl font-bold mb-4">
                  {innovation.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {innovation.description}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* FUTURE INFRASTRUCTURE */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-cyan-500 transition">

            <Brain className="mx-auto text-cyan-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              AI Systems
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Intelligent optimization powered by machine learning models.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">

            <BatteryCharging className="mx-auto text-blue-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Renewable Energy
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Advanced solar and battery infrastructure analytics.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-500 transition">

            <Cloud className="mx-auto text-purple-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Cloud Scaling
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Secure distributed infrastructure for global deployments.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-green-500 transition">

            <Globe className="mx-auto text-green-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Smart Cities
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Future-ready intelligent infrastructure ecosystems.
            </p>

          </div>

        </div>

        {/* SECURITY */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-8">

            <ShieldCheck className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Long-Term Platform Commitment
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream remains committed to building secure, scalable, and
            intelligent infrastructure systems that support sustainable energy
            transformation across industries and connected environments.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our roadmap reflects a long-term vision focused on innovation,
            operational reliability, environmental responsibility, and
            cloud-native scalability.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream Roadmap • Defining the Future of Smart Energy
          </p>

        </div>

      </div>

    </div>
  );
}

export default Roadmap;