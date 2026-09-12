const pool = require("../config/db");
const { redisClient } = require("../config/redis");

// GET /products
const getProducts = async (req, res) => {
    try {

        // 1. Check Redis cache
        const cachedProducts = await redisClient.get("products");

        if (cachedProducts) {

            console.log("Products served from Redis");

            return res.json(JSON.parse(cachedProducts));
        }


        // 2. Cache miss → get data from PostgreSQL
        console.log("Products served from PostgreSQL");

        const result = await pool.query(
            "SELECT * FROM products ORDER BY id"
        );


        // 3. Store PostgreSQL result in Redis
        await redisClient.set(
            "products",
            JSON.stringify(result.rows),
            {
                EX: 60
            }
        );


        // 4. Return response
        res.json(result.rows);

    } catch (error) {

        console.error("Failed to fetch products:", error);

        res.status(500).json({
            error: "Failed to fetch products"
        });
    }
};

// POST /products
const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({
                error: "Name, price and stock are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO products (name, price, stock)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, price, stock]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create product"
        });
    }
};


// PUT /products/:id
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET name = $1, price = $2, stock = $3
             WHERE id = $4
             RETURNING *`,
            [name, price, stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update product"
        });
    }
};


// DELETE /products/:id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully",
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete product"
        });
    }
};


module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};