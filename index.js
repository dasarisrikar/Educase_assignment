const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 8000;

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Default XAMPP username
    password: "", // Default XAMPP password (empty)
    database: "school_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
app.post("/addSchool", (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const sql = "INSERT INTO school (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "School added successfully", schoolId: result.insertId });
    });
});

app.get("/listSchools", (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }
    const sql = "SELECT *, (POW(latitude - ?, 2) + POW(longitude - ?, 2)) AS distance FROM school ORDER BY distance";
    db.query(sql, [lat, lon], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
