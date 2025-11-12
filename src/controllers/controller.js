import pool from "../../db.js";
import {
  userInputValidation,
  LoginValidation,
  addPostValidation,
} from "../validator/inputValidator.js";
import bcrypt from "bcrypt";

export const CreateUser = async (req, res) => {
  const { error, value } = userInputValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      object: null,
      errors: error.details.map((d) => d.message),
    });
  }

  const { name, email, password } = value;

  try {
    // Check if user already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR name = $2",
      [email, name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
        object: null,
        errors: ["Email or name already exists"],
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User creation failed",
        object: null,
        errors: ["Insert returned no rows"],
      });
    }

    const user = result.rows[0];
    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      object: userWithoutPassword,
      errors: null,
    });
  } catch (err) {
    console.error("CreateUser error:", err);

    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Duplicate value",
        object: null,
        errors: [err.detail || "Unique constraint violation"],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Database error",
      object: null,
      errors: [err.message],
    });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { error, value } = LoginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        object: null,
        errors: error.details.map((d) => d.message),
      });
    }

    const { name, email, password } = value;

    // Find user
    const gettinguser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR name = $2",
      [email, name]
    );

    if (gettinguser.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        object: null,
        errors: ["Invalid credentials"],
      });
    }

    const user = gettinguser.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        object: null,
        errors: ["Wrong password"],
      });
    }

    // Remove password before sending
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: "User signed in successfully",
      object: userWithoutPassword,
      errors: null,
    });
  } catch (err) {
    console.error("LoginUser error:", err);

    return res.status(500).json({
      success: false,
      message: "Database error",
      object: null,
      errors: [err.message],
    });
  }
};
export const addpost = async (req, res) => {
  const { error, value } = addPostValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: true,
      message: "please put the correct value",
      object: null,
      errors: null,
    });
  }

  const { name, description, price, stock } = value;

  //   const user = await pool
};
