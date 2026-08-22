import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard.jsx";
import { api } from "../api.js";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { api.listProfiles(40).then((data) => setProfile(data.profiles.find((item) => item.id === id))).catch((err) => setError(err.message)); }, [id]);
  if (error) return <div className="mx-auto max-w-3xl px-6 py-16 text-amber">Couldn&apos;t load this profile.</div>;
  if (!profile) return <div className="mx-auto max-w-3xl px-6 py-16 text-text-muted">Finding this person...</div>;
  return <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16"><Link to="/discover" className="text-sm text-violet-bright hover:text-text">← Back to discover</Link><div className="mt-8 grid gap-8 md:grid-cols-[280px_1fr]"><ProfileCard profile={profile} index={1} /><section><span className="mono-label text-[11px] text-amber">{profile.role}</span><h1 className="mt-2 font-display text-4xl font-semibold">{profile.name}</h1><p className="mt-4 text-lg leading-relaxed text-text-muted">{profile.bio}</p><div className="mt-8"><h2 className="font-display text-xl font-semibold">What they bring</h2><div className="mt-4 flex flex-wrap gap-2">{profile.skills.map((skill) => <span key={skill} className="rounded-full border border-edge bg-surface/60 px-3 py-1.5 text-sm text-text-muted">{skill}</span>)}</div></div><div className="mt-8 rounded-2xl border border-amber/30 bg-amber/10 p-5"><span className="mono-label text-[10px] text-amber">Make the first move</span><p className="mt-2 text-sm leading-relaxed text-text-muted">You both care about making campus life more connected. Send a clear reason to meet.</p><button onClick={() => alert(`Connection note started for ${profile.name}.`)} className="mt-4 rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-ink">Start a connection</button></div></section></div></div>;
}
