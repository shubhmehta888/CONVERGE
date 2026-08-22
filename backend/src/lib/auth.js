import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const databasePath = join(process.cwd(), "src", "data", "accounts.json");

function readDatabase() {
  if (!existsSync(databasePath)) return { users: [], sessions: [] };
  return JSON.parse(readFileSync(databasePath, "utf8"));
}

function writeDatabase(database) {
  mkdirSync(dirname(databasePath), { recursive: true });
  writeFileSync(databasePath, JSON.stringify(database, null, 2));
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, verified: user.verified, createdAt: user.createdAt };
}

async function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function passwordMatches(password, storedHash) {
  const [salt, key] = storedHash.split(":");
  const derivedKey = await scrypt(password, salt, 64);
  return timingSafeEqual(Buffer.from(key, "hex"), derivedKey);
}

export async function registerUser({ name, email, password }) {
  const database = readDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  if (database.users.some((user) => user.email === normalizedEmail)) throw new Error("An account with this email already exists.");
  const user = {
    id: randomBytes(12).toString("hex"),
    name: name.trim(),
    email: normalizedEmail,
    verified: normalizedEmail.endsWith("@scaler.com") || normalizedEmail.endsWith("@scaler.school"),
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  };
  database.users.push(user);
  writeDatabase(database);
  return createSession(user);
}

export async function loginUser({ email, password }) {
  const database = readDatabase();
  const user = database.users.find((item) => item.email === email.trim().toLowerCase());
  if (!user || !(await passwordMatches(password, user.passwordHash))) throw new Error("Email or password is incorrect.");
  return createSession(user);
}

function createSession(user) {
  const database = readDatabase();
  const token = randomBytes(32).toString("hex");
  database.sessions = database.sessions.filter((session) => session.userId !== user.id);
  database.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });
  writeDatabase(database);
  return { token, user: publicUser(user) };
}

export function getUserFromToken(token) {
  if (!token) return null;
  const database = readDatabase();
  const session = database.sessions.find((item) => item.token === token);
  const user = session && database.users.find((item) => item.id === session.userId);
  return user ? publicUser(user) : null;
}

export function logoutUser(token) {
  const database = readDatabase();
  database.sessions = database.sessions.filter((session) => session.token !== token);
  writeDatabase(database);
}
