const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
    _id: String, // Sepetin id'si
    productId: String, // Sepetteki ürünün id'si
    price: Number, 
    quantity: Number, 
    userId: String // hangi kullanıcının eklediğini tutmak için
});

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;