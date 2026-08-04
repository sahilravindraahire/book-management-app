
function StatsCard({ label, value, emoji }) {
  return (
    <div className="group bg-white rounded-2xl border border-ink/10 p-4 sm:p-5 flex items-center gap-3 shadow-sm hover:shadow-lg hover:shadow-ink/5 hover:-translate-y-0.5 transition-all duration-200">
      <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200">{emoji}</span>
      <div>
        <p className="text-xl sm:text-2xl font-bold leading-none tabular-nums">{value}</p>
        <p className="text-xs sm:text-sm text-ink/60 mt-1">{label}</p>
      </div>
    </div>
  )
}

export default StatsCard
