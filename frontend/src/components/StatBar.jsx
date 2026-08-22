export default function StatBar({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-6 border-t border-edge pt-8 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className="font-display text-3xl font-semibold text-text sm:text-4xl">
            {stat.value}
          </div>
          <div className="mono-label mt-1 text-[11px] text-text-faint">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
