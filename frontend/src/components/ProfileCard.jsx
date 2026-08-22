import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const initialColors = [
  "bg-violet/20 text-violet-bright",
  "bg-amber/20 text-amber",
  "bg-live/20 text-live"
];

export default function ProfileCard({ profile, whyMatched, index = 0, variant = "default" }) {
  const colorClass = initialColors[index % initialColors.length];
  const cardColors = ["border-violet/35 bg-surface/90", "border-amber/35 bg-surface/90", "border-live/35 bg-surface/90", "border-[#4B91B8]/35 bg-surface/90"];
  const matchColors = ["bg-violet/10", "bg-amber/10", "bg-live/10", "bg-[#4B91B8]/10"];
  const [request, setRequest] = useState(() => JSON.parse(localStorage.getItem("converge-requests") || "[]").find((item) => item.profileId === profile.id));
  const [note, setNote] = useState(`Hey ${profile.name.split(" ")[0]}, I think we could be a great match. Want to connect on campus?`);
  const [composerOpen, setComposerOpen] = useState(false);
  const [requestError, setRequestError] = useState("");
  const navigate = useNavigate();

  async function sendRequest(event) {
    event.preventDefault();
    if (!localStorage.getItem("converge-token")) { setComposerOpen(false); navigate("/login"); return; }
    try { await api.createConnection(profile.id, note); } catch (error) { setRequestError(error.message); return; }
    const requests = JSON.parse(localStorage.getItem("converge-requests") || "[]").filter((item) => item.profileId !== profile.id);
    const next = { profileId: profile.id, name: profile.name, initials: profile.initials, role: profile.role, note, sentAt: new Date().toISOString() };
    localStorage.setItem("converge-requests", JSON.stringify([...requests, next]));
    setRequest(next);
    setComposerOpen(false);
  }

  return (
    <div className={`group relative overflow-hidden rounded-2xl border p-5 pt-7 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/20 ${variant === "match" ? `${cardColors[index % cardColors.length]} hover:border-violet/60` : `${cardColors[index % cardColors.length]}`}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${["bg-violet", "bg-amber", "bg-live", "bg-[#4B91B8]"][index % 4]}`} />
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 font-display text-sm font-semibold shadow-inner ${colorClass}`}>
          {profile.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Link to={`/profile/${profile.id}`} className="truncate font-display text-lg font-semibold transition-colors hover:text-violet-bright">{profile.name}</Link>
          </div>
          <p className="mono-label text-[11px] text-text-faint">{profile.role}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-text-muted">{profile.bio}</p>

      <p className="mt-3 text-xs font-medium text-violet-bright">A thoughtful match for your campus rhythm.</p>

      {profile.skills?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-edge px-2 py-0.5 text-[11px] text-text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-1.5 text-xs text-live">
        <span className="h-1.5 w-1.5 rounded-full bg-live" />
        <span className="text-text-muted">{profile.availability}</span>
      </div>

      {whyMatched ? (
        <p className={`mt-3 rounded-xl px-3 py-2 text-xs leading-relaxed text-violet-bright ${variant === "match" ? matchColors[index % matchColors.length] : "bg-violet/10"}`}>
          {whyMatched}
        </p>
      ) : null}

      {request ? (
        <Link to="/chats" className="mt-4 block w-full rounded-full bg-live/15 py-2 text-center text-sm font-medium text-live transition-colors hover:bg-live/20">
          Request sent · open chat
        </Link>
      ) : (
        <button onClick={() => setComposerOpen(true)} className="mt-4 w-full rounded-full bg-surface-2 py-2 text-sm font-medium text-text transition-colors hover:bg-violet hover:text-white">
          Connect with a note
        </button>
      )}
      {requestError && <p className="mt-2 text-xs text-amber">{requestError}</p>}

      {composerOpen && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#182B25]/35 p-4 backdrop-blur-sm sm:items-center"><form onSubmit={sendRequest} className="w-full max-w-md rounded-2xl border border-edge bg-surface p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><span className="mono-label text-[10px] text-amber">New connection</span><h4 className="mt-1 font-display text-xl font-semibold">Say hello to {profile.name.split(" ")[0]}</h4></div><button type="button" onClick={() => setComposerOpen(false)} className="text-xl text-text-faint hover:text-text" aria-label="Close">×</button></div><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-5 w-full resize-none rounded-xl border border-edge bg-ink/40 p-3 text-sm leading-relaxed text-text placeholder:text-text-faint focus:border-violet/60" /><p className="mt-2 text-xs text-text-faint">Your note will appear in Chats as a new conversation.</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setComposerOpen(false)} className="rounded-full border border-edge px-4 py-2 text-sm text-text-muted hover:text-text">Cancel</button><button type="submit" disabled={!note.trim()} className="rounded-full bg-violet px-5 py-2 text-sm font-medium text-white hover:bg-violet-bright disabled:opacity-50">Send request</button></div></form></div>}
    </div>
  );
}
