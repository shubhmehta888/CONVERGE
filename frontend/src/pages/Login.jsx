import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = mode === "signup" ? await api.register(name, email, password) : await api.login(email, password);
      localStorage.setItem("converge-token", result.token);
      localStorage.setItem("converge-user", JSON.stringify(result.user));
      window.dispatchEvent(new Event("converge-auth-change"));
      navigate("/discover");
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }

  return <div className="mx-auto grid min-h-[calc(100vh-170px)] max-w-5xl items-center gap-12 px-6 py-12 lg:grid-cols-[1fr_420px]"><section><span className="mono-label text-[11px] text-amber">Your campus, your people</span><h1 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">Make space for better connections.</h1><p className="mt-6 max-w-lg text-base leading-relaxed text-text-muted">Create your verified Scaler account and find people to learn with, build with, move with, and grow alongside.</p><div className="mt-8 flex flex-wrap gap-2 text-xs text-text-muted"><span className="rounded-full border border-edge bg-surface/70 px-3 py-2">✓ Password protected</span><span className="rounded-full border border-edge bg-surface/70 px-3 py-2">✓ Campus identity badge</span></div></section><form onSubmit={submit} className="rounded-2xl border border-violet/30 bg-surface/80 p-6 shadow-2xl shadow-ink/20 sm:p-8"><div className="flex rounded-xl border border-edge bg-ink/40 p-1"><button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-lg py-2 text-sm font-medium ${mode === "login" ? "bg-surface-2 text-text" : "text-text-muted"}`}>Log in</button><button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-lg py-2 text-sm font-medium ${mode === "signup" ? "bg-surface-2 text-text" : "text-text-muted"}`}>Create account</button></div><h2 className="mt-7 font-display text-2xl font-semibold">{mode === "signup" ? "Join the campus" : "Welcome back"}</h2><p className="mt-2 text-sm leading-relaxed text-text-muted">{mode === "signup" ? "Use your campus details to make your profile real." : "Log in to see your conversations and connection history."}</p>{mode === "signup" && <label className="mt-6 block text-xs font-medium text-text-muted">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-edge bg-ink/50 px-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-violet" placeholder="e.g. Shubh Mehta" /></label>}<label className="mt-6 block text-xs font-medium text-text-muted">Campus email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-edge bg-ink/50 px-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-violet" placeholder="you@scaler.com" /></label><label className="mt-4 block text-xs font-medium text-text-muted">Password<input type="password" required minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-edge bg-ink/50 px-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-violet" placeholder="At least 8 characters" /></label>{error && <p className="mt-4 text-sm text-amber">{error}</p>}<button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-violet py-3 text-sm font-semibold text-ink transition-colors hover:bg-violet-bright disabled:opacity-50">{loading ? "Working..." : mode === "signup" ? "Create my account" : "Log in securely"}</button><p className="mt-4 text-center text-[11px] leading-relaxed text-text-faint">Passwords are hashed on the server. Scaler emails receive a verified campus badge.</p></form></div>;
}
