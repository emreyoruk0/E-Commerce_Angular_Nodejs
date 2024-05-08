const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
    _id: String, // Sepetin id'si
    productId: String, // Sepetteki ürünün id'si
    price: Number, 
    quantity: Number, 
    userId: String // hangi kullanıcının sepeti olduğunu tutmak için
});

// MongoDb'de Basket adında ve yukarıdaki yapıda(_id, productId, price, quantity ve usrId alanları olan) bir collection oluşturuluyor.

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;