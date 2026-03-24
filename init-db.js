import { createClient } from '@libsql/client';

const turso = createClient({
  url: "libsql://findme-xwriter82.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQzNzkwNzYsImlkIjoiMDE5ZDIxM2ItZWQwMS03YzIxLWJiMDQtNDVhMjIwNzFjMjkxIiwicmlkIjoiZmFkNGRlYzktNTgxYy00OTVlLWFkYWItZjdkNzRjNzk2OGUzIn0.0eMQ7woNhz5_lB3ldxuabpU2lTPF3rsi_BHd5SSQd1SHI9vn1jcMmc6Cfpa46N8lKx64cTugoSy3uRSgRkbQDA"
});

async function init() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Notifications (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Notifications table created");
    
    // Add reply column to Admin_Messages if it doesn't exist
    try {
      await turso.execute(`ALTER TABLE Admin_Messages ADD COLUMN reply TEXT`);
      console.log("Added reply column to Admin_Messages");
    } catch (e) {
      console.log("reply column might already exist");
    }

  } catch (e) {
    console.error(e);
  }
}

init();
