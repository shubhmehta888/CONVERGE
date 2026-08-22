import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Chats() {
  const [requests, setRequests] = useState(() => JSON.parse(localStorage.getItem("converge-requests") || "[]"));
  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState(requests[0]?.profileId || null);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem("converge-messages") || "{}"));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    api.listProfiles(40).then((data) => {
      setProfiles(data.profiles);
      return api.listConnections().then((connectionData) => connectionData.connections.map((item) => {
        const profile = data.profiles.find((candidate) => candidate.id === item.toProfileId);
        return profile ? { profileId: profile.id, name: profile.name, initials: profile.initials, role: profile.role, note: item.note } : null;
      }).filter(Boolean));
    }).then((remoteRequests) => {
      if (remoteRequests.length) { setRequests(remoteRequests); setSelectedId(remoteRequests[0].profileId); }
    }).catch(() => {});
  }, []);
  const selected = requests.find((request) => request.profileId === selectedId);
  const thread = messages[selectedId] || (selected ? [{ from: "them", text: selected.note }] : []);

  function sendMessage(event) {
    event.preventDefault();
    if (!draft.trim() || !selectedId) return;
    const text = draft.trim();
    const next = { ...messages, [selectedId]: [...thread, { from: "you", text }] };
    setMessages(next); localStorage.setItem("converge-messages", JSON.stringify(next)); setDraft("");
    if (localStorage.getItem("converge-token")) api.sendMessage(selectedId, text).catch(() => {});
  }
  function removeChat(id) {
    const next = requests.filter((request) => request.profileId !== id);
    setRequests(next); localStorage.setItem("converge-requests", JSON.stringify(next));
    setSelectedId(next[0]?.profileId || null);
  }

  return <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><span className="mono-label text-[11px] text-amber">Your corner of campus</span><h1 className="mt-3 font-display text-4xl font-semibold">Chats</h1><p className="mt-3 text-text-muted">Connection requests become conversations here.</p></div><Link to="/discover" className="text-sm text-violet-bright hover:text-text">Find more people →</Link></div><div className="mt-10 grid min-h-[440px] overflow-hidden rounded-2xl border border-edge bg-surface/40 md:grid-cols-[280px_1fr]"> <aside className="border-b border-edge md:border-b-0 md:border-r md:border-edge"><div className="border-b border-edge px-5 py-4"><span className="mono-label text-[10px] text-text-faint">Inbox · {requests.length}</span></div>{requests.length === 0 && <p className="p-5 text-sm leading-relaxed text-text-muted">Your inbox is quiet. Send a note from Discover and start something useful.</p>}{requests.map((request) => <button key={request.profileId} onClick={() => setSelectedId(request.profileId)} className={`flex w-full items-center gap-3 border-b border-edge p-4 text-left ${selectedId === request.profileId ? "bg-violet/10" : "hover:bg-surface"}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold text-amber">{request.initials}</span><span className="min-w-0"><strong className="block truncate text-sm font-medium">{request.name}</strong><span className="block truncate text-xs text-text-faint">{request.role}</span></span></button>)}</aside><section className="flex min-h-[440px] flex-col">{selected ? <><header className="flex items-center justify-between border-b border-edge px-5 py-4"><div><h2 className="font-display text-lg font-semibold">{selected.name}</h2><p className="text-xs text-text-faint">{selected.role} · Scaler School of Technology</p></div><button onClick={() => removeChat(selected.profileId)} className="text-xs text-text-faint hover:text-amber">Remove chat</button></header><div className="flex-1 space-y-3 overflow-y-auto p-5">{thread.map((message, index) => <div key={`${message.text}-${index}`} className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.from === "you" ? "ml-auto bg-violet text-white" : "bg-surface-2 text-text-muted"}`}>{message.text}</div>)}<p className="pt-3 text-center text-xs text-text-faint">Be specific: suggest a place, time, or shared interest.</p></div><form onSubmit={sendMessage} className="flex gap-2 border-t border-edge p-4"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." className="min-w-0 flex-1 rounded-xl border border-edge bg-ink/40 px-4 py-2.5 text-sm placeholder:text-text-faint focus:border-violet/60" /><button className="rounded-xl bg-violet px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-bright">Send</button></form></> : <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><p className="font-display text-2xl font-semibold">No conversations yet</p><p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">A good first message is already waiting in Discover.</p><Link to="/discover" className="mt-5 rounded-full bg-violet px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-bright">Discover people</Link></div>}</section></div>{profiles.length > 0 && <p className="mt-4 text-xs text-text-faint">Requests stay in this browser for the demo. A production version can connect this inbox to authenticated campus accounts.</p>}</div>;
}
