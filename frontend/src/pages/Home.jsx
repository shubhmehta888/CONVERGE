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
            Live on campus tonight
          </span>

          <h1 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Find the right person{" "}
            <span className="text-violet-bright">before the idea goes cold.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
            Describe what you need in plain English. Converge reads the intent, the skills and the
            availability — then explains exactly why each person fits.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/find"
              className="rounded-full bg-violet px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-bright"
            >
              Find people
            </Link>
            <Link
              to="/team"
              className="rounded-full border border-edge px-6 py-3 text-sm font-medium text-text transition-colors hover:border-violet/50 hover:bg-surface"
            >
              Build a team
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
              Active builders right now
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              A slice of the network — free tonight and looking for teams.
            </p>
          </div>
          <Link
            to="/find"
            className="hidden shrink-0 text-sm font-medium text-violet-bright hover:text-violet-bright/80 sm:block"
          >
            Search all →
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
            <p className="rounded-xl border border-edge bg-surface/60 p-4 text-sm text-amber">
              Couldn't reach the Converge API ({error}). Make sure the backend is running on port 4000.
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

      {/* Flows */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FlowCard
            eyebrow="Flow 01"
            title="Find People"
            description={
              <>
                “I need a React developer for my hackathon tonight.” → parsed intent → ranked
                matches → why you matched → connect.
              </>
            }
            to="/find"
          />
          <FlowCard
            eyebrow="Flow 02"
            title="Team Builder"
            description="Describe the project, list your team, analyze strengths and gaps, then find the missing piece and invite them."
            to="/team"
          />
        </div>
      </section>
    </div>
  );
}

function FlowCard({ eyebrow, title, description, to }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between rounded-2xl border border-edge bg-surface/60 p-7 transition-colors hover:border-violet/40 hover:bg-surface"
    >
      <div>
        <span className="mono-label text-[11px] text-amber">{eyebrow}</span>
        <h3 className="mt-2 font-display text-xl font-semibold">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-violet-bright">
        Run the flow
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
