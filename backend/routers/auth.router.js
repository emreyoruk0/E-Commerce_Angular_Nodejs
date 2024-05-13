// Kullanıcı kaydı ve girişi için tanımlanan API'lerin yönlendirilmesi için kullanılıyor.
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const {v4: uuidv4} = require('uuid'); // rastgele id oluşturmak için
const jwt = require('jsonwebtoken'); // token işlemleri için

const secretKey = "GizliAnahtar My Secret Key 2546.";
const options = {
    expiresIn: "1d" //API isteğinin 1 gün geçerli olacağını belirtir.
};

// Veriler front-end'den req.body ile gelir.
// Veriler front-end'den obje şeklinde geldiği için direk atamak yerine değişkenleri {} içinde yazıp öyle req.body'ye eşitliyoruz.

// req.body, istemci/front-end tarafından sunucuya/back-end'e gönderilen verileri içeren bir nesneyi temsil eder. İstemci (örneğin bir tarayıcı), sunucuya bir istek (GET/POST) gönderdiğinde, bu isteğin içeriği req.body içinde depolanır ve sunucu tarafından işlenebilir. Bu sayede sunucu tarafında (back-end'de), kullanıcının front-end'den gönderdiği verilere erişebilir ve bu verileri işleyebiliriz.


// localhost:5000/api/auth/register   (Kullanıcı kaydı)
router.post("/register", async (req,res)  =>{
    // async await yapısı, işlemleri sırayla yapmamızı sağlar. İşlem tamamlanana kadar bekletir.
    // mesela veritabanına kayıt yaparken kayıt işlemi tamamlanana kadar diğer işlemleri yapmaz.
    try {
        console.log(req.body); // { name: 'Mehmet', email: 'mehmet@gmail.com', password: '3' } -> front-end'den name, email ve password alınıyor.
        const user = new User(req.body); // frontend tarafından gelen verileri kullanarak yeni bir kullanıcı oluşturulur.

        // Diğer kullanıcı bilgileri otomatik olarak burada oluşturulur.
        user._id = uuidv4(); // benzersiz _id
        user.createdDate = new Date();
        user.isAdmin = false;

        const checkUserEmail = await User.findOne({email: user.email}); // await, işlem tamamlanana kadar bekletir. İşlem bitmeden sonraki satırlar çalışmaz.

        // Eğer e-posta adresi veritabanında varsa hata döndürür yoksa kayıt yapılır.
        if(checkUserEmail != null) {
            return res.status(403).json({message: "Bu e-posta adresi zaten kullanılmaktadır!."});
        } else {
            await user.save(); // await, kullanıcı kaydedilene kadar bekletir.
            const token = jwt.sign({},secretKey,options);
            let userModel = {
                token: token,
                user: user
            };
            res.json(userModel); // front-end'e userModel'i gönderir. userModel içinde token ve user bilgileri bulunur.
            // front-end'deki auth.service.ts içindeki register metodunda post<LoginResponseModel> şeklinde kullanacagız
            // LoginResponseModel'i front-end'de bu yapıda tanımladık(token ve user alanları olan bir model)
        }
    } catch(error) {
        res.status(500).json({message: error.message}); // hata varsa front-end'e {message: "hataxx"} gönderir.
    }
});


// localhost:5000/api/auth/login   (Kullanıcı girişi)
router.post("/login", async (req,res) =>{
    try{
        console.log(req.body); // { email: 'mehmet@gmail.com', password: '3' } -> front-end'den email ve password alınıyor.
        const {email, password} = req.body; // ve buradaki email ve password değişkenlerine atanıyor.
        
        let user = await User.findOne({email: email});

        if(user == null){
            res.status(403).json({message: "Bu e-mail adresine ait bir kullanıcı bulunamadı!!"});
        } else{
            if(user.password != password){
                res.status(403).json({message: "Hatalı şifre girdiniz!!"});
            } else{ // Kullanıcı bilgileri doğru ise token oluşturulur.
                const token = jwt.sign({},secretKey,options);
                let model = {
                    token: token,
                    user: user
                };
                res.json(model); // front-end'e model'i gönderir.
            }
        }
    } catch(error) {
        res.status(500).json({message: error.message}); // hata varsa front-end'e {message: "hataxx"} gönderir.
    }
});

module.exports = router;