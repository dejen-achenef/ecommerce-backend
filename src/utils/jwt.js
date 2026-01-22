import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.accessKey, { expiresIn: config.jwt.accessTtl });
}
export function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshKey, { expiresIn: config.jwt.refreshTtl });
}
export function verifyAccess(token) {
  return jwt.verify(token, config.jwt.accessKey);
}
export function verifyRefresh(token) {
  return jwt.verify(token, config.jwt.refreshKey);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
    // path could be restricted to /api for security hardening if desired
  };
}
