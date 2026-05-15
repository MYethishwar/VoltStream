export default function Glossary() {

  const terms = [

    {
      title: "Energy Consumption",
      desc:
        "The total amount of electricity used by a device, home, or system over time.",
    },

    {
      title: "Peak Usage",
      desc:
        "The time period when electricity demand is highest.",
    },

    {
      title: "Smart Device",
      desc:
        "An internet-connected device that can monitor, automate, or optimize energy usage.",
    },

    {
      title: "kWh (Kilowatt-hour)",
      desc:
        "A unit used to measure electricity consumption.",
    },

    {
      title: "Carbon Footprint",
      desc:
        "The amount of carbon emissions generated from energy usage.",
    },

    {
      title: "Energy Efficiency",
      desc:
        "Using less electricity to perform the same task effectively.",
    },

    {
      title: "Real-Time Monitoring",
      desc:
        "Tracking energy usage instantly as devices consume power.",
    },

    {
      title: "Load Management",
      desc:
        "Balancing electricity demand to reduce overload and costs.",
    },

  ];

  return (

    <div className="min-h-screen bg-black text-white px-6 py-16">

      <div className="max-w-6xl mx-auto">

        <div className="mb-14">

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Energy Glossary
          </h1>

          <p className="text-gray-400 text-lg max-w-3xl leading-8">
            Understand important energy monitoring, analytics,
            billing, and smart device terminology used inside VoltStream.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {terms.map((term, index) => (

            <div
              key={index}
              className="
                p-6
                rounded-2xl
                border
                border-cyan-500/10
                bg-white/5
                backdrop-blur-lg
                hover:border-cyan-400/30
                transition-all
                duration-300
              "
            >

              <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                {term.title}
              </h2>

              <p className="text-gray-300 leading-7">
                {term.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}