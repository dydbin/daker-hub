import "server-only";

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const AUTH_SESSION_COOKIE = "daker-auth-session";

const PASSWORD_KEY_LENGTH = 64;
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(String(password ?? ""), salt, PASSWORD_KEY_LENGTH).toString("hex");
  return {
    salt,
    hash
  };
}

export function verifyPassword(password, salt, expectedHash) {
  if (!salt || !expectedHash) return false;

  const actual = scryptSync(String(password ?? ""), salt, PASSWORD_KEY_LENGTH);
  const expected = Buffer.from(expectedHash, "hex");
  if (actual.length !== expected.length) return false;

  return timingSafeEqual(actual, expected);
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token) {
  return createHash("sha256").update(String(token ?? "")).digest("hex");
}

export function createSessionExpiry() {
  return new Date(Date.now() + SESSION_DURATION_MS).toISOString();
}
