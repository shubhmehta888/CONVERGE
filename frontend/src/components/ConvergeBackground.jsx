export default function ConvergeBackground({ className = "" }) {
  return (
    <svg
      viewBox="0 0 740 340"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-70 ${className}`}
      aria-hidden="true"
    >
      <path d="M-40 275 C120 125 245 330 410 175 S650 60 790 155" fill="none" stroke="url(#horizon-line)" strokeWidth="2" className="line-draw" />
      <path d="M-60 315 C100 185 235 350 390 225 S650 120 800 205" fill="none" stroke="url(#horizon-line)" strokeWidth="1" opacity="0.55" />
      <path d="M40 45 C210 115 330 5 500 85 S680 140 770 70" fill="none" stroke="#FF806D" strokeWidth="1" opacity="0.34" className="line-draw" />
      <ellipse cx="570" cy="115" rx="180" ry="70" fill="url(#campus-glow)" opacity="0.55" />
      <ellipse cx="570" cy="115" rx="100" ry="36" fill="none" stroke="#63D8BD" strokeWidth="1" opacity="0.42" className="node-pulse" />
      <defs>
        <linearGradient id="horizon-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#21B89A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#21B89A" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="campus-glow">
          <stop offset="0%" stopColor="#21B89A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#21B89A" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
