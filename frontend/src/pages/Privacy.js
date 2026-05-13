import {
  ShieldCheck,
  Lock,
  Database,
  Globe,
  Eye,
  Server,
  CheckCircle2,
} from "lucide-react";

function Privacy() {

  const sections = [
    {
      title: "Information We Collect",
      description:
        "VoltStream may collect account details, device analytics, infrastructure usage data, and platform interaction metrics to provide intelligent energy monitoring services.",
    },

    {
      title: "How We Use Data",
      description:
        "Collected information helps optimize dashboard performance, generate analytics insights, improve infrastructure monitoring, and enhance platform security.",
    },

    {
      title: "Cloud Infrastructure Security",
      description:
        "VoltStream uses enterprise-grade cloud-native architecture and encrypted communication protocols to protect user information and operational data.",
    },

    {
      title: "User Privacy Controls",
      description:
        "Users maintain control over their account settings, analytics preferences, and communication permissions through platform privacy controls.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <ShieldCheck className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              VoltStream Privacy Policy
            </span>

          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Privacy & Data Protection
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            VoltStream is committed to maintaining transparency, protecting
            user information, and ensuring secure cloud-native infrastructure
            operations across all intelligent energy management services.
          </p>

        </div>

        {/* INTRO */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Lock className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Our Commitment to Privacy
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream designs its intelligent energy platform with security,
            privacy, and operational transparency as core principles.
            We continuously implement modern infrastructure practices to
            safeguard user information and cloud-based analytics systems.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our mission is to provide advanced energy intelligence solutions
            while respecting user trust and maintaining enterprise-grade
            security standards across all services.
          </p>

        </div>

        {/* POLICY SECTIONS */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Privacy Principles
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <CheckCircle2
                  className="text-cyan-400 mb-5"
                  size={38}
                />

                <h3 className="text-3xl font-bold mb-4">
                  {section.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {section.description}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* SECURITY GRID */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-cyan-500 transition">

            <Server className="mx-auto text-cyan-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Secure Infrastructure
            </h3>

            <p className="text-gray-400 leading-relaxed">
              VoltStream uses cloud-native architecture with encrypted
              infrastructure communication and secure deployment practices.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500 transition">

            <Database className="mx-auto text-blue-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Data Protection
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Platform analytics and operational information are processed
              using enterprise-grade data management standards.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-purple-500 transition">

            <Globe className="mx-auto text-purple-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Global Compliance
            </h3>

            <p className="text-gray-400 leading-relaxed">
              VoltStream continuously reviews privacy practices to align
              with modern international data protection expectations.
            </p>

          </div>

        </div>

        {/* DATA USAGE */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Eye className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Transparency in Data Usage
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream uses operational and analytics information exclusively
            for improving platform intelligence, infrastructure optimization,
            service reliability, and user experience enhancement.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            We do not intentionally expose confidential operational analytics
            or identifiable infrastructure data outside authorized platform
            services and enterprise workflows.
          </p>

        </div>

        {/* USER RIGHTS */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-20">

          <h2 className="text-5xl font-bold mb-8">
            User Rights & Controls
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Users may request updates to account preferences, manage platform
            communication settings, and review available privacy controls
            through their VoltStream account environment.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            VoltStream remains committed to maintaining secure, transparent,
            and trustworthy digital infrastructure for all intelligent energy
            management services.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream • Privacy & Infrastructure Security Center
          </p>

        </div>

      </div>

    </div>
  );
}

export default Privacy;