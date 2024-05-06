// Bu dosya MongoDB veritabanının bağlantısını sağlıyor.
const mongoose = require('mongoose');

const uri = "mongodb+srv://yorukemre01:1@ecommercedb.usgjdaw.mongodb.net/?retryWrites=true&w=majority&appName=ECommerceDb";

const connection = () => {
    mongoose.connect(uri, {}) 
            .then(() => console.log('MongoDB bağlantısı başarılı.'))
            .catch((err) => console.log("Bağlantı hatası! Hata: " + err.message));
}

module.exports = connection;