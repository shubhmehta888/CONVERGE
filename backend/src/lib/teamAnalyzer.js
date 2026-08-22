import { profiles } from "../data/profiles.js";

// Skill categories every project draws from. Each maps to keywords used to
// (a) detect what a project's description needs, and (b) detect what a
// given set of skills already covers.
const CATEGORIES = {
  frontend: {
    label: "Frontend / UI engineering",
    projectKeywords: ["web", "frontend", "ui", "interface", "app", "mobile"],
    skillKeywords: ["react", "vue", "typescript", "css", "next.js", "tailwind", "frontend"]
  },
  backend: {
    label: "Backend / APIs",
    projectKeywords: ["api", "backend", "server", "marketplace", "platform", "database"],
    skillKeywords: ["node", "express", "postgres", "sql", "go", "kafka", "redis", "api"]
  },
  mobile: {
    label: "Mobile development",
    projectKeywords: ["mobile", "ios", "android", "app"],
    skillKeywords: ["react native", "swift", "mobile"]
  },
  ml: {
    label: "AI / ML engineering",
    projectKeywords: ["ai", "ml", "model", "recommend", "llm", "rag", "predict", "smart"],
    skillKeywords: ["llm", "rag", "pytorch", "python", "langchain", "machine learning", "ml"]
  },
  design: {
    label: "Product design",
    projectKeywords: ["design", "ux", "brand", "pitch deck"],
    skillKeywords: ["figma", "ui/ux", "design", "prototyping", "branding"]
  },
  growth: {
    label: "Pitch / storytelling",
    projectKeywords: ["pitch", "demo", "judges", "hackathon"],
    skillKeywords: ["pitching", "storytelling", "public speaking", "go-to-market"]
  },
  infra: {
    label: "Deploy / infra",
    projectKeywords: ["deploy", "scale", "production", "36-hour", "hackathon"],
    skillKeywords: ["docker", "aws", "ci/cd", "deploy/devops", "system design"]
  }
};

function textIncludesAny(text, keywords) {
  return keywords.some((k) => text.includes(k));
}

export function analyzeTeam({ projectDescription = "", team = [] }) {
  const projectText = projectDescription.toLowerCase();
  const teamSkills = team.flatMap((m) => (m.skills || []).map((s) => s.toLowerCase()));

  const categoryAnalysis = Object.entries(CATEGORIES).map(([key, cat]) => {
    const needed = textIncludesAny(projectText, cat.projectKeywords);
    const covered = textIncludesAny(teamSkills.join(" "), cat.skillKeywords);
    return { key, label: cat.label, needed, covered };
  });

  const strengths = categoryAnalysis
    .filter((c) => c.covered)
    .map((c) => c.label);

  const gaps = categoryAnalysis.filter((c) => c.needed && !c.covered);

  // Always surface at least one gap suggestion if every needed category is
  // covered, treat "growth/pitch" as a perpetual nice-to-have for hackathons.
  const primaryGap =
    gaps[0] ||
    (!categoryAnalysis.find((c) => c.key === "growth").covered
      ? categoryAnalysis.find((c) => c.key === "growth")
      : null);

  let recommendation = null;
  if (primaryGap) {
    const existingIds = new Set(team.map((m) => m.id).filter(Boolean));
    const candidateCat = CATEGORIES[primaryGap.key];
    const candidates = profiles
      .filter((p) => !existingIds.has(p.id))
      .map((p) => {
        const hay = p.skills.join(" ").toLowerCase() + " " + p.role.toLowerCase();
        const hit = textIncludesAny(hay, candidateCat.skillKeywords);
        return { profile: p, hit };
      })
      .filter((c) => c.hit);

    if (candidates.length) {
      recommendation = {
        category: primaryGap.label,
        profile: candidates[0].profile,
        reason: `Your team covers ${strengths.length ? strengths.join(", ") : "no detected categories yet"}, but the project needs ${primaryGap.label.toLowerCase()}. ${
          candidates[0].profile.name.split(" ")[0]
        } fills that gap.`
      };
    }
  }

  return {
    strengths,
    gaps: gaps.map((g) => g.label),
    recommendation
  };
}
