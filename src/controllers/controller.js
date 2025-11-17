import pool from "../../db.js";
import jwt from "jsonwebtoken";
import {
  userInputValidation,
  LoginValidation,
  addPostValidation,
  UpdatePostValidation,
  PlaceOrderValidation,
} from "../validator/inputValidator.js";
import bcrypt from "bcrypt";
import { validate as validateUUID } from "uuid";
export const CreateUser = async (req, res) => {
  // const { error, value } = userInputValidation.validate(req.body);

  // if (error) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Validation failed",
  //     object: null,
  //     errors: error.details.map((d) => d.message),
  //   });
  // }

  const { name, email, password, role } = req.body;

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
      "INSERT INTO users (name, email, password,role) VALUES ($1, $2, $3,$4) RETURNING *",
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

    // Find user by email or username
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

    // Compare password FIRST
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
        object: null,
        errors: ["Wrong password"],
      });
    }

    // Now generate tokens
    const accesstoken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.accesskey,
      {
        expiresIn: "1h",
      }
    );

    const refreshtoken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.refreshkey,
      {
        expiresIn: "1d",
      }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Set cookies (HTTP-only)
    res.cookie("accesstoken", accesstoken, {
      httpOnly: true,
      secure: false, // change to true when using HTTPS
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.cookie("refresh_token", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      object: userWithoutPassword,
      token: token,
      refreshToken: refreshtoken,
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
      success: false,
      message: "Please put the correct value",
      object: null,
      errors: error.details.map((d) => d.message),
    });
  }

  const { name, description, price, stock } = value;

  try {
    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock,user_id) VALUES ($1, $2, $3, $4,$5) RETURNING *",
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
export const UpdatePost = async (req, res) => {
  const { id } = req.params; // product id from URL
  const { name, description, price, stock } = req.body; // fields from client

  try {
    // Only update the fields that exist
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
    return res
      .status(500)
      .json({ success: false, message: "Server error", errors: [err.message] });
  }
};

export const getAllUser = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;
  try {
    const products = await pool.query(
      "SELECT * FROM products LIMIT $1 OFFSET $2 ",
      [limit, offset]
    );
    console.log(products);
    if (!products) {
      return res
        .status(400)
        .json({ success: false, message: "products are not reachable" });
    }

    const Totalitems = await pool.query("SELECT COUNT(*) FROM products");
    const totalitemscount = Totalitems.rows[0].count;
    const totalPages = totalitemscount / limit;
    console.log(Totalitems.rows);
    return res.status(200).json({
      success: true,
      message: "Products returned",
      page,
      limit,
      totalitemscount,

      totalPages,
      data: products.rows,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", errors: [err.message] });
  }
};

export const searchUser = async (req, res) => {
  let limit = 10;
  let page = 1;
  const offset = (page - 1) * limit;

  try {
    const search = req.query.search;

    const products = search
      ? await pool.query("SELECT * FROM products WHERE name ILIKE $1", [
          `%${search}%`,
        ])
      : await pool.query("SELECT * FROM products LIMIT $1 OFFSET $2 ", [
          limit,
          offset,
        ]);

    console.log("rjidhgudfj ", products);
    if (!products) {
      return res
        .status(400)
        .json({ success: false, message: "products are not reachable" });
    }

    const Totalitems = await pool.query("SELECT COUNT(*) FROM products");
    const totalitemscount = Totalitems.rows[0].count;

    return res.status(200).json({
      success: true,
      message: "Products returned",

      totalitemscount,

      data: products.rows,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", errors: [err.message] });
  }
};

export const getPostIndividually = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let id = req.params.id;

  const offset = (page - 1) * limit;
  try {
    const products = await pool.query(
      "SELECT * FROM products WHERE id=$1 LIMIT $2 OFFSET $3",
      [id, limit, offset]
    );
    console.log(products);
    if (products.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "products not found" });
    }

    const Totalitems = await pool.query("SELECT COUNT(*) FROM products");
    const totalitemscount = Totalitems.rows[0].count;
    const totalPages = totalitemscount / limit;
    console.log(Totalitems.rows);
    return res.status(200).json({
      success: true,
      message: "Products returned",
      page,
      limit,
      totalitemscount,

      totalPages,
      data: products.rows,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", errors: [err.message] });
  }
};
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      errors: [error.message],
    });
  }
};

export const PlaseOrder = async (req, res) => {
  const { error, value } = PlaceOrderValidation.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      object: null,
      errors: error.details.map((d) => d.message),
    });

    const { productitems } = req.body;

    for (let item in productitems) {
      const { productid, quantity } = item;
    }
    try {
      const orderplace = pool.query(
        "INSERT INTO order_products (product_id,quantity) VALUES ($1,$2) RETURNING *",
        [productid, quantity]
      );
      res.status(201).json({
        success: true,
        message: "Order Successfully Created",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "unExpected error happened",
      });
    }
  }
};
