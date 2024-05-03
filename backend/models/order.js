const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: String,
    productId: String,
    price: Number,
    quantity: Number,
    userId: String, // kimin siparişi olduğunu tutmak için
    createdDate : Date
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;