import {
  Zap,
  Cpu,
  Cloud,
  Activity,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">
            <Zap className="text-cyan-400" size={22} />
            <span className="text-cyan-300 font-medium">
              Smart Energy Monitoring Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            About VoltStream
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            VoltStream is a modern cloud-native smart energy monitoring
            application designed for prosumer environments where users both
            consume electricity from the grid and generate renewable energy
            through solar systems.
          </p>

        </div>

        {/* MISSION SECTION */}
        <div className="grid md:grid-cols-2 gap-10 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              Our Mission
            </h2>

            <p className="text-gray-400 leading-relaxed text-lg">
              VoltStream helps users track energy usage, monitor solar power
              generation, manage smart appliances, and optimize electricity
              consumption through real-time analytics and cloud-based
              infrastructure.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">
              Cloud Powered
            </h2>

            <p className="text-gray-400 leading-relaxed text-lg">
              The application is fully deployed using Google Cloud Platform,
              Docker containers, Firebase Hosting, and Cloud Run for scalable
              production-ready deployment.
            </p>
          </div>

        </div>

        {/* FEATURES */}
        <div className="mb-24">

          <h2 className="text-4xl font-bold text-center mb-14">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-cyan-500 transition">
              <Activity className="text-cyan-400 mb-5" size={40} />

              <h3 className="text-2xl font-semibold mb-4">
                Live Dashboard
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Monitor real-time grid usage, solar generation, battery
                performance, and net electricity consumption instantly.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-500 transition">
              <BarChart3 className="text-blue-400 mb-5" size={40} />

              <h3 className="text-2xl font-semibold mb-4">
                Smart Analytics
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Analyze daily, weekly, and monthly energy consumption using
                interactive charts and intelligent visualizations.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-purple-500 transition">
              <Cpu className="text-purple-400 mb-5" size={40} />

              <h3 className="text-2xl font-semibold mb-4">
                IoT Device Control
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Control smart appliances remotely with real-time ON/OFF device
                management powered by FastAPI backend APIs.
              </p>
            </div>

          </div>

        </div>

        {/* TECH STACK */}
        <div className="mb-24">

          <h2 className="text-4xl font-bold text-center mb-14">
            Technology Stack
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              "ReactJS",
              "Tailwind CSS",
              "FastAPI",
              "Docker",
              "Firebase Hosting",
              "Google Cloud Run",
              "Artifact Registry",
              "Recharts",
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-cyan-500 transition"
              >
                <p className="text-lg font-semibold text-gray-200">
                  {tech}
                </p>
              </div>
            ))}

          </div>

        </div>

        {/* DEPLOYMENT */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-6">
            <Cloud className="text-cyan-400" size={42} />

            <h2 className="text-4xl font-bold">
              Production Deployment
            </h2>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream follows a modern cloud-native deployment architecture
            using Docker containers, Artifact Registry, Cloud Run, and Firebase
            Hosting to deliver scalable and high-performance full-stack
            applications.
          </p>

          <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 overflow-x-auto">

            <pre className="text-cyan-300 text-sm">
{`React Frontend
      ↓
Firebase Hosting
      ↓ API Calls
FastAPI Backend
      ↓
Docker Container
      ↓
Artifact Registry
      ↓
Google Cloud Run`}
            </pre>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <ShieldCheck className="mx-auto text-green-400 mb-4" size={42} />

          <p className="text-gray-500 text-lg">
            VoltStream • Smart Energy Intelligence Platform
          </p>

        </div>

      </div>

    </div>
  );
}

export default About;