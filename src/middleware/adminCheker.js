import pool from "../../db.js";
import { emailValidatorForMiddleware } from "../validator/inputValidator.js";
export const AdminChecker = async (req, res, next) => {
  // validate req.body
  const { error, value } = emailValidatorForMiddleware.validate({
    email: req.body.email,
  });

  if (error) {
    return res.status(401).json({ message: error });
  }

  const { email } = value;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (userResult.rows.length === 0) {
      return res.status(403).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
