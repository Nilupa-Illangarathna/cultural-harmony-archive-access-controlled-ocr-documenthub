const sqlite3 = require('sqlite3').verbose();

// Dummy data for about page
const aboutData = {
  logoAddress: "images/Logo/Logo.png",
  biography: "Welcome to LegacyLanka, where innovation meets cultural heritage preservation and exchange. We are a dedicated team of experts, each bringing a unique blend of skills and knowledge from different engineering disciplines to bridge the gap between the past and the future.",
  history: "We are passionate about preserving cultural heritage and making it accessible to the world through digital innovation.",
  address: "Our team combines the strengths of electronic and computer engineering to create a secure, user-friendly platform. The civil and mechanical engineering experts ensure its stability and efficiency.",

  Founder: "We invite you to explore LegacyLanka, where innovation meets tradition, and the past connects with the future. Join us in our mission to preserve, share, and celebrate the cultural heritage that defines who we are. Together, we can bridge the digital divide and ensure that our legacy lives on for generations to come.",
  companyName: "LegacyLanka",
  };

// Create and populate the aboutDB.db database
let aboutDb = new sqlite3.Database('databases/aboutDB.db');

aboutDb.serialize(() => {
  aboutDb.run('CREATE TABLE IF NOT EXISTS aboutData (data TEXT)');

  const insertStmt = aboutDb.prepare('INSERT INTO aboutData (data) VALUES (?)');

  // Convert aboutData to JSON storing into the database
  insertStmt.run(JSON.stringify(aboutData));

  insertStmt.finalize();

  console.log('About data saved to database.');
});

aboutDb.close();
