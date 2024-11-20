const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const saveUserActivity = async (data) => {
  const connection = await pool.getConnection();
  try {
    const { event, details = {}, timestamp } = data;
    await connection.execute(
      "INSERT INTO user_activity (event_type, details, timestamp) VALUES (?, ?, ?)",
      [event, JSON.stringify(details), new Date(timestamp)]
    );
    console.log("User activity saved:", data);
  } catch (err) {
    console.error("Error saving user activity:", err.message);
    throw new Error("Database error");
  } finally {
    connection.release();
  }
};

module.exports = { saveUserActivity };
