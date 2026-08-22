import { Router } from "express";
import { analyzeTeam } from "../lib/teamAnalyzer.js";

export const teamRouter = Router();

// POST /api/team/analyze  { projectDescription: string, team: [{id?, name, skills: string[]}] }
teamRouter.post("/analyze", (req, res) => {
  const { projectDescription, team } = req.body || {};

  if (!projectDescription || typeof projectDescription !== "string") {
    return res.status(400).json({ error: "A 'projectDescription' string is required." });
  }
  if (!Array.isArray(team)) {
    return res.status(400).json({ error: "'team' must be an array of members." });
  }

  try {
    const result = analyzeTeam({ projectDescription, team });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Team analysis failed." });
  }
});
