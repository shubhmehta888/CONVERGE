const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  health: () => request("/health"),
  listProfiles: (limit) => request(`/profiles${limit ? `?limit=${limit}` : ""}`),
  search: (query, limit) =>
    request("/search", { method: "POST", body: JSON.stringify({ query, limit }) }),
  analyzeTeam: (projectDescription, team) =>
    request("/team/analyze", {
      method: "POST",
      body: JSON.stringify({ projectDescription, team })
    })
};
