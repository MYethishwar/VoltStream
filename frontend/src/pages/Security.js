import {
  ShieldCheck,
  Lock,
  Server,
  Globe,
  Eye,
  Database,
  Cpu,
  CheckCircle2,
  Cloud,
} from "lucide-react";

function Security() {

  const securityLayers = [
    {
      title: "Cloud Infrastructure Protection",
      description:
        "VoltStream operates on secure cloud-native infrastructure designed for high availability, encrypted communication, and scalable deployment reliability.",
    },

    {
      title: "Encrypted Data Transmission",
      description:
        "Platform communications are protected through encrypted network protocols and secure API interactions across infrastructure environments.",
    },

    {
      title: "Continuous Monitoring",
      description:
        "Real-time infrastructure monitoring systems help detect anomalies, improve operational visibility, and maintain platform reliability.",
    },

    {
      title: "Access Control & Authentication",
      description:
        "Role-based access systems and secure authentication practices help safeguard enterprise environments and operational analytics.",
    },
  ];

  const compliance = [
    "Enterprise-grade cloud deployment",
    "Secure API architecture",
    "Infrastructure monitoring systems",
    "Operational analytics protection",
    "Scalable distributed cloud services",
    "Continuous reliability optimization",
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <ShieldCheck className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              VoltStream Security Center
            </span>

          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Enterprise-Grade Security Infrastructure
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            VoltStream is designed with cloud-native security, operational
            reliability, and infrastructure protection at the core of every
            intelligent energy management service.
          </p>

        </div>

        {/* INTRO */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Lock className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Security by Design
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream follows a modern cloud-native security approach focused
            on encrypted communication, secure infrastructure deployment,
            operational transparency, and scalable monitoring systems.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our platform architecture is continuously optimized to support
            enterprise-grade reliability, intelligent infrastructure protection,
            and resilient distributed energy analytics services.
          </p>

        </div>

        {/* SECURITY GRID */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Security Architecture
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {securityLayers.map((layer, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <CheckCircle2
                  className="text-cyan-400 mb-5"
                  size={40}
                />

                <h3 className="text-3xl font-bold mb-4">
                  {layer.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {layer.description}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* CORE SECURITY FEATURES */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-cyan-500 transition">

            <Cloud className="mx-auto text-cyan-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Cloud Security
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Distributed infrastructure protection and secure deployment workflows.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-blue-500 transition">

            <Database className="mx-auto text-blue-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Data Integrity
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Secure operational analytics and protected infrastructure insights.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-500 transition">

            <Server className="mx-auto text-purple-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Infrastructure Reliability
            </h3>

            <p className="text-gray-400 leading-relaxed">
              High-availability systems designed for enterprise energy platforms.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-green-500 transition">

            <Eye className="mx-auto text-green-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Threat Monitoring
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Continuous visibility across platform operations and cloud services.
            </p>

          </div>

        </div>

        {/* COMPLIANCE */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Cpu className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Platform Reliability Standards
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {compliance.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-black/40 border border-gray-800 rounded-2xl p-5"
              >

                <ShieldCheck
                  className="text-cyan-400"
                  size={24}
                />

                <span className="text-gray-300 text-lg">
                  {item}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* GLOBAL SECURITY */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-8">

            <Globe className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Global Infrastructure Protection
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream continuously evolves its security practices to support
            scalable intelligent infrastructure systems, distributed cloud
            operations, and secure enterprise energy monitoring environments.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our long-term security strategy focuses on resilience, operational
            transparency, secure infrastructure design, and sustainable
            cloud-native innovation.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream Security • Trusted Infrastructure for Intelligent Energy
          </p>

        </div>

      </div>

    </div>
  );
}

export default Security;