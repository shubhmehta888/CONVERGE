import { useEffect, useMemo, useState } from "react";
import ProfileCard from "../components/ProfileCard.jsx";
import { api } from "../api.js";

const CATEGORIES = [
  { id: "all", label: "Everyone", emoji: "✦", prompt: "Find my best all-round matches at Scaler School of Technology." },
  { id: "sports", label: "Sports & fitness", emoji: "◌", prompt: "Find people into sports, fitness, running, or gym." },
  { id: "study", label: "Study partners", emoji: "▤", prompt: "Find a study buddy for mathematics, physics, or deep work." },
  { id: "culture", label: "Culture & hobbies", emoji: "♪", prompt: "Find people into music, photography, books, dance, or gaming." },
  { id: "mindset", label: "Mindset & growth", emoji: "↗", prompt: "Find people with a growth mindset who value accountability." },
  { id: "build", label: "Build together", emoji: "⌘", prompt: "Find someone for a startup, project, or hackathon." }
];

export default function Discover() {
  const [profiles, setProfiles] = useState([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listProfiles(40).then((data) => setProfiles(data.profiles)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const selected = CATEGORIES.find((item) => item.id === category);
  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return profiles.filter((profile) => {
      const inCategory = category === "all" || profile.tags.includes(category) || (category === "build" && ["frontend", "backend", "ml", "design", "growth", "data", "infra", "mobile"].some((tag) => profile.tags.includes(tag)));
      const searchable = `${profile.name} ${profile.role} ${profile.bio} ${profile.skills.join(" ")}`.toLowerCase();
      return inCategory && (!needle || searchable.includes(needle));
    });
  }, [profiles, category, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="max-w-3xl">
        <span className="mono-label text-[11px] text-amber">Campus matchboard · SST only</span>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">Find your kind of people.</h1>
        <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">The right person might be at the next desk, the next turf, or the next library table. Start with one shared interest and let the conversation grow.</p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((item) => (
          <button key={item.id} onClick={() => setCategory(item.id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${category === item.id ? "border-amber/70 bg-amber/10" : "border-edge bg-surface/50 hover:border-violet/50"}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 text-lg text-amber">{item.emoji}</span>
            <span><strong className="block text-sm font-medium">{item.label}</strong><span className="text-xs text-text-faint">{item.id === "all" ? "See the whole campus" : "Meet beyond your usual circle"}</span></span>
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-edge py-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-medium">{selected?.label}</p><p className="text-xs text-text-faint">{filtered.length} people in your orbit</p></div>
        <div className="flex w-full max-w-md gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills, interests, names..." className="min-w-0 flex-1 rounded-xl border border-edge bg-surface/60 px-4 py-2.5 text-sm placeholder:text-text-faint focus:border-violet/60" />
          <button onClick={() => setQuery("")} className="rounded-xl border border-edge px-4 text-sm text-text-muted hover:border-violet/50 hover:text-text">Clear</button>
        </div>
      </div>

      {loading && <p className="py-12 text-sm text-text-muted">Loading the campus network...</p>}
      {error && <p className="mt-8 rounded-xl border border-edge bg-surface/60 p-4 text-sm text-text-muted">Profiles aren&apos;t available right now — check back shortly.</p>}
      {!loading && !error && filtered.length === 0 && <div className="py-16 text-center"><p className="font-display text-xl font-semibold">No exact match yet.</p><p className="mt-2 text-sm text-text-muted">Try another interest or clear the search.</p></div>}
      {!loading && !error && filtered.length > 0 && <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((profile, index) => <ProfileCard key={profile.id} profile={profile} index={index} variant="match" />)}</div>}

      {selected && selected.id !== "all" && <div className="mt-12 rounded-2xl border border-violet/30 bg-violet/10 p-5 sm:flex sm:items-center sm:justify-between"><div><span className="mono-label text-[10px] text-violet-bright">Try a natural search</span><p className="mt-2 text-sm text-text-muted">{selected.prompt}</p></div><a href={`/find?query=${encodeURIComponent(selected.prompt)}`} className="mt-4 inline-flex rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-bright sm:mt-0">Ask Converge</a></div>}
    </div>
  );
}
