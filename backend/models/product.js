const mongoose = require('mongoose');

// Bu dosya, ürünler(Product) için bir model oluşturur. Bu model, MongoDB veritabanında ürünler için bir şema tanımlar ve bu şemaya göre products adında bir collection oluşturulur.
const productSchema = new mongoose.Schema({
    _id: String,
    name: String,
    imageUrls: Array,
    stock: Number,
    price: Number,
    createdDate: Date,
    isActive: Boolean,
    categories: [{   
            type: String, 
            ref: 'Category'
        }] // “categories” alanı, “Category” modeline referans verir. Bu sayede bir ürünün tüm kategorilerini almak için “populate” metodunu kullanabiliriz. Tek Category de olabilir Category dizisi şeklinde de olabilir. Çünkü bir ürün birden fazla kategoriye sahip olabilir.
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;