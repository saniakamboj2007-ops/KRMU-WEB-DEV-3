const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// 1. CREATE PRODUCT
router.post("/", async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        next(error);
    }
});


// 2. GET ALL PRODUCTS
// Filtering + Sorting + Pagination

router.get("/", async (req, res, next) => {
    try {

        const {
            category,
            minPrice,
            maxPrice,
            search,
            sortBy = "createdAt",
            order = "desc",
            page = 1,
            limit = 10
        } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.max(1, Math.min(100, Number(limit) || 10));

        const skip = (pageNumber - 1) * limitNumber;

        const sortOrder = order === "asc" ? 1 : -1;

        const products = await Product.find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limitNumber);

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            count: products.length,
            products
        });

    } catch (error) {
        next(error);
    }
});


// 3. GET SINGLE PRODUCT BY ID

router.get("/:id", async (req, res, next) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        next(error);
    }
});


// 4. UPDATE PRODUCT DETAILS

router.put("/:id", async (req, res, next) => {
    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        next(error);
    }
});


// 5. STOCK ADJUSTMENT (RESTOCK / SALE)

router.patch("/:id/stock", async (req, res, next) => {
    try {

        const { action, quantity } = req.body;

        if (!["restock", "sale"].includes(action)) {
            return res.status(400).json({
                message: "Action must be restock or sale"
            });
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const change = action === "restock" ? quantity : -quantity;

        const filter = { _id: req.params.id };

        if (action === "sale") {
            filter.quantity = { $gte: quantity };
        }

        const product = await Product.findOneAndUpdate(
            filter,
            { $inc: { quantity: change } },
            { new: true, runValidators: true }
        );

        if (!product) {
            const exists = await Product.exists({ _id: req.params.id });

            return res.status(exists ? 400 : 404).json({
                message: exists
                    ? "Insufficient stock"
                    : "Product not found"
            });
        }

        res.status(200).json({
            message: "Stock adjusted successfully",
            product
        });

    } catch (error) {
        next(error);
    }
});


// 6. DELETE PRODUCT

router.delete("/:id", async (req, res, next) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
});


// 7. LOW STOCK ALERT REPORT

router.get("/reports/low-stock", async (req, res, next) => {
    try {

        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$reorderLevel"]
            }
        });

        res.status(200).json({
            totalLowStockProducts: products.length,
            products
        });

    } catch (error) {
        next(error);
    }
});


// 8. CATEGORY-WISE INVENTORY SUMMARY

router.get("/reports/category-summary", async (req, res, next) => {
    try {

        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",

                    totalProducts: {
                        $sum: 1
                    },

                    totalQuantity: {
                        $sum: "$quantity"
                    },

                    totalStockValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            },

            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        res.status(200).json({
            summary
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;