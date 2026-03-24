import { createClient } from '@libsql/client';

const turso = createClient({
  url: "libsql://findme-xwriter82.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQzNzkwNzYsImlkIjoiMDE5ZDIxM2ItZWQwMS03YzIxLWJiMDQtNDVhMjIwNzFjMjkxIiwicmlkIjoiZmFkNGRlYzktNTgxYy00OTVlLWFkYWItZjdkNzRjNzk2OGUzIn0.0eMQ7woNhz5_lB3ldxuabpU2lTPF3rsi_BHd5SSQd1SHI9vn1jcMmc6Cfpa46N8lKx64cTugoSy3uRSgRkbQDA"
});

async function setupAdmin() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Admin_Users (
          username TEXT PRIMARY KEY,
          password TEXT
      );
    `);
    
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Admin_Messages (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          username TEXT,
          email TEXT,
          subject TEXT,
          message TEXT,
          type TEXT,
          status TEXT DEFAULT 'unread',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default admin if not exists
    const adminCheck = await turso.execute("SELECT * FROM Admin_Users WHERE username = 'admin'");
    if (adminCheck.rows.length === 0) {
        await turso.execute("INSERT INTO Admin_Users (username, password) VALUES ('admin', '1234')");
        console.log("Default admin created.");
    }

    console.log("Admin tables created successfully");
  } catch (e) {
    console.error("Error creating admin tables:", e);
  }
}

setupAdmin();
