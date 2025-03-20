import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function initializeDatabase() {
  try {
    // First create a connection without database selected
    const tempConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    // Create database if it doesn't exist
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS blog_write_db`);
    await tempConnection.end();

    // Create the main connection pool with the database selected
    const db = mysql.createPool({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Create posts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create comments table with foreign key to posts
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        content TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )
    `);

    console.log("Database and tables initialized successfully");
    return db;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

// Wrap in async function instead of top-level await
let db: mysql.Pool;

async function getDb() {
  if (!db) {
    db = await initializeDatabase();
  }
  return db;
}

export { getDb };
