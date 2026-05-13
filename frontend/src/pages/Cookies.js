import {
  Cookie,
  ShieldCheck,
  Globe,
  Database,
  Lock,
  CheckCircle2,
} from "lucide-react";

function Cookies() {

  const cookieTypes = [
    {
      title: "Essential Cookies",
      description:
        "Required for core platform functionality including authentication, navigation, and secure access to VoltStream services.",
    },

    {
      title: "Analytics Cookies",
      description:
        "Used to analyze platform usage patterns, performance metrics, and user interaction insights to improve the user experience.",
    },

    {
      title: "Preference Cookies",
      description:
        "Store personalized settings such as dashboard configurations, language preferences, and interface customization.",
    },

    {
      title: "Security Cookies",
      description:
        "Help detect suspicious activity, prevent unauthorized access, and maintain secure cloud infrastructure operations.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <Cookie className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              VoltStream Cookie Policy
            </span>

          </div>

          <h1 className="text-6xl p-3 md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Cookie & Tracking Technologies
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            VoltStream uses cookies and related technologies to improve
            platform performance, enhance security, personalize user
            experiences, and optimize intelligent energy analytics services.
          </p>

        </div>

        {/* INTRO */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <ShieldCheck className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Why We Use Cookies
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Cookies are small text files stored on your device that help
            VoltStream provide secure, reliable, and optimized experiences
            across our cloud-based energy management platform.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            These technologies enable intelligent dashboard functionality,
            analytics reporting, infrastructure monitoring, account security,
            and personalized user interactions.
          </p>

        </div>

        {/* COOKIE TYPES */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Types of Cookies We Use
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {cookieTypes.map((cookie, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <CheckCircle2
                  className="text-cyan-400 mb-5"
                  size={38}
                />

                <h3 className="text-3xl font-bold mb-4">
                  {cookie.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {cookie.description}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* DATA & PRIVACY */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-cyan-500 transition">

            <Database className="mx-auto text-cyan-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Data Optimization
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Usage analytics help improve platform performance and enhance
              intelligent energy reporting capabilities.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500 transition">

            <Lock className="mx-auto text-blue-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Secure Sessions
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Authentication and security cookies help protect enterprise
              infrastructure and user accounts.
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-purple-500 transition">

            <Globe className="mx-auto text-purple-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Global Performance
            </h3>

            <p className="text-gray-400 leading-relaxed">
              Cookies assist in optimizing cloud-based services across global
              infrastructure regions and deployments.
            </p>

          </div>

        </div>

        {/* USER CONTROL */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Cookie className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Managing Your Cookie Preferences
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Users may configure browser settings to block or remove cookies at
            any time. However, disabling certain cookies may affect platform
            functionality, authentication workflows, and analytics features.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            VoltStream continuously reviews its privacy and tracking practices
            to ensure compliance with modern data protection standards and
            enterprise security expectations.
          </p>

        </div>

        {/* LAST SECTION */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-20">

          <h2 className="text-5xl font-bold mb-8">
            Transparency & Trust
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream is committed to maintaining transparency regarding
            data collection technologies, infrastructure monitoring systems,
            and user privacy practices.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our mission is to deliver secure and intelligent energy management
            experiences while respecting user privacy and maintaining
            enterprise-grade trust standards.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream • Cookie & Privacy Transparency Center
          </p>

        </div>

      </div>

    </div>
  );
}

export default Cookies;