const express = require("express");

const app = express();

const PORT = 3000;

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to ShopSphere API"
    });
});

// Users Route
app.get("/users", (req, res) => {
    const users = [
        {
            id: 1,
            name: "Rahul",
            email: "rahul@example.com"
        },
        {
            id: 2,
            name: "Priya",
            email: "priya@example.com"
        }
    ];

    res.json(users);
});

// Products Route
app.get("/products", (req, res) => {

    const products = [
        {
            id: 101,
            name: "Laptop",
            price: 75000
        },
        {
            id: 102,
            name: "Keyboard",
            price: 2500
        }
    ];

    res.json(products);

});

// Orders Route
app.get("/orders", (req, res) => {

    const orders = [
        {
            orderId: 1001,
            userId: 1,
            productId: 101,
            quantity: 1
        },
        {
            orderId: 1002,
            userId: 2,
            productId: 102,
            quantity: 2
        }
    ];

    res.json(orders);

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});