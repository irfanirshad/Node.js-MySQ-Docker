import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

/**
 * to see more on this, click on createPool() method. 
 */

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    // queueLimit: process.env.DB_QUEUE_LIMIT
});

export default pool; 