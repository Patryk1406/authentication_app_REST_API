import * as mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DATABSE_HOST || 'localhost',
  user: process.env.DATABSE_USER || 'root',
  password: process.env.DATABSE_PASS || '',
  database: process.env.DATABSE_NAME || 'authentication_app',
  timezone: process.env.DATABASE_TIMEZONE || 'local',
  decimalNumbers: true,
  namedPlaceholders: true,
  dateStrings: false,
});

(async () => {
  const date = new Date();
  const [res] = await pool.execute('UPDATE `users` SET `lastLoginAt` = ? WHERE `id` = "143cdec0-c853-4341-9078-6529c3e54883"', [date]);
})();
