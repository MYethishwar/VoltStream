import {
  Briefcase,
  Globe,
  Users,
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Rocket,
} from "lucide-react";

function Careers() {

  const openings = [
    {
      id: 1,
      role: "Frontend Engineer",
      location: "Bangalore, India",
      type: "Full Time",
      department: "Engineering",
      description:
        "Build scalable React interfaces and interactive analytics dashboards for enterprise energy monitoring systems.",
    },

    {
      id: 2,
      role: "Cloud Infrastructure Engineer",
      location: "Singapore",
      type: "Full Time",
      department: "Cloud & DevOps",
      description:
        "Design and manage cloud-native infrastructure using Docker, Kubernetes, and distributed monitoring systems.",
    },

    {
      id: 3,
      role: "Energy Data Analyst",
      location: "London, UK",
      type: "Hybrid",
      department: "Analytics",
      description:
        "Analyze real-time energy datasets and generate insights for sustainability optimization and forecasting.",
    },

    {
      id: 4,
      role: "AI Systems Engineer",
      location: "Remote",
      type: "Remote",
      department: "Artificial Intelligence",
      description:
        "Develop AI-driven energy optimization and predictive analytics systems for intelligent smart-grid platforms.",
    },
  ];

  const benefits = [
    {
      title: "Global Remote Culture",
      description:
        "Collaborate with teams across international smart-energy and cloud infrastructure projects.",
    },

    {
      title: "Innovation-Driven Teams",
      description:
        "Work with engineers, analysts, and researchers building next-generation energy intelligence systems.",
    },

    {
      title: "Learning & Growth",
      description:
        "Access mentorship programs, certifications, technical workshops, and cloud engineering resources.",
    },

    {
      title: "Impactful Mission",
      description:
        "Contribute toward sustainability, renewable energy adoption, and smarter infrastructure worldwide.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <Briefcase className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              Careers at VoltStream
            </span>

          </div>

          <h1 className="text-6xl p-3 md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Build the Future of Energy Intelligence
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            Join VoltStream and help shape the future of sustainable energy,
            intelligent infrastructure, cloud-native systems, and smart-grid
            innovation across global industries.
          </p>

        </div>

        {/* COMPANY STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Users className="mx-auto text-cyan-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">450+</h3>

            <p className="text-gray-400">
              Team Members
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Globe className="mx-auto text-blue-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">14</h3>

            <p className="text-gray-400">
              Global Locations
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Building2 className="mx-auto text-purple-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">120+</h3>

            <p className="text-gray-400">
              Enterprise Clients
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">

            <Zap className="mx-auto text-green-400 mb-4" size={40} />

            <h3 className="text-4xl font-bold mb-2">18M+</h3>

            <p className="text-gray-400">
              kWh Optimized
            </p>

          </div>

        </div>

        {/* CULTURE */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-12 mb-24">

          <div className="flex items-center gap-4 mb-8">

            <Rocket className="text-cyan-400" size={42} />

            <h2 className="text-5xl font-bold">
              Life at VoltStream
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream combines cutting-edge cloud engineering, AI systems,
            energy analytics, and sustainability innovation into one unified
            mission. Our teams work on scalable technologies that directly
            impact how modern infrastructure consumes and optimizes energy.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            We foster a culture of collaboration, curiosity, and continuous
            learning while empowering engineers and researchers to build
            globally impactful solutions.
          </p>

        </div>

        {/* BENEFITS */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Why Join VoltStream
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <ShieldCheck className="text-cyan-400 mb-5" size={40} />

                <h3 className="text-3xl font-bold mb-4">
                  {benefit.title}
                </h3>

                <p className="text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* OPEN ROLES */}
        <div className="mb-24">

          <h2 className="text-5xl font-bold mb-14">
            Open Opportunities
          </h2>

          <div className="space-y-8">

            {openings.map((job) => (
              <div
                key={job.id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:border-cyan-500 transition"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div>

                    <div className="flex items-center gap-3 mb-4">

                      <span className="bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm">
                        {job.department}
                      </span>

                      <span className="bg-gray-800 text-gray-300 px-4 py-1 rounded-full text-sm">
                        {job.type}
                      </span>

                    </div>

                    <h3 className="text-3xl font-bold mb-3">
                      {job.role}
                    </h3>

                    <p className="text-gray-500 mb-4">
                      {job.location}
                    </p>

                    <p className="text-gray-400 leading-relaxed max-w-3xl">
                      {job.description}
                    </p>

                  </div>

                  <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 transition px-6 py-3 rounded-xl font-semibold text-black">
                    Apply Now
                    <ArrowRight size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* FUTURE */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-8">

            <Cpu className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Innovating Beyond Tomorrow
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream is building next-generation platforms for intelligent
            energy ecosystems, predictive analytics, AI optimization, and
            sustainable smart-city infrastructure.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            If you're passionate about technology, cloud systems, renewable
            energy, and meaningful innovation, VoltStream is the place to
            create impactful solutions at global scale.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <p className="text-gray-500 text-lg">
            VoltStream Careers • Powering Sustainable Innovation
          </p>

        </div>

      </div>

    </div>
  );
}

export default Careers;