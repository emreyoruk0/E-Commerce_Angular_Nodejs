const mongoose = require('mongoose');

// Bu dosya, kategoriler(Category) için bir model oluşturur. Bu model, MongoDB veritabanında kategoriler için bir şema tanımlar ve bu şemaya göre categories adında bir collection oluşturulur.
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