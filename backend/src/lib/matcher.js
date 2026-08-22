import { profiles } from "../data/profiles.js";
import { parseQuery } from "./parseQuery.js";
import { parseQueryWithAI, aiParsingEnabled } from "./aiParser.js";

const SKILL_WEIGHT = 3;
const ROLE_WEIGHT = 2;
const AVAILABILITY_WEIGHT = 1;

function normalize(str) {
  return str.toLowerCase();
}

function profileSkillsNormalized(profile) {
  return profile.skills.map(normalize);
}

function scoreProfile(profile, intent) {
  let score = 0;
  const reasons = [];

  const skills = profileSkillsNormalized(profile);
  const matchedSkills = intent.skills.filter((s) =>
    skills.some((ps) => ps.includes(s) || s.includes(ps))
  );
  if (matchedSkills.length) {
    score += matchedSkills.length * SKILL_WEIGHT;
    const display = profile.skills.filter((ps) =>
      matchedSkills.some((s) => normalize(ps).includes(s) || s.includes(normalize(ps)))
    );
    reasons.push(`know ${display.slice(0, 3).join(", ")}`);
  }

  const matchedRoles = intent.roles.filter((r) => profile.tags.includes(r));
  if (matchedRoles.length) {
    score += matchedRoles.length * ROLE_WEIGHT;
    reasons.push(`are a ${profile.role.toLowerCase()}`);
  }

  const matchedAvailability = intent.availability.filter((a) =>
    profile.availabilityTags.includes(a)
  );
  if (matchedAvailability.length) {
    score += matchedAvailability.length * AVAILABILITY_WEIGHT;
    reasons.push(`are ${profile.availability.toLowerCase()}`);
  }

  return { score, reasons, matchedSkills, matchedRoles, matchedAvailability };
}

function buildReasonSentence(profile, reasons) {
  if (reasons.length === 0) {
    return `${profile.name.split(" ")[0]} is a close general fit based on their profile.`;
  }
  const first = profile.name.split(" ")[0];
  const joined =
    reasons.length === 1
      ? reasons[0]
      : reasons.slice(0, -1).join(", ") + " and " + reasons[reasons.length - 1];
  return `${first} matched because they ${joined}.`;
}

export async function findMatches(rawQuery, { limit = 8 } = {}) {
  let intent = null;
  if (aiParsingEnabled) {
    intent = await parseQueryWithAI(rawQuery);
  }
  if (!intent) {
    intent = parseQuery(rawQuery);
  }

  const scored = profiles.map((profile) => {
    const { score, reasons, matchedSkills, matchedRoles, matchedAvailability } = scoreProfile(
      profile,
      intent
    );
    return {
      ...profile,
      score,
      whyMatched: buildReasonSentence(profile, reasons),
      matchedSkills,
      matchedRoles,
      matchedAvailability
    };
  });

  const ranked = scored
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // If nothing matched any keyword at all, still return a reasonable
  // top slice so the UI never shows a dead end — flagged as fallback.
  if (ranked.length === 0) {
    return {
      intent,
      usedAI: aiParsingEnabled,
      fallback: true,
      results: scored.slice(0, limit).map((p) => ({
        ...p,
        whyMatched: `No strong keyword match for "${rawQuery}" — showing active builders instead.`
      }))
    };
  }

  return { intent, usedAI: aiParsingEnabled, fallback: false, results: ranked };
}
