import express from "express";
import cors from "cors";
import "dotenv/config";

import { profilesRouter } from "./src/routes/profiles.js";
import { searchRouter } from "./src/routes/search.js";
import { teamRouter } from "./src/routes/team.js";
import { aiParsingEnabled } from "./src/lib/aiParser.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, aiParsingEnabled });
});

app.use("/api/profiles", profilesRouter);
app.use("/api/search", searchRouter);
app.use("/api/team", teamRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Converge API listening on http://localhost:${PORT}`);
  console.log(`AI-powered query parsing: ${aiParsingEnabled ? "ON" : "OFF (using keyword parser)"}`);
});
