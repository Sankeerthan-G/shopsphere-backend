require("dotenv").config();

const express = require("express");

const pool = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");


const app = express();

const PORT = 3000;


// Middleware

app.use(express.json());


// Routes

app.use("/users", userRoutes);

app.use("/products", productRoutes);

app.use("/orders", orderRoutes);


// Home

app.get("/", (req, res) => {

    res.json({
        message: "Welcome to ShopSphere API",
        status: "running"
    });

});


// Health Check

app.get("/health", async (req, res) => {

    try {

        await pool.query("SELECT 1");

        res.status(200).json({
            status: "UP",
            database: "connected"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            status: "DOWN",
            database: "disconnected"
        });

    }

});


// Start Server

app.listen(PORT, () => {

    console.log(
        `ShopSphere backend is running on http://localhost:${PORT}`
    );

});