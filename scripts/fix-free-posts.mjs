/**
 * Set all blog posts to isFree = true (platform is now free)
 */
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [result] = await conn.execute("UPDATE blogPosts SET isFree = 1");
console.log('Updated', result.affectedRows, 'posts to free');
await conn.end();
