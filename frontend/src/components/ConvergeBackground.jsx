// The page's signature element: a quiet node-graph that suggests "a mesh of
// people" — nodes are students, lines are potential connections. Two lines
// draw themselves in on load to suggest a match resolving, then everything
// settles into a slow ambient pulse. Respects prefers-reduced-motion via
// the .node-pulse / .line-draw CSS rules (disabled globally in index.css).

const nodes = [
  { x: 60, y: 90 }, { x: 180, y: 40 }, { x: 300, y: 120 }, { x: 420, y: 60 },
  { x: 540, y: 140 }, { x: 660, y: 50 }, { x: 120, y: 220 }, { x: 260, y: 260 },
  { x: 400, y: 210 }, { x: 560, y: 250 }, { x: 700, y: 190 }, { x: 40, y: 300 }
];

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 6], [6, 7], [7, 8], [8, 9],
  [9, 10], [2, 8], [0, 6], [11, 6], [3, 8]
];

export default function ConvergeBackground({ className = "" }) {
  return (
    <svg
      viewBox="0 0 740 340"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-70 ${className}`}
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#mesh-line)"
          strokeWidth="1"
          className={i < 3 ? "line-draw" : ""}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 3.5 : 2.5}
          fill={i % 4 === 0 ? "#FFB648" : "#8B7BFF"}
          className="node-pulse"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
      <defs>
        <linearGradient id="mesh-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6E5BFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6E5BFF" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}
