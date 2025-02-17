const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12762989',
  password: 'kGgrfBqrn2',
  database: 'sql12762989',
  port: 3306,
});

// Log when the server starts
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Define a POST route to handle the form submission
app.post('/verify', (req, res) => {
  const { h, acttime, actstatus } = req.body;

  // Log the received data
  console.log('Received data:', { h, acttime, actstatus });

  // Now you can use this data to query the database, etc.
  if (actstatus === 'forverification') {
    // Query the database to check the status of the user
    const query = `SELECT * FROM examinerusers WHERE h = ? AND acttime = ?`;

    db.query(query, [h, acttime], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (results.length > 0) {
        // Assuming actstatus is stored as 'verified' once verified
        const updateQuery = `UPDATE examinerusers SET actstatus = 'verified' WHERE h = ?`;

        db.query(updateQuery, [h], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Database update error:', updateErr);
            return res.status(500).json({ message: 'Database update error' });
          }

          // Log the data after the update
          console.log('User actstatus updated to verified:', { h });
          
          // Respond to the client
          return res.json({ message: 'User successfully verified' });
        });
      } else {
        return res.status(404).json({ message: 'User not found or data mismatch' });
      }
    });
  } else {
    return res.status(400).json({ message: 'Invalid actstatus' });
  }
});
