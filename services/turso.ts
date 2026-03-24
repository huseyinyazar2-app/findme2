import { createClient } from '@libsql/client/web';

export const turso = createClient({
  url: "libsql://findme-xwriter82.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQzNzkwNzYsImlkIjoiMDE5ZDIxM2ItZWQwMS03YzIxLWJiMDQtNDVhMjIwNzFjMjkxIiwicmlkIjoiZmFkNGRlYzktNTgxYy00OTVlLWFkYWItZjdkNzRjNzk2OGUzIn0.0eMQ7woNhz5_lB3ldxuabpU2lTPF3rsi_BHd5SSQd1SHI9vn1jcMmc6Cfpa46N8lKx64cTugoSy3uRSgRkbQDA"
});
