const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();

app.set('view engine', 'html'); // Set view engine to HTML
app.engine('html', require('ejs').renderFile); // Use EJS to render HTML

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Set static directory

// Access control
let isAdmin = false;


// // Dummy data
// Login data
const db = new sqlite3.Database('databases/login.db');

app.get('/', (req, res) => {
    res.render("login.html");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if(username==="admin" && password === "admin123"){
      isAdmin=true;
    }else{
      isAdmin=false;
    }
    if (err) {
      res.status(500).send('Internal Server Error');
    } else if (row) {
      // Send successful login response
      const { fullname, username, won, lost, drawn } = row;
      const totalMatches = won + lost + drawn;
      const winPercentage = (won / totalMatches * 100).toFixed(2);

      res.render("homepage.html", { data: homepageData , isAdmin:isAdmin});
    } else {
      // Send unsuccessful login response
      const responseHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          <title>Login Failed</title>
        </head>
        <body style="margin: 5% 5%;">
          <div class="container">
            <h2>Login Failed</h2>
            <p>The <em>username</em> or <em>password</em> provided doesn't match our records</p>
            <a href="/" class="btn btn-primary">Return to Login</a>
          </div>
        </body>
        </html>
      `;
      res.send(responseHTML);
    }
  });
});

// Homepage data
// Initialize homepageData variable
let homepageData = null;

// Function to load homepage data from the database
function loadHomepageData(callback) {
  const homepageDb = new sqlite3.Database('databases/homepage.db');
  homepageDb.get('SELECT data FROM homepageData', (err, row) => {
    homepageDb.close();
    if (err) {
      callback(err, null);
    } else if (row) {
      const homepageData = JSON.parse(row.data);
      callback(null, homepageData);
    } else {
      callback(null, null);
    }
  });
}

// Load homepageData at the start of the app
loadHomepageData((err, data) => {
  if (err) {
    console.error('Error loading homepage data:', err);
  } else if (data) {
    homepageData = data;
    console.log('Homepage data loaded from the database.');
  } else {
    console.log('No homepage data found in the database.');
  }
});

// About data
// Initialize aboutData variable
let aboutData = null;

function loadAboutData(callback) {
  const aboutDb = new sqlite3.Database('databases/aboutDB.db');
  aboutDb.get('SELECT data FROM aboutData', (err, row) => {
    aboutDb.close();
    if (err) {
      callback(err, null);
    } else if (row) {
      const aboutData = JSON.parse(row.data);
      callback(null, aboutData);
    } else {
      callback(null, null);
    }
  });
}

// Load aboutData at the start of the app
loadAboutData((err, data) => {
  if (err) {
    console.error('Error loading about data:', err);
  } else if (data) {
    aboutData = data;
    console.log('About data loaded from the database.');
  } else {
    console.log('No about data found in the database.');
  }
});

// Feedback data
// Initialize feedbackData variable
let feedbackData = null;

// Function to load feedback data from the database
function loadFeedbackData(callback) {
  const feedbackDb = new sqlite3.Database('databases/feedbackDB.db');
  feedbackDb.get('SELECT data FROM feedbackData', (err, row) => {
    feedbackDb.close();
    if (err) {
      callback(err, null);
    } else if (row) {
      const feedbackData = JSON.parse(row.data);
      callback(null, feedbackData);
    } else {
      callback(null, null);
    }
  });
}

// Load feedbackData at the start of the app
loadFeedbackData((err, data) => {
  if (err) {
    console.error('Error loading feedback data:', err);
  } else if (data) {
    feedbackData = data;
    console.log('Feedback data loaded from the database.');
  } else {
    console.log('No feedback data found in the database.');
  }
});

// Products data
// Initialize allProducts as an array
let allProducts = [];

// Function to load products data from the database
function loadProductsData(callback) {
  const productsDb = new sqlite3.Database('databases/productsDB.db');
  productsDb.get('SELECT data FROM products', (err, row) => {
    productsDb.close();
    if (err) {
      callback(err, null);
    } else if (row) {
      const productsData = JSON.parse(row.data);
      callback(null, productsData);
    } else {
      callback(null, null);
    }
  });
}

// Load allProducts at the start of the app
loadProductsData((err, data) => {
  if (err) {
    console.error('Error loading products data:', err);
  } else if (data) {
    allProducts = data;
    console.log('Products data loaded from the database.');
  } else {
    console.log('No products data found in the database.');
  }
});

app.post('/reset', (req, res) => {
  // POST request to reset the database
  db.serialize(() => {
    db.run('DELETE FROM users', (err) => {
      if (err) {
        console.error(err.message);
        res.sendStatus(500);
      } else {
        console.log('Database reset');
        res.sendStatus(200);
      }
    });
  });
});



// Feedback route
app.get("/homepage", function(req, res) {
    res.render("homepage.html", { data: homepageData , isAdmin:isAdmin });
});

// About Us route
app.get("/about", function(req, res) {
    res.render("about.html", { data: aboutData , isAdmin:isAdmin});
});




// Feedback route
app.get("/feedback", function(req, res) {
    res.render("feedback.html", { data: feedbackData , isAdmin:isAdmin });
});

// Products route
app.get("/products", function(req, res) {
  res.render('products', { products: allProducts , isAdmin:isAdmin });
});


app.post('/submit-feedback', (req, res) => {
  // POST request to save feedback to the database
  const { email, contactNumber, feedback } = req.body;

  const db = new sqlite3.Database('./databases/commentsDB.db');
  const sql = `
    INSERT INTO feedbacks (email, contactNumber, feedback)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [email, contactNumber, feedback], (err) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500); // Server error
    } else {
      console.log('Feedback saved to the database');
      res.send('Successfully Saved'); // Send a success message
    }
  });

  db.close();
});


// // Route to show feedbacks
// app.get('/showFeedbacks', (req, res) => {
//   res.sendFile(__dirname + '/views/showFeedbacks.html');
// });

app.get("/showFeedbacks", function(req, res) {
  res.render("showFeedbacks.html", { data: homepageData , isAdmin:isAdmin });
});

app.get('/get-feedbacks', (req, res) => {
  // Handle GET request to retrieve feedback data from the database
  const db = new sqlite3.Database('./databases/commentsDB.db');
  const sql = 'SELECT * FROM feedbacks';

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500); // Server error
    } else {
      res.json(rows); // Send JSON response
    }
  });

  db.close();
});

app.post('/reset-feedbacks', (req, res) => {
  // Handle POST request to reset the feedbacks database
  const db = new sqlite3.Database('./databases/commentsDB.db');
  const sql = 'DELETE FROM feedbacks';

  db.run(sql, [], (err) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500); // Server error
    } else {
      console.log('Feedbacks reset');
      res.sendStatus(200); // Success
    }
  });

  db.close();
});






process.chdir(__dirname);

function runPythonScript() {
  const pythonInterpreter = 'C:\\Users\\nilup\\anaconda3\\python.exe';
  const pythonScript = 'main.py';

  // Ensure input and output directories exist
  const inputDir = path.join(__dirname, 'input');
  const outputDir = path.join(__dirname, 'output');
  fs.mkdirSync(inputDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });

  // Execute the Python script
  const pythonProcess = exec(`${pythonInterpreter} ${pythonScript}`, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error running Python script: ${error.message}`);
          return;
      }

      // Read and print the OCR result from the output file
      const ocrTextPath = path.join(outputDir, 'ocr_text.txt');
      fs.readFile(ocrTextPath, 'utf-8', (readError, data) => {
          if (readError) {
              console.error(`Error reading OCR result: ${readError.message}`);
              return;
          }
          console.log(`OCR Result:\n${data}`);
      });
  });

  pythonProcess.stdin.end();
}

// Call the function to run the Python script
// runPythonScript();



// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images/attractive images/');
  },
  filename: (req, file, cb) => {
      cb(null, `attractive${getNewImageNumber()}.jpg`);
  }
});

// Multer configuration for file uploads
const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, '');
  },
  filename: (req, file, cb) => {
      cb(null, `input1.png`);
  }
});

const upload = multer({ storage: storage1 });

// // Route for the new data form
// app.get('/new-data', (req, res) => {
//   res.sendFile(path.join(__dirname, '/views/new-data.html'));
// });

// Feedback route
app.get("/new-data", function(req, res) {
  res.render("new-data.html", { data: homepageData, isAdmin: isAdmin });
});

// Route for handling data submission
app.post('/upload-data', upload.fields([{ name: 'imageInput', maxCount: 1 }, { name: 'imageInput2', maxCount: 1 }]), (req, res) => {
  const topic = req.body.topicInput;
  const description = req.body.descriptionInput;

  // Run Python script after 3 seconds
  setTimeout(() => {
      const pythonInterpreter = 'C:\\Users\\nilup\\anaconda3\\python.exe';
      const pythonScript = 'main.py';

      // Ensure input and output directories exist
      const inputDir = path.join(__dirname, 'input');
      const outputDir = path.join(__dirname, 'output');
      fs.mkdirSync(inputDir, { recursive: true });
      fs.mkdirSync(outputDir, { recursive: true });

      // Execute the Python script
      const pythonProcess = exec(`${pythonInterpreter} ${pythonScript}`, { cwd: __dirname }, (error, stdout, stderr) => {
          if (error) {
              console.error(`Error running Python script: ${error.message}`);
              return;
          }

          // Read the OCR result from the output file
          const ocrTextPath = path.join(outputDir, 'ocr_text.txt');
          fs.readFile(ocrTextPath, 'utf-8', (readError, data) => {
              if (readError) {
                  console.error(`Error reading OCR result: ${readError.message}`);
                  return;
              }

              // Render the output.html file with dynamic data
              res.render('output.html', { filename: req.files['imageInput'][0].filename, topic, description, ocrData: data });
          });
      });

      pythonProcess.stdin.end();
  }, 3000);
});



// Function to get the next image number in the sequence
function getNewImageNumber() {
  // Implement your logic to determine the next image number
  // You can use the existing images in the directory to calculate the next number
  return 5; // For example, return the next number based on the existing images
}

// Example route handler
app.post('/submit-form', (req, res) => {
  const filename = req.files['imageInput'][0].filename;
  const topic = req.body.topic;
  const description = req.body.description;
  const ocrData = "Data from OCR";  // Replace with your actual OCR data

  res.render('output.html', { filename, topic, description, ocrData });
});



// App listen to the port 3000
app.listen(3000, function() {
    console.log("Server created on port 3000");
});





