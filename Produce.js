    const mongoose = require('mongoose');

    const ProductSchema = new mongoose.Schema({
        name: String,
        desc: String,
        image: String,
        video: String
    });

    const Product = new mongoose.model('product', ProductSchema);
    module.exports = Product;