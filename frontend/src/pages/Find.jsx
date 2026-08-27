import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard.jsx";
import { api } from "../api.js";

const EXAMPLES = [
  "I need a React developer for my hackathon tonight.",
  "Looking for a UI/UX designer this week for a startup pitch.",
  "Need someone who knows LLMs and RAG for a weekend project.",
  "Want a backend dev for APIs and Postgres tonight."
];

export default function Find() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(EXAMPLES[0]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const preset = searchParams.get("query");
    if (preset) setQuery(preset);
  }, [searchParams]);

  async function runSearch(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.search(query, 6);
      setResults(data.results);
      setMeta({ usedAI: data.usedAI, fallback: data.fallback, intent: data.intent });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="mono-label text-[11px] text-amber">Flow 01</span>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Find People</h1>
      <p className="mt-3 text-text-muted">Say it like you'd say it to a friend. Converge handles the rest.</p>

      <form onSubmit={runSearch} className="mt-8">
        <label htmlFor="query" className="sr-only">
          Describe who you need
        </label>
        <textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          placeholder="I need a React developer for my hackathon tonight."
          className="w-full resize-none rounded-2xl border border-edge bg-surface/60 p-4 text-base text-text placeholder:text-text-faint focus:border-violet/60"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              type="button"
              key={ex}
              onClick={() => setQuery(ex)}
              className={`rounded-full border px-3 py-1.5 text-left text-xs transition-colors ${
                query === ex
                  ? "border-violet/60 bg-violet/10 text-violet-bright"
                  : "border-edge text-text-muted hover:border-violet/40 hover:text-text"
              }`}
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-violet py-3 text-sm font-medium text-white transition-colors hover:bg-violet-bright disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {loading ? "Finding matches…" : "Find matches"}
        </button>
      </form>

      {error && (
        <p className="mt-8 rounded-xl border border-edge bg-surface/60 p-4 text-sm text-text-muted">
          Search isn't available right now — check back shortly.
        </p>
      )}

      {meta && !error && (
        <p className="mt-8 text-xs text-text-faint">
          Parsed via {meta.usedAI ? "Claude" : "keyword parser"}
          {meta.intent
            ? ` · skills: ${meta.intent.skills.join(", ") || "none"} · roles: ${
                meta.intent.roles.join(", ") || "none"
              } · availability: ${meta.intent.availability.join(", ") || "none"}`
            : ""}
        </p>
      )}

      {results && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {results.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              whyMatched={profile.whyMatched}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
