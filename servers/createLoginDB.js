const sqlite3 = require('sqlite3').verbose();

// Create and populate the database
const db = new sqlite3.Database('databases/login.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, fullname TEXT, won INTEGER, lost INTEGER, drawn INTEGER)');

  const stmt = db.prepare('INSERT OR IGNORE INTO users (username, password, fullname, won, lost, drawn) VALUES (?, ?, ?, ?, ?, ?)');

  const usersData = [
    ['admin', 'admin123', 'Jane Smith', 12, 35, 3],
    ['mickeym', 'cheese123', 'Mickey Mouse', 3, 44, 3],
    ['alfred', 'pm1903aus', 'Alfred Deakin', 43, 2, 5],
    ['john', 'brian1979', 'John Cleese', 27, 5, 18],
    ['terry', 'montyp1969', 'Terry Jones', 34, 9, 7],
  ];

  for (const user of usersData) {
    stmt.run(user);
  }

  stmt.finalize();

  console.log('Database initialized and populated.');
});

db.close();
