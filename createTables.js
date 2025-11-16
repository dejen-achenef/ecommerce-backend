import pool from "./db.js";

const createTables = async () => {
  try {
    // Enable pgcrypto for UUID generation
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);
    // Products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        stock INT NOT NULL,
        category TEXT,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        description TEXT,
        total_price NUMERIC NOT NULL,
        status TEXT DEFAULT 'pending'
      );
    `);

    // Join table for order-products (many-to-many)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_products (
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        quantity INT NOT NULL,
        PRIMARY KEY (order_id, product_id)
      );
    `);

    console.log("✅ Tables created or already exist");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
    process.exit(1);
  }
};

createTables();
