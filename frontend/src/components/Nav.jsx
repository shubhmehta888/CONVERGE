import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/find", label: "Find People" },
  { to: "/team", label: "Team Builder" }
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-1.5 w-1.5 rounded-full bg-violet-bright" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-amber" style={{ transform: "translate(6px,-5px)" }} />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-live" style={{ transform: "translate(-6px,5px)" }} />
          </span>
          CONVERGE
        </NavLink>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-surface-2 text-text"
                    : "text-text-muted hover:text-text hover:bg-surface"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
