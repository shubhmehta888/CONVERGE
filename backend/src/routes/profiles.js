import { Router } from "express";
import { profiles } from "../data/profiles.js";

export const profilesRouter = Router();

// GET /api/profiles?limit=5
profilesRouter.get("/", (req, res) => {
  const limit = Number(req.query.limit) || profiles.length;
  res.json({ profiles: profiles.slice(0, limit), total: profiles.length });
});

// GET /api/profiles/:id
profilesRouter.get("/:id", (req, res) => {
  const profile = profiles.find((p) => p.id === req.params.id);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json({ profile });
});
