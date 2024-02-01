const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('databases/commentsDB.db');

db.serialize(function () {
  // Create a table for feedbacks
  db.run(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      contactNumber TEXT,
      feedback TEXT
    )
  `);
});

db.close();
