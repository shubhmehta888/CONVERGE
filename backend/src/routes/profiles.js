import { Router } from "express";
import { profiles } from "../data/profiles.js";
import { getRegisteredProfiles } from "../lib/auth.js";

export const profilesRouter = Router();

// GET /api/profiles?limit=5
profilesRouter.get("/", (req, res) => {
  const allProfiles = [...profiles, ...getRegisteredProfiles()];
  const limit = Number(req.query.limit) || allProfiles.length;
  res.json({ profiles: allProfiles.slice(0, limit), total: allProfiles.length });
});

// GET /api/profiles/:id
profilesRouter.get("/:id", (req, res) => {
  const profile = [...profiles, ...getRegisteredProfiles()].find((p) => p.id === req.params.id);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json({ profile });
});
