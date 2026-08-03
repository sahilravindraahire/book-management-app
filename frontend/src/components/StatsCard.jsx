
function StatsCard({ label, value, emoji }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 p-4 sm:p-5 flex items-center gap-3 shadow-sm">
      <span className="text-2xl sm:text-3xl">{emoji}</span>
      <div>
        <p className="text-xl sm:text-2xl font-bold leading-none">{value}</p>
        <p className="text-xs sm:text-sm text-ink/60 mt-1">{label}</p>
      </div>
    </div>
  )
}

export default StatsCard
