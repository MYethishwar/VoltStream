import {
  FileText,
  ShieldCheck,
  Globe,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Database,
  Server,
} from "lucide-react";

function Terms() {

  const sections = [
    {
      title: "Platform Usage",
      description:
        "VoltStream provides intelligent energy monitoring and analytics services for informational, operational, and infrastructure optimization purposes.",
    },

    {
      title: "Account Responsibilities",
      description:
        "Users are responsible for maintaining secure account credentials and ensuring authorized access to connected infrastructure systems.",
    },

    {
      title: "Cloud Infrastructure Services",
      description:
        "VoltStream operates through scalable cloud-native infrastructure that may evolve, expand, or update platform capabilities over time.",
    },

    {
      title: "Acceptable Use",
      description:
        "Users agree not to misuse platform services, interfere with operational systems, or attempt unauthorized access to infrastructure environments.",
    },
  ];

  const guidelines = [
    "Use services responsibly and legally",
    "Maintain secure authentication credentials",
    "Protect connected infrastructure environments",
    "Respect platform operational limitations",
    "Avoid unauthorized automation or abuse",
    "Comply with regional digital regulations",
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <FileText className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              VoltStream Terms of Service
            </span>

          </div>

          <h1 className="text-6xl p-3 md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Terms & Platform Usage Policies
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            These Terms of Service define the guidelines, responsibilities,
            and operational principles governing the use of VoltStream’s
            intelligent energy management platform and cloud-native services.
          </p>

        </div>

        {/* INTRO */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Scale className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Agreement Overview
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            By accessing or using VoltStream services, users acknowledge and
            agree to operate within these platform guidelines, security
            expectations, and infrastructure usage standards.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            VoltStream continuously develops intelligent infrastructure systems
            and may enhance, modify, or expand service capabilities to improve
            operational reliability and user experience.
          </p>

        </div>

        {/* TERMS SECTIONS */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Core Service Principles
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <CheckCircle2
                  className="text-cyan-400 mb-5"
                  size={40}
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

        {/* GUIDELINES */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-cyan-500 transition">

            <ShieldCheck className="mx-auto text-cyan-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Security Expectations
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Users should maintain secure access practices and protect
              connected infrastructure systems responsibly.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500 transition">

            <Database className="mx-auto text-blue-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Data Responsibility
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Operational analytics and infrastructure insights should be used
              ethically and within authorized platform workflows.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-purple-500 transition">

            <Server className="mx-auto text-purple-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Infrastructure Integrity
            </h3>

            <p className="text-gray-400 leading-relaxed">
              VoltStream services are designed for reliable operations and
              should not be intentionally disrupted or abused.
            </p>

          </div>

        </div>

        {/* ACCEPTABLE USE */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Lock className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Acceptable Use Guidelines
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {guidelines.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-black/40 border border-gray-800 rounded-2xl p-5"
              >

                <CheckCircle2
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

        {/* LIMITATION */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <AlertTriangle className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Service Availability & Limitations
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream continuously improves platform infrastructure and may
            perform maintenance, upgrades, or operational optimizations that
            could temporarily affect certain services or analytics systems.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            While VoltStream aims to provide reliable infrastructure services,
            platform availability and analytics accuracy may vary depending on
            connected systems, integrations, and operational environments.
          </p>

        </div>

        {/* GLOBAL COMPLIANCE */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-8">

            <Globe className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Global Platform Operations
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream supports intelligent infrastructure systems across
            multiple regions and cloud environments while maintaining modern
            operational, privacy, and infrastructure standards.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Continued use of VoltStream services indicates acceptance of these
            platform guidelines and operational policies.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream Terms • Intelligent Infrastructure Usage Standards
          </p>

        </div>

      </div>

    </div>
  );
}

export default Terms;