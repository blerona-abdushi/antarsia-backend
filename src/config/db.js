const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          emri TEXT NOT NULL,
          mbiemri TEXT NOT NULL,
          viti_pageses TEXT NOT NULL,
          kategoria_pageses TEXT NOT NULL,
          pagesa_rymes TEXT,
        fondi_varrezave TEXT,
        fondi_xhamine TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          CONSTRAINT fk_user
              FOREIGN KEY (user_id)
              REFERENCES users(id)
              ON DELETE CASCADE
      );
    `);

    console.log("Users table is ready");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}

initializeDatabase();

module.exports = pool;
