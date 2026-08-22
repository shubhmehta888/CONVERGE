import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api.js";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/discover", label: "Match & Vibe" },
  { to: "/campus-live", label: "Campus Live" },
  { to: "/chats", label: "Chats" }
];

const moreLinks = [
  { to: "/circles", label: "SST Circles" },
  { to: "/team", label: "Squad Builder" },
  { to: "/find", label: "Search & Need" },
  { to: "/vibe", label: "My Vibe & Pod" },
  { to: "/events", label: "Campus events" }
];

export default function Nav() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("converge-user") || "null"));
  const [accountOpen, setAccountOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  useEffect(() => {
    function refreshUser() {
      setUser(JSON.parse(localStorage.getItem("converge-user") || "null"));
    }
    window.addEventListener("converge-auth-change", refreshUser);
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("converge-auth-change", refreshUser);
      window.removeEventListener("storage", refreshUser);
    };
  }, []);
  function logout() {
    api.logout().catch(() => {});
    localStorage.removeItem("converge-token");
    localStorage.removeItem("converge-user");
    setUser(null);
    setAccountOpen(false);
    navigate("/");
  }
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <NavLink to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-1.5 w-1.5 rounded-full bg-violet-bright" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-amber" style={{ transform: "translate(6px,-5px)" }} />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-live" style={{ transform: "translate(-6px,5px)" }} />
          </span>
          CONVERGE
        </NavLink>
        <nav className="flex max-w-[calc(100vw-160px)] items-center gap-1 overflow-visible">
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
          <div className="relative"><button onClick={() => setMoreOpen(!moreOpen)} className="rounded-full px-3 py-2 text-sm font-medium text-text-muted hover:bg-surface hover:text-text">More <span className="text-xs">⌄</span></button>{moreOpen && <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-edge bg-surface p-2 shadow-2xl">{moreLinks.map((link) => <NavLink key={link.to} to={link.to} onClick={() => setMoreOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-surface-2 hover:text-text">{link.label}</NavLink>)}</div>}</div>
          {user ? (
            <div className="relative ml-2">
              <button onClick={() => setAccountOpen(!accountOpen)} title="Open account menu" className="flex items-center gap-2 rounded-full border border-live/30 bg-live/10 px-3 py-2 text-xs font-medium text-live">
                <span className="h-2 w-2 rounded-full bg-live" />
                {user.name.split(" ")[0]}{user.verified ? " · verified" : ""}<span className="text-[10px]">⌄</span>
              </button>
              {accountOpen && <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-edge bg-surface p-2 shadow-2xl"><p className="border-b border-edge px-3 pb-2 text-xs text-text-faint">{user.email}</p><button onClick={logout} className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-amber hover:bg-amber/10">Log out</button></div>}
            </div>
          ) : (
            <Link to="/login" className="ml-2 rounded-full bg-violet px-4 py-2 text-sm font-semibold text-ink hover:bg-violet-bright">Log in</Link>
          )}
          <div className="relative ml-1"><button onClick={() => setNotificationsOpen(!notificationsOpen)} title="Notifications" aria-label="Notifications" className="relative rounded-lg p-2 text-base text-text-muted hover:bg-surface hover:text-text">🔔<span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber" /></button>{notificationsOpen && <div className="absolute right-0 top-11 z-50 w-64 rounded-xl border border-edge bg-surface p-4 shadow-2xl"><p className="mono-label text-[10px] text-violet-bright">Notifications</p><p className="mt-3 text-sm text-text-muted">Your campus feed is ready. New people are looking for a study partner and a sports buddy.</p></div>}</div>
        </nav>
      </div>
    </header>
  );
}
