import pool from "../../db.js";

export const checkUserByid = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    req.user = user.rows[0];
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
