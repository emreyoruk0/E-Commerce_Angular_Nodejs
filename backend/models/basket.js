const mongoose = require('mongoose');

// Bu dosya, sepetler(Basket) için bir model oluşturur. Bu model, MongoDB veritabanında sepetler için bir şema tanımlar ve bu şemaya göre baskets adında bir collection oluşturulur.
const basketSchema = new mongoose.Schema({
    _id: String, // sepetteki her bir ürünün benzersiz _id'si Yani aynı kullanıcının sepetindeki aynı ürünlerin _id'si bile farklı olacak
    productId: String, // Sepetteki ürünün id'si
    price: Number, 
    quantity: Number, 
    userId: String // hangi kullanıcının sepeti olduğunu tutmak için
});

// MongoDb'de Basket adında ve yukarıdaki yapıda(_id, productId, price, quantity ve usrId alanları olan) bir collection oluşturuluyor.

const Basket = mongoose.model('Basket', basketSchema);

module.exports = Basket;