import { Router } from "express";
import { findMatches } from "../lib/matcher.js";

export const searchRouter = Router();

// POST /api/search  { query: string, limit?: number }
searchRouter.post("/", async (req, res) => {
  const { query, limit } = req.body || {};

  if (!query || typeof query !== "string" || !query.trim()) {
    return res.status(400).json({ error: "A non-empty 'query' string is required." });
  }

  try {
    const result = await findMatches(query, { limit: limit || 8 });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed." });
  }
});
