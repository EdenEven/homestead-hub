import { createConnection } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq, desc } from 'drizzle-orm';
import { config } from 'dotenv';
config();

const conn = await createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

// Import schema dynamically
const { blogPosts } = await import('../drizzle/schema.js');

console.log('Testing getBlogPosts query...');
const posts = await db.select()
  .from(blogPosts)
  .where(eq(blogPosts.isPublished, true))
  .orderBy(desc(blogPosts.publishedAt))
  .limit(20);

console.log('Posts returned:', posts.length);
posts.forEach(p => console.log(' -', p.id, p.title, '| published:', p.isPublished));

await conn.end();
