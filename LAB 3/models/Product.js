const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },

    sku: {
        type: String,
        required: [true, "SKU is required"],
        unique: true,
        uppercase: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },

    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
        default: 0
    },

    reorderLevel: {
        type: Number,
        default: 5,
        min: 0
    },

    supplier: {
        type: String,
        required: true,
        trim: true
    }

}, { timestamps: true });

productSchema.virtual("stockValue").get(function () {
    return this.price * this.quantity;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);