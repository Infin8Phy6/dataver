const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ CORS Headers Middleware (For Cross-Origin Requests)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Database Connection
const db = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12762989",
  password: "kGgrfBqrn2",
  database: "sql12762989",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database");
});

// API to check actstatus
app.post("/verify", (req, res) => {
  const { h } = req.body;
  
  if (!h) return res.status(400).json({ error: "Missing 'h' value" });

  const query = "SELECT actstatus FROM examinerusers WHERE h = ?";
  
  db.query(query, [h], (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result.length > 0) {
      const actstatus = result[0].actstatus;
      console.log(`User with h=${h} has actstatus: ${actstatus}`);
      res.json({ actstatus });
    } else {
      res.json({ actstatus: "not_found" });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
