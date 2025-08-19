const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connect SQLite DB (file stored in project)
const db = new sqlite3.Database("./database.sqlite");

// Create table if not exists
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");

// API: Add user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, email });
  });
});

// API: Get all users
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ Export for Vercel
module.exports = app;
