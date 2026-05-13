import {
  Zap,
  TrendingUp,
  Building2,
  Globe,
  Leaf,
  BatteryCharging,
  Cpu,
  BarChart3,
  ArrowRight,
} from "lucide-react";

function Blog() {

  const caseStudies = [
    {
      id: 1,
      company: "NovaGrid Technologies",
      industry: "Smart Manufacturing",
      savings: "32%",
      title: "Reducing Industrial Energy Waste with AI Monitoring",
      description:
        "NovaGrid Technologies deployed VoltStream across multiple manufacturing facilities to monitor machine-level electricity consumption and optimize operational efficiency.",
      results: [
        "32% reduction in monthly electricity costs",
        "Real-time monitoring across 4 factories",
        "Improved sustainability reporting",
      ],
    },

    {
      id: 2,
      company: "EcoRise Residences",
      industry: "Residential Smart Housing",
      savings: "24%",
      title: "Smart Apartment Energy Optimization",
      description:
        "VoltStream helped EcoRise implement smart energy dashboards for luxury residential apartments powered by solar-integrated infrastructure.",
      results: [
        "24% lower energy consumption",
        "Solar generation analytics",
        "Remote appliance automation",
      ],
    },

    {
      id: 3,
      company: "Vertex Data Centers",
      industry: "Cloud Infrastructure",
      savings: "18%",
      title: "Power Optimization for High-Density Data Centers",
      description:
        "VoltStream analytics enabled Vertex Data Centers to optimize cooling infrastructure and monitor energy distribution in real time.",
      results: [
        "18% reduction in cooling costs",
        "Enhanced infrastructure visibility",
        "AI-driven load balancing",
      ],
    },

    {
      id: 4,
      company: "GreenMotion EV",
      industry: "Electric Vehicle Networks",
      savings: "41%",
      title: "Smart EV Charging Distribution Platform",
      description:
        "GreenMotion EV integrated VoltStream to optimize charging station load balancing and renewable energy utilization.",
      results: [
        "41% reduction in peak-hour usage",
        "Battery optimization analytics",
        "Renewable load balancing",
      ],
    },
  ];

  const articles = [
    {
      id: 1,
      title: "The Rise of Intelligent Energy Platforms",
      category: "Technology",
      readTime: "5 min read",
      description:
        "Modern homes and enterprises are rapidly adopting smart energy systems powered by real-time monitoring and AI analytics.",
    },

    {
      id: 2,
      title: "How Renewable Energy is Transforming Smart Cities",
      category: "Sustainability",
      readTime: "7 min read",
      description:
        "Solar energy, battery storage, and IoT systems are becoming the foundation of sustainable urban infrastructure.",
    },

    {
      id: 3,
      title: "Understanding Real-Time Energy Analytics",
      category: "Analytics",
      readTime: "4 min read",
      description:
        "Interactive dashboards simplify complex electricity data and help users optimize consumption patterns effectively.",
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
              VoltStream Insights
            </span>
          </div>

          <h1 className="text-6xl md:text-6xl  p-2 font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Energy Intelligence Blog
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            Discover how intelligent energy monitoring, renewable systems,
            cloud infrastructure, and smart analytics are shaping the future
            of sustainable living and enterprise energy management.
          </p>

        </div>

        {/* FEATURED ARTICLE */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-3 mb-6">

            <TrendingUp className="text-cyan-400" size={36} />

            <span className="text-cyan-400 uppercase tracking-wider font-semibold">
              Featured Story
            </span>

          </div>

          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Why Smart Energy Platforms Are Becoming Essential in Modern Infrastructure
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Energy consumption is evolving rapidly as homes, industries, and
            smart cities adopt connected technologies. Traditional electricity
            monitoring systems no longer provide the visibility needed to
            optimize efficiency and sustainability.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream bridges this gap by transforming raw electricity data
            into powerful visual insights. Users can monitor grid consumption,
            solar generation, battery storage, and smart appliances through
            one centralized cloud-powered platform.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            Through real-time analytics and intelligent monitoring,
            VoltStream empowers users to reduce electricity costs, improve
            operational efficiency, and build more sustainable energy habits.
          </p>

        </div>

        {/* QUICK STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <Building2 className="mx-auto text-cyan-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">120+</h3>

            <p className="text-gray-400">
              Enterprise Deployments
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <Leaf className="mx-auto text-green-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">18M</h3>

            <p className="text-gray-400">
              kWh Energy Optimized
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <BatteryCharging className="mx-auto text-blue-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">42%</h3>

            <p className="text-gray-400">
              Average Energy Savings
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
            <Globe className="mx-auto text-purple-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">14</h3>

            <p className="text-gray-400">
              Global Smart Regions
            </p>
          </div>

        </div>

        {/* CASE STUDIES */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Enterprise Case Studies
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <div className="flex items-center justify-between mb-5">

                  <span className="text-cyan-400 font-semibold">
                    {study.company}
                  </span>

                  <span className="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm">
                    {study.savings} Savings
                  </span>

                </div>

                <p className="text-sm text-gray-500 mb-3">
                  {study.industry}
                </p>

                <h3 className="text-3xl font-bold mb-5 leading-snug">
                  {study.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6">
                  {study.description}
                </p>

                <div className="space-y-3 mb-6">

                  {study.results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>

                      {result}
                    </div>
                  ))}

                </div>

                <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
                  Read Full Case Study
                  <ArrowRight size={18} />
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* INSIGHTS */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Latest Insights
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-cyan-500 transition"
              >

                <div className="flex items-center justify-between mb-5">

                  <span className="text-cyan-400 text-sm font-medium">
                    {article.category}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {article.readTime}
                  </span>

                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {article.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6">
                  {article.description}
                </p>

                <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition">
                  Continue Reading
                  <ArrowRight size={18} />
                </button>

              </div>
            ))}

          </div>

        </div>

        {/* FUTURE */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-8">

            <Cpu className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              The Future of Energy Intelligence
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream is designed to evolve with the future of smart energy
            ecosystems. Upcoming innovations include AI-powered optimization,
            predictive energy forecasting, smart-grid integration, and advanced
            sustainability analytics.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            As industries and households continue transitioning toward renewable
            infrastructure, intelligent platforms like VoltStream will become
            essential for efficient and sustainable energy management.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <BarChart3 className="mx-auto text-cyan-400 mb-4" size={42} />

          <p className="text-gray-500 text-lg">
            VoltStream • Enterprise Energy Intelligence Platform
          </p>

        </div>

      </div>

    </div>
  );
}

export default Blog;