import { useState } from "react";
import { api } from "../api.js";

const DEFAULT_PROJECT =
  "A smart campus marketplace where students resell textbooks. It recommends listings using an AI model and needs to work on mobile and web for a 36-hour hackathon.";

const DEFAULT_TEAM = [
  { id: "you", name: "You (Shubh)", skills: ["Node.js", "Express", "PostgreSQL"] },
  { id: "rhea-malhotra", name: "Rhea Malhotra", skills: ["Python", "SQL", "Pandas"] }
];

export default function Team() {
  const [projectDescription, setProjectDescription] = useState(DEFAULT_PROJECT);
  const [team, setTeam] = useState(DEFAULT_TEAM);
  const [newName, setNewName] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function addMember(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setTeam((t) => [
      ...t,
      {
        id: newName.trim().toLowerCase().replace(/\s+/g, "-"),
        name: newName.trim(),
        skills: newSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      }
    ]);
    setNewName("");
    setNewSkills("");
  }

  function removeMember(id) {
    setTeam((t) => t.filter((m) => m.id !== id));
  }

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeTeam(projectDescription, team);
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <span className="mono-label text-[11px] text-amber">Flow 02</span>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Team Builder</h1>
      <p className="mt-3 text-text-muted">
        Describe the project, list who's in, and Converge finds the person who completes the team.
      </p>

      <div className="mt-8">
        <label className="mono-label text-[11px] text-text-faint">Project description</label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          rows={4}
          className="mt-2 w-full resize-none rounded-2xl border border-edge bg-surface/60 p-4 text-sm text-text focus:border-violet/60"
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <label className="mono-label text-[11px] text-text-faint">Current team</label>
          <span className="text-xs text-text-faint">{team.length} members</span>
        </div>

        <div className="mt-3 space-y-2">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-edge bg-surface/60 p-3"
            >
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-text-muted">{member.skills.join(", ") || "No skills listed"}</p>
              </div>
              <button
                onClick={() => removeMember(member.id)}
                className="text-xs text-text-faint hover:text-amber"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={addMember} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="flex-1 rounded-xl border border-edge bg-surface/60 px-3 py-2 text-sm placeholder:text-text-faint focus:border-violet/60"
          />
          <input
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
            placeholder="Skills, comma separated"
            className="flex-1 rounded-xl border border-edge bg-surface/60 px-3 py-2 text-sm placeholder:text-text-faint focus:border-violet/60"
          />
          <button
            type="submit"
            className="rounded-xl border border-edge px-4 py-2 text-sm font-medium text-text-muted hover:border-violet/40 hover:text-text"
          >
            + Add member
          </button>
        </form>
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading}
        className="mt-8 w-full rounded-full bg-violet py-3 text-sm font-medium text-white transition-colors hover:bg-violet-bright disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {loading ? "Analyzing…" : "Analyze team"}
      </button>

      {error && (
        <p className="mt-8 rounded-xl border border-edge bg-surface/60 p-4 text-sm text-amber">
          Couldn't reach the Converge API ({error}). Make sure the backend is running on port 4000.
        </p>
      )}

      {analysis && !error && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-edge bg-surface/60 p-5">
            <h3 className="mono-label text-[11px] text-live">Strengths</h3>
            <p className="mt-2 text-sm text-text-muted">
              {analysis.strengths.length ? analysis.strengths.join(", ") : "No clear category coverage detected yet."}
            </p>
          </div>

          <div className="rounded-2xl border border-edge bg-surface/60 p-5">
            <h3 className="mono-label text-[11px] text-amber">Gaps</h3>
            <p className="mt-2 text-sm text-text-muted">
              {analysis.gaps.length ? analysis.gaps.join(", ") : "No gaps detected against the project description."}
            </p>
          </div>

          {analysis.recommendation && (
            <div className="rounded-2xl border border-violet/40 bg-violet/10 p-5">
              <h3 className="mono-label text-[11px] text-violet-bright">Recommended addition</h3>
              <p className="mt-2 font-display text-lg font-semibold">
                {analysis.recommendation.profile.name}
              </p>
              <p className="text-xs text-text-faint">{analysis.recommendation.profile.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {analysis.recommendation.reason}
              </p>
              <button className="mt-4 rounded-full bg-violet px-5 py-2 text-sm font-medium text-white hover:bg-violet-bright">
                Invite {analysis.recommendation.profile.name.split(" ")[0]}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
