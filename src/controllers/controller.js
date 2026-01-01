import pool from "../../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validate as validateUUID } from "uuid";

import {
  userInputValidation,
  LoginValidation,
  addPostValidation,
  UpdatePostValidation,
  PlaceOrderValidation,
} from "../validator/inputValidator.js";

/**
 * Helper function to remove password from user object
 */
const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

/**
 * Create new user
 */
export const CreateUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User creation failed",
        object: null,
        errors: ["Insert returned no rows"],
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      object: sanitizeUser(result.rows[0]),
      errors: null,
    });
  } catch (err) {
    console.error("CreateUser error:", err);
    return res.status(500).json({
      success: false,
      message: err.code === "23505" ? "Duplicate value" : "Database error",
      object: null,
      errors: [err.detail || err.message],
    });
  }
};

/**
 * Login user and generate tokens
 */
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

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR name = $2",
      [email, name]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        object: null,
        errors: ["Invalid credentials"],
      });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        object: null,
        errors: ["Wrong password"],
      });
    }

    const accesstoken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.accesskey,
      { expiresIn: "1h" }
    );

    const refreshtoken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.refreshkey,
      { expiresIn: "1d" }
    );

    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      object: sanitizeUser(user),
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

/**
 * Add product
 */
export const addPost = async (req, res) => {
  const { error, value } = addPostValidation.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      object: null,
      errors: error.details.map((d) => d.message),
    });
  }

  const { name, description, price, stock } = value;

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, price, stock, req.user.id]
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      object: result.rows[0],
      errors: null,
    });
  } catch (err) {
    console.error("AddPost error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      object: null,
      errors: [err.message],
    });
  }
};

/**
 * Update product
 */
export const UpdatePost = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE products
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        stock = COALESCE($4, stock),
        user_id = $5
      WHERE id = $6
      RETURNING *
      `,
      [name, description, price, stock, req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      object: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      errors: [err.message],
    });
  }
};

/**
 * Delete product
 */
export const DeleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      errors: [err.message],
    });
  }
};

/**
 * Place an order
 */
export const PlaceOrder = async (req, res) => {
  const { error, value: orderItems } = PlaceOrderValidation.validate(req.body);
  if (error)
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });

  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let totalPrice = 0;

    // Validate stock and calculate total
    for (const { productId, quantity } of orderItems) {
      const productResult = await client.query(
        "SELECT price, stock, name FROM products WHERE id = $1",
        [productId]
      );

      if (productResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }

      const product = productResult.rows[0];
      if (product.stock < quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      totalPrice += product.price * quantity;
    }

    // Insert main order
    const orderResult = await client.query(
      "INSERT INTO orders (user_id, status, total_price) VALUES ($1, $2, $3) RETURNING id",
      [userId, "pending", totalPrice]
    );

    const orderId = orderResult.rows[0].id;

    // Insert order items and reduce stock
    for (const { productId, quantity } of orderItems) {
      await client.query(
        "INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, productId, quantity]
      );
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [quantity, productId]
      );
    }

    await client.query("COMMIT");

    // Fetch full order details
    const finalOrder = await client.query(
      `SELECT 
        o.id AS order_id,
        o.status,
        o.total_price,
        op.product_id,
        p.name AS product_name,
        p.price AS product_price,
        op.quantity
       FROM orders o
       JOIN order_products op ON op.order_id = o.id
       JOIN products p ON p.id = op.product_id
       WHERE o.id = $1`,
      [orderId]
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: finalOrder.rows,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PlaceOrder error:", err);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
    });
  } finally {
    client.release();
  }
};

/**
 * Get user's orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id AS order_id, status, total_price
       FROM orders
       WHERE user_id = $1`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};
