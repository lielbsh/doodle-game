import mysql from 'mysql2';
import dotenv from 'dotenv';

const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: Number(process.env.PORT) || 3306, 
  });


// Promisify the pool for easier async/await usage
const promisePool = pool.promise();

export default promisePool;