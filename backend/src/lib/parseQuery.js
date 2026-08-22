// Lightweight, dependency-free "intent parser" for search queries like:
//   "I need a React developer for my hackathon tonight."
//   "Looking for a UI/UX designer this week for a startup pitch."
//
// It pulls out three things: skills mentioned, a role/category, and
// availability signals — the same three axes every profile is tagged with.
// This is intentionally simple (no ML dependency needed to run the app),
// but is swapped for a Claude-powered parser automatically when
// ANTHROPIC_API_KEY is set — see aiParser.js.

const SKILL_LEXICON = [
  "react", "typescript", "javascript", "node.js", "node", "express",
  "postgresql", "postgres", "sql", "python", "pandas", "redis", "go",
  "kafka", "docker", "aws", "ci/cd", "figma", "ui/ux", "prototyping",
  "branding", "illustration", "motion design", "next.js", "prisma",
  "stripe", "vue", "tailwind", "swift", "react native", "llms", "llm",
  "rag", "langchain", "prompt engineering", "pytorch", "vector db",
  "data viz", "recommendation systems", "system design", "rest apis",
  "apis", "storytelling", "pitching", "public speaking", "go-to-market",
  "roadmapping", "user research", "accessibility", "auth", "football", "cricket",
  "basketball", "badminton", "running", "fitness", "gym", "yoga", "music", "guitar",
  "dance", "photography", "books", "reading", "study buddy", "mathematics", "physics",
  "finance", "entrepreneurship", "public speaking", "mental health", "movies", "gaming"
];

const ROLE_LEXICON = {
  frontend: ["frontend", "front-end", "front end", "react developer", "ui developer"],
  backend: ["backend", "back-end", "back end", "api developer", "server"],
  "full-stack": ["full-stack", "fullstack", "full stack"],
  mobile: ["mobile", "ios", "android", "react native", "app developer"],
  design: ["designer", "ui/ux", "ux", "ui design", "product design"],
  ml: ["ml", "machine learning", "llm", "llms", "rag", "ai engineer", "data scien"],
  data: ["data analyst", "data scientist", "data engineer"],
  growth: ["pitch", "growth", "marketing", "storytelling", "gtm"],
  infra: ["devops", "infra", "deploy", "docker", "aws", "ci/cd"],
  sports: ["sport", "football", "cricket", "basketball", "badminton", "running", "fitness", "gym", "yoga"],
  study: ["study", "study buddy", "mathematics", "physics", "exam", "academic"],
  culture: ["music", "guitar", "dance", "photography", "books", "reading", "movies", "gaming"],
  mindset: ["mindset", "mental health", "wellness", "accountability", "habits"]
};

const AVAILABILITY_LEXICON = {
  tonight: ["tonight", "right now", "asap", "this evening"],
  "this-week": ["this week", "next few days"],
  weekend: ["weekend", "saturday", "sunday"],
  remote: ["remote", "online", "virtual"],
  "late-night": ["late night", "overnight", "till 3am", "till 4am"]
};

function findMatches(text, dictOrList) {
  const found = [];
  if (Array.isArray(dictOrList)) {
    for (const term of dictOrList) {
      if (text.includes(term)) found.push(term);
    }
    return found;
  }
  for (const [key, terms] of Object.entries(dictOrList)) {
    if (terms.some((t) => text.includes(t))) found.push(key);
  }
  return found;
}

export function parseQuery(rawQuery) {
  const text = rawQuery.toLowerCase();

  const skills = findMatches(text, SKILL_LEXICON);
  const roles = findMatches(text, ROLE_LEXICON);
  const availability = findMatches(text, AVAILABILITY_LEXICON);

  return {
    raw: rawQuery,
    skills,
    roles,
    availability
  };
}
