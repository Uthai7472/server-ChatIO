const mysql = require('mysql');
require('dotenv').config(); // Load environment variables from .env file

// Create a connection pool to the database
const pool = mysql.createPool({
  connectionLimit: 5, // Adjust according to your application's needs
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const connectionStatus = () => {
    pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err.stack);
          return;
        }
        console.log('Connected to database as id', connection.threadId);
        connection.release(); // Release the connection back to the pool
    });
}

module.exports = {pool, connectionStatus};