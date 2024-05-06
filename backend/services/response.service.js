// catch bloğu her metot için aynı olduğundan bu şekilde generic response fonksiyonu kullanarak kod tekrarını önlemiş olduk.
// response fonksiyonu parametre olarak res ve callback fonksiyonunu alır. Callback fonksiyonu try bloğu içerisinde çalıştırılır.
const response = async (res, callback) => {
    try {
        callback(); // parametre olarak gelen fonksiyon
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = response;