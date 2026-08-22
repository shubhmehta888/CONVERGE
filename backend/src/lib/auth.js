import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import pg from "pg";
import { promisify } from "node:util";

const { Pool } = pg;
const scrypt = promisify(scryptCallback);
let pool;
let schemaPromise;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured. Add a PostgreSQL database to run authentication.");
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false });
  return pool;
}

export async function initAuthDatabase() {
  if (!schemaPromise) schemaPromise = getPool().query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT FALSE, initials TEXT NOT NULL, role TEXT NOT NULL,
      skills JSONB NOT NULL DEFAULT '[]', tags JSONB NOT NULL DEFAULT '[]', bio TEXT NOT NULL,
      availability TEXT NOT NULL, availability_tags JSONB NOT NULL DEFAULT '[]', remote BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS connections (
      id TEXT PRIMARY KEY, from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      to_profile_id TEXT NOT NULL, note TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(from_user_id, to_profile_id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY, from_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      profile_id TEXT NOT NULL, text TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await schemaPromise;
}

function publicUser(user) { return { id: user.id, name: user.name, email: user.email, verified: user.verified, createdAt: user.created_at }; }
function profileFromUser(user) { return { id: user.id, name: user.name, initials: user.initials, role: user.role, skills: user.skills, tags: user.tags, bio: user.bio, availability: user.availability, availabilityTags: user.availability_tags, remote: user.remote }; }
async function hashPassword(password, salt = randomBytes(16).toString("hex")) { const key = await scrypt(password, salt, 64); return `${salt}:${key.toString("hex")}`; }
async function passwordMatches(password, stored) { const [salt, hex] = stored.split(":"); const key = await scrypt(password, salt, 64); return timingSafeEqual(Buffer.from(hex, "hex"), key); }

export async function registerUser({ name, email, password }) {
  await initAuthDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const user = { id: randomBytes(12).toString("hex"), name: name.trim(), email: normalizedEmail, verified: normalizedEmail.endsWith("@scaler.com") || normalizedEmail.endsWith("@scaler.school"), initials: name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), role: "New campus member", skills: ["Curious collaborator", "Mindset"], tags: ["mindset"], bio: "New to the Converge campus network and open to finding good people to learn and grow with.", availability: "Open to meeting", availabilityTags: ["this-week"], remote: false, passwordHash: await hashPassword(password) };
  try { await getPool().query(`INSERT INTO users (id,name,email,password_hash,verified,initials,role,skills,tags,bio,availability,availability_tags,remote) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [user.id, user.name, user.email, user.passwordHash, user.verified, user.initials, user.role, JSON.stringify(user.skills), JSON.stringify(user.tags), user.bio, user.availability, JSON.stringify(user.availabilityTags), user.remote]); }
  catch (error) { if (error.code === "23505") throw new Error("An account with this email already exists."); throw error; }
  return createSession({ ...user, created_at: new Date().toISOString() });
}

export async function loginUser({ email, password }) { await initAuthDatabase(); const result = await getPool().query("SELECT * FROM users WHERE email = $1", [email.trim().toLowerCase()]); const user = result.rows[0]; if (!user || !(await passwordMatches(password, user.password_hash))) throw new Error("Email or password is incorrect."); return createSession(user); }
async function createSession(user) { const token = randomBytes(32).toString("hex"); await getPool().query("INSERT INTO sessions (token,user_id) VALUES ($1,$2)", [token, user.id]); return { token, user: publicUser(user) }; }
export async function getUserFromToken(token) { if (!token) return null; await initAuthDatabase(); const result = await getPool().query("SELECT u.* FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.token = $1", [token]); return result.rows[0] ? publicUser(result.rows[0]) : null; }
export async function logoutUser(token) { if (!token || !process.env.DATABASE_URL) return; await initAuthDatabase(); await getPool().query("DELETE FROM sessions WHERE token = $1", [token]); }
export async function getRegisteredProfiles() { await initAuthDatabase(); const result = await getPool().query("SELECT * FROM users ORDER BY created_at DESC"); return result.rows.map(profileFromUser); }
export async function addConnection(token, profileId, note) { const user = await getUserFromToken(token); if (!user) throw new Error("Not authenticated"); await initAuthDatabase(); const id = randomBytes(12).toString("hex"); const result = await getPool().query("INSERT INTO connections (id,from_user_id,to_profile_id,note) VALUES ($1,$2,$3,$4) ON CONFLICT (from_user_id,to_profile_id) DO UPDATE SET note = EXCLUDED.note RETURNING *", [id, user.id, profileId, note]); return result.rows[0]; }
export async function getConnections(token) { const user = await getUserFromToken(token); if (!user) return []; const result = await getPool().query("SELECT * FROM connections WHERE from_user_id = $1 ORDER BY created_at DESC", [user.id]); return result.rows; }
export async function addMessage(token, profileId, text) { const user = await getUserFromToken(token); if (!user) throw new Error("Not authenticated"); await initAuthDatabase(); const result = await getPool().query("INSERT INTO messages (id,from_user_id,profile_id,text) VALUES ($1,$2,$3,$4) RETURNING *", [randomBytes(12).toString("hex"), user.id, profileId, text]); return result.rows[0]; }
export async function getMessages(token, profileId) { const user = await getUserFromToken(token); if (!user) return []; const result = await getPool().query("SELECT * FROM messages WHERE from_user_id = $1 AND profile_id = $2 ORDER BY created_at", [user.id, profileId]); return result.rows; }
