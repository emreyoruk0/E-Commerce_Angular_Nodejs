const multer = require('multer'); // Dosya yükleme işlemi için kullanılır.


 // storage: dosyanın nereye kaydedileceğini ve adını tutar.
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/'); // error=null(yani hata olduğunda null dönsün istiyoruz), Dosyanın kaydedileceği yer
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname); // error, Dosyanın adı. || Date.now() dosya isimlerinin çakışmaması için kullanıldı.
    }
});

const upload = multer({ storage: storage }); // yükleme işlemini yapar

module.exports = upload;