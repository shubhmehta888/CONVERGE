const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("converge-token");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
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
    }),
  register: (name, email, password) => request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" })
};
