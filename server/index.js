const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to SQLite
const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});


//
// API's START
//
// CUSTOMERS

// Get one customer
app.get('/api/customers/:id', (req, res) => {
    const sql = "SELECT * FROM customers WHERE id = ?";
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});


// Gets List all customers with search, sort, pagination
app.get('/api/customers', (req, res) => {
    let { search, sortBy, order} = req.query;

    search = search ? `%${search}%` : "%";
    sortBy = sortBy || "id";
    order = (order && order.toUpperCase() === "DESC") ? "DESC" : "ASC";

    const sql = `SELECT * FROM customers 
    WHERE first_name LIKE ? OR last_name LIKE ? OR phone_number LIKE ?
    ORDER BY ${sortBy} ${order}`;
    const params = [search, search, search];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        
        res.json({ 
            "message": "success", 
            "data": rows || []
        });
        
    });
});


// Creates a new customer
app.post('/api/customers', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = "INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)";
    const params = [first_name, last_name, phone_number];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});


// Updates customer
app.put('/api/customers/:id', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = "UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?";
    const params = [first_name, last_name, phone_number, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});


// Deletes customer
app.delete('/api/customers/:id', (req, res) => {
    const sql = "DELETE FROM customers WHERE id = ?";
    const params = [req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
        });
    });
});


//Addresses Routes

// Gets addresses of customer
app.get('/api/customers/:id/addresses', (req, res) => {
    const sql = "SELECT * FROM addresses WHERE customer_id = ?";
    const params = [req.params.id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ 
            "message": "success", 
            "data": rows 
        });
    });
});


//Adds address for customer
app.post('/api/customer/:id/addresses', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = "INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)";
    const params = [req.params.id, address_details, city, state, pin_code];

    db.run(sql, params, (err) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            console.log(err)
            return;
        }
        res.json({
            "message": "success"
        });
    });
});


// Updates address
app.put('/api/addresses/:addressId', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = "UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?";
    const params = [address_details, city, state, pin_code, req.params.addressId];

    db.run(sql, params, (err) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});


// Deletes address
app.delete('/api/addresses/:addressId', (req, res) => {
    const sql = "DELETE FROM addresses WHERE id = ?";
    const params = [req.params.addressId];

    db.run(sql, params, (err) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success"
        });
    });
});

//
// API's END
//

app.use(express.static(path.join(__dirname, "../client/build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
