const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true,
        unique: true, // benzersiz olmalı
    }
});

// MongoDb'de Category adında ve yukarıdaki yapıda(_id ve name alanı olan) bir collection oluşturuluyor.

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;