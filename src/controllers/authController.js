import { authService } from "../services/authService.js";
import { signAccessToken, signRefreshToken, verifyRefresh, cookieOptions } from "../utils/jwt.js";

export const authController = {
  register: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const user = await authService.register({ email, password, name });
      res.status(201).json({ success: true, message: "Registered", object: user });
    } catch (e) {
      next(e);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await authService.login({ email, password });
      const payload = { id: user.id, role: user.role };
      const access = signAccessToken(payload);
      const refresh = signRefreshToken(payload);
      res.cookie("accesstoken", access, { ...cookieOptions(), maxAge: 60 * 60 * 1000 });
      res.cookie("refreshtoken", refresh, { ...cookieOptions(), maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ success: true, message: "Logged in", object: user });
    } catch (e) {
      next(e);
    }
  },
  logout: async (req, res, next) => {
    try {
      res.clearCookie("accesstoken");
      res.clearCookie("refreshtoken");
      res.json({ success: true, message: "Logged out" });
    } catch (e) {
      next(e);
    }
  },
  refresh: async (req, res, next) => {
    try {
      const token = req.cookies.refreshtoken;
      if (!token) {
        const err = new Error("No refresh token");
        err.status = 401;
        throw err;
      }
      const decoded = verifyRefresh(token);
      const payload = { id: decoded.id, role: decoded.role };
      const access = signAccessToken(payload);
      res.cookie("accesstoken", access, { ...cookieOptions(), maxAge: 60 * 60 * 1000 });
      res.json({ success: true, message: "Refreshed" });
    } catch (e) {
      next(e);
    }
  },
};
