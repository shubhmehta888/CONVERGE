import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConvergeBackground from "../components/ConvergeBackground.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import StatBar from "../components/StatBar.jsx";
import { api } from "../api.js";

const STATS = [
  { value: "12,400+", label: "Student profiles" },
  { value: "38s", label: "Median time to a match" },
  { value: "91%", label: "Accepted connect requests" }
];

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .listProfiles(5)
      .then((data) => {
        if (!cancelled) setProfiles(data.profiles);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <ConvergeBackground className="top-[-40px]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
          <span className="mono-label inline-flex items-center gap-2 rounded-full border border-edge px-3 py-1 text-[11px] text-live">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            Scaler School of Technology · student network
          </span>

          <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Your next chapter starts{" "}
            <span className="text-violet-bright">with the right people around you.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            Find the people who make you think bigger, stay consistent, and enjoy the process. Build,
            study, play, create, and grow together at SST.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/find"
              className="rounded-full bg-violet px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-bright"
            >
              Explore your matches
            </Link>
            <Link
              to="/campus-live"
              className="rounded-full border border-edge px-6 py-3 text-sm font-medium text-text transition-colors hover:border-violet/50 hover:bg-surface"
            >
              See what&apos;s happening
            </Link>
          </div>

          <div className="mt-14">
            <StatBar stats={STATS} />
          </div>
        </div>
      </section>

      {/* Active builders */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Choose your next move
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Start with the kind of day you want to have. Converge will take you to the people and
              places that fit.
            </p>
          </div>
          <Link
            to="/find"
            className="hidden shrink-0 text-sm font-medium text-violet-bright hover:text-violet-bright/80 sm:block"
          >
            Browse everyone →
          </Link>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl border border-edge bg-surface/50" />
              ))}
            </div>
          )}
          {error && (
            <p className="rounded-xl border border-edge bg-surface/60 p-4 text-sm text-text-muted">
              Live profiles aren't available right now — check back shortly.
            </p>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, i) => (
                <ProfileCard key={profile.id} profile={profile} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Campus pulse */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="border-y border-edge py-12 sm:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><span className="mono-label text-[11px] text-amber">The campus pulse</span><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">Different energy. Same campus.</h2></div>
            <p className="max-w-sm text-sm leading-relaxed text-text-muted">Your next good conversation can start with a pitch, a problem set, or a plan to get outside.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PulseCard tone="coral" mark="01" title="Build something" detail="Find a teammate or idea partner" to="/find" />
            <PulseCard tone="mint" mark="02" title="Learn together" detail="Find a study rhythm that sticks" to="/discover" />
            <PulseCard tone="gold" mark="03" title="Get moving" detail="Join a game, walk, or workout" to="/campus-live" />
            <PulseCard tone="sky" mark="04" title="Make it social" detail="Find a circle and show up" to="/circles" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl bg-violet p-6 text-white sm:p-8"><span className="mono-label text-[10px] text-white/70">Quick match</span><h3 className="mt-3 max-w-md font-display text-2xl font-semibold sm:text-3xl">What kind of connection are you looking for today?</h3><div className="mt-6 flex flex-wrap gap-2"><QuickLink to="/discover" label="A study partner" /><QuickLink to="/discover" label="A sports buddy" /><QuickLink to="/discover" label="A fresh idea" /></div></div>
            <div className="rounded-2xl border border-edge bg-surface/70 p-6 sm:p-8"><span className="mono-label text-[10px] text-live">Start with a small yes</span><h3 className="mt-3 font-display text-xl font-semibold">A good connection does not need a big introduction.</h3><p className="mt-4 text-sm leading-relaxed text-text-muted">Pick one thing you already enjoy, show up for it, and let the right people find you there.</p><div className="mt-6 grid grid-cols-2 gap-2"><Link to="/campus-live" className="rounded-xl border border-edge bg-surface-2/60 px-3 py-3 text-xs font-medium text-text hover:border-violet/50">Join a live spot <span className="block pt-1 text-text-faint">Meet in person →</span></Link><Link to="/circles" className="rounded-xl border border-edge bg-surface-2/60 px-3 py-3 text-xs font-medium text-text hover:border-violet/50">Find your circle <span className="block pt-1 text-text-faint">Keep showing up →</span></Link></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PulseCard({ tone, mark, title, detail, to }) {
  const tones = { coral: "border-amber/50 bg-amber/10 text-amber", mint: "border-violet/40 bg-violet/10 text-violet-bright", gold: "border-[#D4A62A]/40 bg-[#D4A62A]/10 text-[#9A7514]", sky: "border-[#4B91B8]/40 bg-[#4B91B8]/10 text-[#326F91]" };
  return (
    <Link to={to} className={`group flex min-h-36 flex-col justify-between rounded-2xl border p-5 transition-transform hover:-translate-y-1 ${tones[tone]}`}><span className="flex items-center justify-between text-xs"><span className="mono-label text-[10px] opacity-70">{mark}</span><span className="text-lg transition-transform group-hover:rotate-12">↗</span></span><span><strong className="block font-display text-xl font-semibold text-text">{title}</strong><span className="mt-1 block text-xs text-text-muted">{detail}</span></span></Link>
  );
}

function QuickLink({ to, label }) { return <Link to={to} className="rounded-full bg-white/20 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/30">{label} <span className="ml-1">→</span></Link>; }

function PulseRow({ dot, label, value }) { return <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-text"><span className={`h-2 w-2 rounded-full ${dot}`} />{label}</span><span className="text-right text-xs text-text-faint">{value}</span></div>; }
