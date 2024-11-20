const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Save user activity to the database.
 * @param {Object} data - User activity data.
 * @param {string} data.event - The event type (e.g., 'page_view', 'click').
 * @param {Object} data.details - Additional details for the event.
 * @param {string} data.timestamp - Timestamp in ISO 8601 format.
 */
const saveUserActivity = async (data) => {
    let connection;
    try {
        // Acquire a connection from the pool
        connection = await pool.getConnection();

        console.log("Data before insertion:", data); // Log data before saving
        const { event, details, timestamp } = data;

        // Format timestamp to MySQL-compatible format
        const formattedTimestamp = new Date(timestamp).toISOString().slice(0, 19).replace("T", " ");
        console.log("Formatted timestamp:", formattedTimestamp); // Log formatted timestamp

        // Execute the SQL query
        const [result] = await connection.execute(
            "INSERT INTO user_activity (event_type, details, timestamp) VALUES (?, ?, ?)",
            [event, JSON.stringify(details), formattedTimestamp]
        );

        console.log("Database insert result:", result); // Log result of the query
    } catch (err) {
        console.error("Error inserting data into database:", err.message); // Log any errors
        throw new Error("Database error: " + err.message); // Propagate the error
    } finally {
        // Release the connection back to the pool
        if (connection) connection.release();
    }
};

module.exports = { saveUserActivity };
