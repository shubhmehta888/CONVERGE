import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import "dotenv/config";

import { profilesRouter } from "./src/routes/profiles.js";
import { searchRouter } from "./src/routes/search.js";
import { teamRouter } from "./src/routes/team.js";
import { aiParsingEnabled } from "./src/lib/aiParser.js";
import { authRouter } from "./src/routes/auth.js";
import { socialRouter } from "./src/routes/social.js";

const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Production frontend build (frontend/dist) — served by this API process if present.
const distDir = path.resolve(__dirname, "../frontend/dist");
const hasFrontendBuild = fs.existsSync(path.join(distDir, "index.html"));

// ---------------------------------------------------------------------------
// Security headers — applied to every response (API + static frontend).
// Matches the <meta> CSP in frontend/index.html, plus frame-ancestors,
// which browsers only honour as a real HTTP header.
// ---------------------------------------------------------------------------
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https: ws: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join("; ");

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  next();
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, aiParsingEnabled });
});

app.use("/api/profiles", profilesRouter);
app.use("/api/search", searchRouter);
app.use("/api/team", teamRouter);
app.use("/api/auth", authRouter);
app.use("/api/social", socialRouter);

// Unknown API routes stay JSON.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

if (hasFrontendBuild) {
  // Serve the built SPA with hashed-asset caching; index.html always revalidates
  // so header/meta changes go live immediately.
  app.use(
    express.static(distDir, {
      setHeaders(res, filePath) {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    })
  );

  // SPA history fallback — every non-API GET renders the app.
  app.get("*", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(503).json({ error: error.message || "Service unavailable" });
});

app.listen(PORT, () => {
  console.log(`Converge API listening on http://localhost:${PORT}`);
  console.log(`AI-powered query parsing: ${aiParsingEnabled ? "ON" : "OFF (using keyword parser)"}`);
});
