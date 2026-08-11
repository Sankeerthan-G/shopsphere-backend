const pool = require("../config/db");


// GET /orders
const getOrders = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM orders ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to fetch orders"
        });
    }
};


// POST /orders
const createOrder = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({
                error: "user_id, product_id and quantity are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO orders (user_id, product_id, quantity)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [user_id, product_id, quantity]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create order"
        });
    }
};


// PUT /orders/:id
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const result = await pool.query(
            `UPDATE orders
             SET quantity = $1
             WHERE id = $2
             RETURNING *`,
            [quantity, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Order not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update order"
        });
    }
};


// DELETE /orders/:id
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM orders WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Order not found"
            });
        }

        res.json({
            message: "Order deleted successfully",
            order: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete order"
        });
    }
};


module.exports = {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder
};