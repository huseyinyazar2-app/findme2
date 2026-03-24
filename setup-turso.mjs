import { createClient } from '@libsql/client';

const turso = createClient({
  url: "libsql://findme-xwriter82.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQzNzkwNzYsImlkIjoiMDE5ZDIxM2ItZWQwMS03YzIxLWJiMDQtNDVhMjIwNzFjMjkxIiwicmlkIjoiZmFkNGRlYzktNTgxYy00OTVlLWFkYWItZjdkNzRjNzk2OGUzIn0.0eMQ7woNhz5_lB3ldxuabpU2lTPF3rsi_BHd5SSQd1SHI9vn1jcMmc6Cfpa46N8lKx64cTugoSy3uRSgRkbQDA"
});

async function setup() {
  try {
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS QR_Kod (
          short_code TEXT PRIMARY KEY,
          pin TEXT,
          status TEXT,
          full_url TEXT
      );
    `);
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Find_Users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE,
          qr_code TEXT,
          password TEXT,
          full_name TEXT,
          email TEXT,
          phone TEXT,
          is_email_verified INTEGER DEFAULT 0,
          contact_preference TEXT,
          emergency_contact_name TEXT,
          emergency_contact_email TEXT,
          emergency_contact_phone TEXT,
          city TEXT,
          district TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS Find_Pets (
          id TEXT PRIMARY KEY,
          owner_id TEXT,
          pet_data TEXT,
          lost_status TEXT,
          FOREIGN KEY(owner_id) REFERENCES Find_Users(id)
      );
    `);
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS QR_Logs (
          id TEXT PRIMARY KEY,
          qr_code TEXT,
          ip_address TEXT,
          user_agent TEXT,
          device_info TEXT,
          location TEXT,
          consent_given INTEGER DEFAULT 0,
          scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tables created successfully");
  } catch (e) {
    console.error("Error creating tables:", e);
  }
}

setup();
