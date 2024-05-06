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

// localhost:5000/api/auth/register   (Kullanıcı kaydı)
router.post("/register", async(req,res)  =>{
    // async await yapısı, işlemleri sırayla yapmamızı sağlar. İşlem tamamlanana kadar bekletir.
    // mesela veritabanına kayıt yaparken kayıt işlemi tamamlanana kadar diğer işlemleri yapmaz.
    try {
        const user = new User(req.body); // frontend tarafından gelen verileri kullanarak yeni bir kullanıcı oluşturulur.
        console.log(req.body); // { name: 'Mehmet', email: 'mehmet@gmail.com', password: '3' } -> front-end'den name, email ve password alınıyor.

        // Diğer kullanıcı bilgileri otomatik olarak burada oluşturulur.
        user._id = uuidv4();
        user.createdDate = new Date();
        user.isAdmin = false;

        const checkUserEmail = await User.findOne({email: user.email}); // await, işlem tamamlanana kadar bekletir. İşlem bitmeden sonraki satırlar çalışmaz.

        // Eğer e-posta adresi veritabanında varsa hata döndürür yoksa kayıt yapılır.
        if(checkUserEmail != null) {
            return res.status(403).json({message: "Bu e-posta adresi zaten kullanılmaktadır!."});
        } else {
            await user.save(); // await, kullanıcı kaydedilene kadar bekletir.
            const token = jwt.sign({},secretKey,options);
            let model = {
                token: token,
                user: user
            };
            res.json(model); // kayıt işlemi başarılı ise kullanıcı bilgileri ve token döndürülür.
        }
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

// localhost:5000/api/auth/login   (Kullanıcı girişi)
router.post("/login", async(req,res) =>{
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
                res.json(model);
            }
        }
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = router;