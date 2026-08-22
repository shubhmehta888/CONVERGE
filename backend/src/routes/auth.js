import { Router } from "express";
import { getUserFromToken, loginUser, logoutUser, registerUser } from "../lib/auth.js";

export const authRouter = Router();

function validateCredentials(body, includeName = false) {
  const { name, email, password } = body;
  if (includeName && (!name || name.trim().length < 2)) return "Add your full name.";
  if (!email || !email.includes("@")) return "Enter a valid email address.";
  if (!password || password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

authRouter.post("/register", async (req, res) => {
  const validationError = validateCredentials(req.body, true);
  if (validationError) return res.status(400).json({ error: validationError });
  try { res.status(201).json(await registerUser(req.body)); } catch (error) { res.status(409).json({ error: error.message }); }
});

authRouter.post("/login", async (req, res) => {
  const validationError = validateCredentials(req.body);
  if (validationError) return res.status(400).json({ error: validationError });
  try { res.json(await loginUser(req.body)); } catch (error) { res.status(401).json({ error: error.message }); }
});

authRouter.get("/me", (req, res) => {
  const user = getUserFromToken(req.headers.authorization?.replace("Bearer ", ""));
  if (!user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ user });
});

authRouter.post("/logout", (req, res) => {
  logoutUser(req.headers.authorization?.replace("Bearer ", ""));
  res.json({ ok: true });
});
