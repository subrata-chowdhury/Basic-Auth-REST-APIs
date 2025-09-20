import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: process.env.DB_PORT || 16054
});

export default pool;
