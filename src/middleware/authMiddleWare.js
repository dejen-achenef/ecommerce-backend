import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { cookieOptions } from "../utils/jwt.js";

export const tokenChecker = async (req, res, next) => {
 try {
   const accessToken = req.cookies.accesstoken;
   const refreshToken = req.cookies.refreshtoken;

   // 1) Verify access token if present
   if (accessToken) {
     try {
       const decoded = jwt.verify(accessToken, config.jwt.accessKey);
       req.user = decoded;
       return next();
     } catch (_) {
       // fallthrough to refresh
     }
   }

   // 2) Try refresh token
   if (refreshToken) {
     try {
       const decodedRefresh = jwt.verify(refreshToken, config.jwt.refreshKey);
       const newAccessToken = jwt.sign(
         { id: decodedRefresh.id, role: decodedRefresh.role },
         config.jwt.accessKey,
         { expiresIn: config.jwt.accessTtl }
       );
       res.cookie("accesstoken", newAccessToken, { ...cookieOptions(), maxAge: 60 * 60 * 1000 });
       req.user = decodedRefresh;
       return next();
     } catch (err) {
       return res.status(401).json({ success: false, message: "Refresh token expired, please login again" });
     }
   }

   // 3) No valid tokens
   return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
 } catch (error) {
   return res.status(500).json({ success: false, message: "Server error in tokenChecker", error: error.message });
 }
};
