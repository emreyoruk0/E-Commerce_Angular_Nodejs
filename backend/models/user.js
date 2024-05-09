const mongoose = require('mongoose');

// Bu dosya, kullanıcılar(User) için bir model oluşturur. Bu model, MongoDB veritabanında kullanıcılar için bir şema tanımlar ve bu şemaya göre users adında bir collection oluşturulur.
const userSchema = new mongoose.Schema({
    _id: String,
    name: {
        type: String,
        required: true, //zorunlu yapmak için
    },
    email: {
        type: String,
        required: true,
        unique: true, //benzersiz yapmak için (bir e-posta adresi sadece bir kez kullanılabilmeli)
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: Boolean,
    createdDate: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;