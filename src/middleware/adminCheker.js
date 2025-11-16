import pool from "../../db";
import { emailValidatorForMiddleware } from "../validator/inputValidator";

export const AdminChecker = async (req, res, next) => {
  const { error, value } = emailValidatorForMiddleware(req.body);

  if (error) {
    return res.status(401).json({ message: "Put valid email" });
  }

  const { email } = value;

  try {
    // MUST await query
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    // Fix role checking
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
