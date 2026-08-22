const initialColors = [
  "bg-violet/20 text-violet-bright",
  "bg-amber/20 text-amber",
  "bg-live/20 text-live"
];

export default function ProfileCard({ profile, whyMatched, index = 0 }) {
  const colorClass = initialColors[index % initialColors.length];

  return (
    <div className="group rounded-2xl border border-edge bg-surface/60 p-5 transition-colors hover:border-violet/40 hover:bg-surface">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${colorClass}`}
        >
          {profile.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-display text-base font-semibold">{profile.name}</h3>
          </div>
          <p className="mono-label text-[11px] text-text-faint">{profile.role}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-muted">{profile.bio}</p>

      {profile.skills?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-edge px-2 py-0.5 text-[11px] text-text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-live">
        <span className="h-1.5 w-1.5 rounded-full bg-live" />
        <span className="text-text-muted">{profile.availability}</span>
      </div>

      {whyMatched ? (
        <p className="mt-3 rounded-lg bg-violet/10 px-3 py-2 text-xs leading-relaxed text-violet-bright">
          {whyMatched}
        </p>
      ) : null}

      <button className="mt-4 w-full rounded-full bg-surface-2 py-2 text-sm font-medium text-text transition-colors hover:bg-violet hover:text-white">
        Connect
      </button>
    </div>
  );
}
