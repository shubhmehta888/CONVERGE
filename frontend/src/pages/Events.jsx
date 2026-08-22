import { useState } from "react";

const EVENTS = [
  { id: "turf", day: "24", month: "AUG", title: "Sunset turf + chai", type: "Sports", place: "SST turf · 6:30 PM", people: 14, color: "amber" },
  { id: "focus", day: "26", month: "AUG", title: "Deep work dinner", type: "Study", place: "Library commons · 7:00 PM", people: 9, color: "violet" },
  { id: "openmic", day: "29", month: "AUG", title: "Open mic: unfinished ideas", type: "Culture", place: "The amphitheatre · 8:00 PM", people: 22, color: "live" }
];

const COLOR_CLASSES = {
  amber: "bg-amber/15 text-amber",
  violet: "bg-violet/15 text-violet-bright",
  live: "bg-live/15 text-live"
};

export default function Events() {
  const [joined, setJoined] = useState(() => JSON.parse(localStorage.getItem("converge-events") || "[]"));
  function toggle(id) { const next = joined.includes(id) ? joined.filter((item) => item !== id) : [...joined, id]; setJoined(next); localStorage.setItem("converge-events", JSON.stringify(next)); }
  return <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16"><span className="mono-label text-[11px] text-amber">Campus calendar · live</span><div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="font-display text-4xl font-semibold">Things worth showing up for.</h1><p className="mt-3 max-w-xl text-text-muted">Low-pressure ways to meet people at Scaler School of Technology offline.</p></div><span className="rounded-full border border-live/30 bg-live/10 px-3 py-1.5 text-xs text-live">{joined.length} on your calendar</span></div><div className="mt-10 space-y-4">{EVENTS.map((event) => { const isJoined = joined.includes(event.id); return <article key={event.id} className="grid gap-5 rounded-2xl border border-edge bg-surface/50 p-5 sm:grid-cols-[72px_1fr_auto] sm:items-center"><div className={`flex h-[72px] w-[72px] flex-col items-center justify-center rounded-xl ${COLOR_CLASSES[event.color]}`}><strong className="font-display text-2xl">{event.day}</strong><span className="mono-label text-[10px]">{event.month}</span></div><div><div className="flex flex-wrap items-center gap-2"><span className="mono-label text-[10px] text-text-faint">{event.type}</span><span className="h-1 w-1 rounded-full bg-text-faint"/><span className="text-xs text-text-muted">{event.people + (isJoined ? 1 : 0)} going</span></div><h2 className="mt-1 font-display text-xl font-semibold">{event.title}</h2><p className="mt-1 text-sm text-text-muted">{event.place}</p></div><button onClick={() => toggle(event.id)} className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${isJoined ? "border border-live/40 bg-live/10 text-live" : "bg-violet text-white hover:bg-violet-bright"}`}>{isJoined ? "You're going" : "Join event"}</button></article>; })}</div><div className="mt-12 border-t border-edge pt-8"><h2 className="font-display text-2xl font-semibold">Bring your people</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">Create a small plan around a shared interest, then invite the people you meet on Converge. The best matches usually start with a reason to be in the same room.</p><button onClick={() => alert("Event creation is coming next. For now, share an idea in the campus Discord.")} className="mt-5 rounded-full border border-edge px-5 py-2.5 text-sm font-medium text-text hover:border-violet/50">Suggest an event</button></div></div>;
}
