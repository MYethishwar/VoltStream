import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock3,
  Send,
  Building2,
  ShieldCheck,
  Headphones,
} from "lucide-react";

function Contact() {

  const offices = [
    {
      city: "Singapore",
      address: "Marina Tech District, Tower 8",
      type: "Global Headquarters",
    },

    {
      city: "London",
      address: "Canary Wharf Innovation Center",
      type: "European Operations",
    },

    {
      city: "Bangalore",
      address: "Electronic City Smart Campus",
      type: "Engineering Hub",
    },

    {
      city: "San Francisco",
      address: "Mission Bay Energy Labs",
      type: "AI Research Division",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <div className="text-center mb-24">

          <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 px-5 py-2 rounded-full mb-6">

            <Mail className="text-cyan-400" size={22} />

            <span className="text-cyan-300 font-medium">
              Contact VoltStream
            </span>

          </div>

          <h1 className="text-6xl  p-2 md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Let’s Build Smarter Energy Together
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-400 leading-relaxed">
            Connect with VoltStream to explore intelligent energy solutions,
            enterprise infrastructure monitoring, renewable energy analytics,
            and next-generation smart-grid technologies.
          </p>

        </div>

        {/* CONTACT INFO */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-cyan-500 transition">

            <Phone className="mx-auto text-cyan-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Enterprise Support
            </h3>

            <p className="text-gray-400 mb-2">
              +1 (800) 458-2034
            </p>

            <p className="text-gray-500 text-sm">
              24/7 Global Infrastructure Assistance
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500 transition">

            <Mail className="mx-auto text-blue-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Business Inquiries
            </h3>

            <p className="text-gray-400 mb-2">
              partnerships@voltstream.io
            </p>

            <p className="text-gray-500 text-sm">
              Enterprise & Strategic Partnerships
            </p>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center hover:border-purple-500 transition">

            <Clock3 className="mx-auto text-purple-400 mb-5" size={42} />

            <h3 className="text-2xl font-bold mb-3">
              Support Availability
            </h3>

            <p className="text-gray-400 mb-2">
              Monday — Sunday
            </p>

            <p className="text-gray-500 text-sm">
              Continuous Monitoring Operations
            </p>

          </div>

        </div>

        {/* CONTACT FORM + INFO */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">

          {/* FORM */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">

            <div className="flex items-center gap-4 mb-8">

              <Send className="text-cyan-400" size={36} />

              <h2 className="text-4xl font-bold">
                Send Us a Message
              </h2>

            </div>

            <form className="space-y-6">

              <div>
                <label className="block text-gray-400 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  Company / Organization
                </label>

                <input
                  type="text"
                  placeholder="Company name"
                  className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  Message
                </label>

                <textarea
                  rows="6"
                  placeholder="Tell us about your project or inquiry..."
                  className="w-full bg-black border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 transition text-black font-bold py-4 rounded-xl"
              >
                Submit Inquiry
              </button>

            </form>

          </div>

          {/* COMPANY INFO */}
          <div className="space-y-8">

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-10">

              <div className="flex items-center gap-4 mb-6">

                <Headphones className="text-cyan-400" size={40} />

                <h2 className="text-4xl font-bold">
                  Enterprise Solutions
                </h2>

              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                VoltStream partners with enterprises, smart-city initiatives,
                renewable infrastructure providers, and cloud-native platforms
                to deliver intelligent energy management solutions globally.
              </p>

              <p className="text-gray-300 text-lg leading-relaxed">
                Our engineering and analytics teams help organizations optimize
                electricity consumption, improve sustainability reporting,
                and modernize energy infrastructure through real-time insights.
              </p>

            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">

              <div className="flex items-center gap-4 mb-8">

                <Building2 className="text-cyan-400" size={40} />

                <h2 className="text-4xl font-bold">
                  Global Offices
                </h2>

              </div>

              <div className="space-y-6">

                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-800 pb-5 last:border-none"
                  >

                    <div className="flex items-center gap-3 mb-2">

                      <MapPin className="text-cyan-400" size={18} />

                      <h3 className="text-2xl font-semibold">
                        {office.city}
                      </h3>

                    </div>

                    <p className="text-gray-400 mb-1">
                      {office.address}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {office.type}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

        {/* TRUST SECTION */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 mb-20">

          <div className="flex items-center gap-4 mb-8">

            <ShieldCheck className="text-cyan-400" size={40} />

            <h2 className="text-5xl font-bold">
              Trusted Energy Infrastructure
            </h2>

          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            VoltStream supports enterprise-grade energy monitoring systems with
            secure cloud-native architecture, scalable analytics infrastructure,
            and intelligent real-time reporting capabilities.
          </p>

          <p className="text-gray-300 text-lg leading-relaxed">
            From smart homes to industrial facilities, our platform is designed
            to simplify energy intelligence and accelerate sustainable digital
            transformation.
          </p>

        </div>

        {/* FOOTER */}
        <div className="text-center border-t border-gray-800 pt-10">

          <Globe className="mx-auto text-cyan-400 mb-4" size={42} />

          <p className="text-gray-500 text-lg">
            VoltStream • Global Energy Intelligence Network
          </p>

        </div>

      </div>

    </div>
  );
}

export default Contact;