// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'cointab_chat',
  password: 'MUKA', // Replace with your PostgreSQL password
  port: 5432,
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER NOT NULL REFERENCES chats(id),
        role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created successfully (if they did not exist).');
  } catch (err) {
    console.error('Error creating tables', err.stack);
  } finally {
    client.release();
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createTables,
};
