const mongoose = require('mongoose');

// Bu dosya, siparişler(Order) için bir model oluşturur. Bu model, MongoDB veritabanında siparişler için bir şema tanımlar ve bu şemaya göre orders adında bir collection oluşturulur.
const orderSchema = new mongoose.Schema({
    _id: String,
    productId: String,
    price: Number,
    quantity: Number, 
    userId: String, // kimin siparişi olduğunu tutmak için
    createdDate : Date
});

// MongoDb'de Order adında ve yukarıdaki yapıda(_id, productId, price, quantity, userId ve createdDate alanları olan) bir collection oluşturulur.

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;