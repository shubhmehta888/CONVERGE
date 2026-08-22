# Converge — Find the right people on campus, fast

A full-stack clone of the Converge concept: natural-language people matching and
AI team-gap analysis for student hackathon builders. Three pages — **Home**,
**Find People**, **Team Builder** — backed by a real Express API with an
explainable matching engine.

```
mesh-app/
├── backend/     Express API — profiles, search/matching, team analysis
└── frontend/    React + Vite + Tailwind UI
```

## Requirements

- Node.js 18+ and npm

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env    # optional — see "AI-powered parsing" below
npm run dev
```

The API starts on **http://localhost:4000**. Check it's alive:

```bash
curl http://localhost:4000/api/health
```

## 2. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173**. Vite proxies any request to
`/api/*` through to the backend on port 4000 (see `vite.config.js`), so the
frontend never needs to know the backend's URL directly.

Open http://localhost:5173 in your browser.

## How the matching works

### Find People (`/find`)

1. You type a plain-English request ("I need a React developer for my
   hackathon tonight").
2. The backend (`backend/src/lib/parseQuery.js`) extracts three things from
   the text: **skills** mentioned, a broad **role/category**, and
   **availability** signals (tonight, this week, remote, etc.) using a fast
   keyword lexicon — no external API needed.
3. Every profile is scored against those three axes
   (`backend/src/lib/matcher.js`) — skills weigh more than role, which
   weighs more than availability — and ranked.
4. Each result comes back with a plain-English `whyMatched` sentence built
   from what actually matched, e.g. *"Aisha matched because they know
   React, TypeScript and is free tonight · till 4am."*

### Team Builder (`/team`)

1. You describe the project and list your current team's skills.
2. `backend/src/lib/teamAnalyzer.js` maps both the project description and
   the team's combined skills onto seven categories (frontend, backend,
   mobile, ML/AI, design, growth/pitch, infra).
3. It reports which categories your team already **covers** (strengths),
   which the project needs but nobody covers (**gaps**), and recommends
   the best-fitting profile from the pool to fill the top gap — with a
   plain-English reason.

## Optional: AI-powered parsing

By default Converge's query parser is a fast, dependency-free keyword matcher —
the whole app works out of the box with zero API keys. If you want the
"Find People" query parsing to be handled by Claude instead (better at
handling phrasing the keyword list doesn't anticipate), set an API key:

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

Restart the backend. The `/api/health` response and the "Parsed via …" line
under the Find People results will confirm whether AI parsing is active.
If the key is missing, invalid, or the request fails for any reason, Converge
automatically falls back to the keyword parser — the app never breaks
because of this.

## API reference

| Method | Path                 | Body                                              | Description                                  |
|--------|----------------------|----------------------------------------------------|-----------------------------------------------|
| GET    | `/api/health`        | —                                                  | Liveness + whether AI parsing is enabled      |
| GET    | `/api/profiles`      | —                                                  | List all profiles (`?limit=n` to cap)         |
| GET    | `/api/profiles/:id`  | —                                                  | Fetch one profile                             |
| POST   | `/api/search`        | `{ "query": string, "limit"?: number }`            | Ranked, explained matches for a free-text ask |
| POST   | `/api/team/analyze`  | `{ "projectDescription": string, "team": [...] }`  | Strengths, gaps, and a recommended addition   |

## Swapping in a real database

All profile data lives in one place: `backend/src/data/profiles.js`, a
plain array. To move to Postgres/Mongo/etc., replace that file's export
with a query against your DB (or an ORM model) — every route and the
matcher/analyzer only ever import `profiles` from that module, so nothing
else needs to change.

## Design notes

The UI uses a dark "campus-at-night" palette (ink background, violet and
amber accents) with Space Grotesk for display type and Inter for body
text. The hero's animated node-graph is the page's signature element,
representing the network of students the product connects. All colors
and fonts are defined as design tokens in `frontend/tailwind.config.js`.
