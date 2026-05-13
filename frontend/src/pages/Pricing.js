import {
  Check,
  Zap,
  Building2,
  ShieldCheck,
  Globe,
  Cpu,
  ArrowRight,
} from "lucide-react";

function Pricing() {

  const plans = [
    {
      name: "Starter",
      price: "$29",
      description:
        "Ideal for smart homes and individual energy monitoring.",
      features: [
        "Real-time energy dashboard",
        "Solar generation tracking",
        "Smart device monitoring",
        "Basic analytics reports",
        "Email support",
      ],
      highlight: false,
    },

    {
      name: "Professional",
      price: "$99",
      description:
        "Advanced analytics and automation for growing infrastructure.",
      features: [
        "Everything in Starter",
        "Advanced energy analytics",
        "AI optimization insights",
        "Multi-device automation",
        "Cloud data synchronization",
        "Priority support",
      ],
      highlight: true,
    },

    {
      name: "Enterprise",
      price: "Custom",
      description:
        "Scalable infrastructure monitoring for enterprises and smart cities.",
      features: [
        "Unlimited infrastructure monitoring",
        "Enterprise cloud deployment",
        "Dedicated account manager",
        "Advanced sustainability reports",
        "Custom AI forecasting",
        "24/7 global infrastructure support",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <Zap className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              VoltStream Pricing
            </span>

          </div>

          <h1 className="text-6xl p-3 md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Flexible Plans for Intelligent Energy Management
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            From smart homes to enterprise infrastructure, VoltStream provides
            scalable energy intelligence solutions designed for performance,
            sustainability, and operational efficiency.
          </p>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Building2 className="mx-auto text-cyan-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">120+</h3>

            <p className="text-gray-400">
              Enterprise Deployments
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Globe className="mx-auto text-blue-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">14</h3>

            <p className="text-gray-400">
              Global Smart Regions
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <ShieldCheck className="mx-auto text-green-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">99.98%</h3>

            <p className="text-gray-400">
              Cloud Reliability
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Cpu className="mx-auto text-purple-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">24/7</h3>

            <p className="text-gray-400">
              Infrastructure Monitoring
            </p>

          </div>

        </div>

        {/* PRICING CARDS */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-10 border transition relative overflow-hidden ${
                plan.highlight
                  ? "bg-gradient-to-b from-cyan-500/20 to-blue-500/10 border-cyan-400 scale-105"
                  : "bg-gray-900 border-gray-800 hover:border-cyan-500"
              }`}
            >

              {plan.highlight && (
                <div className="absolute top-5 right-5 bg-cyan-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              <h2 className="text-4xl font-bold mb-4">
                {plan.name}
              </h2>

              <p className="text-gray-400 mb-8 leading-relaxed">
                {plan.description}
              </p>

              <div className="mb-10">

                <span className="text-6xl font-extrabold">
                  {plan.price}
                </span>

                {plan.price !== "Custom" && (
                  <span className="text-gray-400 text-lg">
                    /month
                  </span>
                )}

              </div>

              <div className="space-y-5 mb-10">

                {plan.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4"
                  >

                    <Check className="text-cyan-400" size={20} />

                    <span className="text-gray-300">
                      {feature}
                    </span>

                  </div>
                ))}

              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-cyan-400 text-black hover:bg-cyan-300"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                Get Started
                <ArrowRight size={18} />
              </button>

            </div>
          ))}

        </div>

        {/* ENTERPRISE SECTION */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Building2 className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Enterprise Energy Intelligence
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream Enterprise provides advanced infrastructure analytics,
            large-scale cloud deployment, AI-powered optimization, and
            sustainability reporting for industrial environments, smart
            campuses, data centers, and connected smart-city ecosystems.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our enterprise platform is designed for high availability,
            real-time monitoring, secure cloud-native architecture, and
            intelligent energy optimization at global scale.
          </p>

        </div>

        {/* FAQ */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

              <h3 className="text-2xl font-bold mb-4">
                Can I upgrade my plan later?
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Yes. VoltStream plans are designed to scale with your energy
                infrastructure needs and can be upgraded anytime.
              </p>

            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

              <h3 className="text-2xl font-bold mb-4">
                Does VoltStream support renewable energy systems?
              </h3>

              <p className="text-gray-400 leading-relaxed">
                VoltStream supports solar monitoring, battery analytics,
                sustainability reporting, and renewable energy optimization.
              </p>

            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

              <h3 className="text-2xl font-bold mb-4">
                Is enterprise deployment cloud-native?
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Yes. VoltStream is built using scalable cloud-native
                infrastructure with secure global deployment capabilities.
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream Pricing • Intelligent Energy Solutions for Every Scale
          </p>

        </div>

      </div>

    </div>
  );
}

export default Pricing;