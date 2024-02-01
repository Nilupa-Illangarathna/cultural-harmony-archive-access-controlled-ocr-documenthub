const sqlite3 = require('sqlite3').verbose();

// Dummy data for feedback
const feedbackData = {
  imageUrl: "/images/image01.jpg",
  email: "dummy@example.com",
  contactNumber: "123-456-7890",
  address: "Dummy address",
  linkedIn: "Dummy LinkedIn profile"
};

// Create and populate the feedbackDB.db database
let feedbackDb = new sqlite3.Database('databases/feedbackDB.db');

feedbackDb.serialize(() => {
  feedbackDb.run('CREATE TABLE IF NOT EXISTS feedbackData (data TEXT)');

  const insertStmt = feedbackDb.prepare('INSERT INTO feedbackData (data) VALUES (?)');

  // Convert feedbackData to JSON and insert it into the database
  insertStmt.run(JSON.stringify(feedbackData));

  insertStmt.finalize();

  console.log('Feedback data saved to database.');
});

feedbackDb.close();
