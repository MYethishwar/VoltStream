function StatCard({ title, value, subtitle, color }) {
  return (
    <div className={`bg-${color}-500/10 border border-${color}-500/20 backdrop-blur-lg rounded-2xl p-6`}>
      <p className={`text-${color}-300 text-sm`}>
        {title}
      </p>

      <h2 className="text-4xl font-bold text-white mt-2">
        {value}
      </h2>

      <p className={`text-${color}-200 text-sm mt-2`}>
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;