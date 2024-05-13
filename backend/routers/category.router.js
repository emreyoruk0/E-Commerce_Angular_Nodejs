const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');
const response = require('../services/response.service');

// Veriler front-end'den req.body ile gelir.
// Veriler front-end'den obje şeklinde geldiği için direk atamak yerine değişkenleri {} içinde yazıp öyle req.body'ye eşitliyoruz.

// req.body, istemci/front-end tarafından sunucuya/back-end'e gönderilen verileri içeren bir nesneyi temsil eder. İstemci (örneğin bir tarayıcı), sunucuya bir istek (GET/POST) gönderdiğinde, bu isteğin içeriği req.body içinde depolanır ve sunucu tarafından işlenebilir. Bu sayede sunucu tarafında (back-end'de), kullanıcının front-end'den gönderdiği verilere erişebilir ve bu verileri işleyebiliriz.


// Tüm kategorileri getirme -->  /api/categories/
router.get("/", async (req, res) =>{
    response(res, async () => {
        const categories = await Category.find().sort({name: 1}); //tüm kategorileri bulur ve A'dan Z'ye sıralar
        // await sayesinde işlem tamamlanana kadar bekler ve sonucu categories değişkenine atar. İşlem tamamlanmadan alt satıra geçmez!!

        res.json(categories);  // front-end'e categories'i gönderir
        // frontend'e tüm kategorileri döndürür. get<CategoryModel[]> şeklinde kullanacagız categories.service.ts'deki getAll metodunda
    });
});


// Kategori ekleme -->  /api/categories/add
router.post("/add", async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { name: 'kategori adı' }
        const {name} = req.body; // req.body'den name kısmını alır ve name'e atar

        const checkName = await Category.findOne({name: name}); //aynı isimde kategori varsa checkName'e atanır, yoksa checkName null olur

        if(checkName != null){
            res.status(403).json({message: "Bu isimde bir kategori zaten mevcut!"}); //aynı isimde kategori varsa hata döndürür
        } else{ //aynı isimde kategori yoksa eklenir.
            const category = new Category({ //yeni bir kategori nesnesi oluşturur
                _id: uuidv4(), // id uuidv4 ile oluşturulur
                name: name // name kısmına frontend'den gelen name atanır
            });
            await category.save(); //oluşturulan kategoriyi kaydeder
            // await sayesinde işlem tamamlanana kadar yani category kaydedilene kadar bekler. İşlem tamamlanmadan alt satıra geçmez!!

            res.json({message: "Kategori kaydı başarıyla tamamlandı!"}); //frontend'e {message: ""} gönderir.
            // post<MessageResponseModel> şeklinde kullanacagız categories.service.ts'deki add metodunda
        }
    });
});


// Kategori silme -->  /api/categories/removeById
router.post("/removeById", async (req, res) =>{
    response(res, async () =>{
        console.log(req.body); // { _id: 'kategori id' }
        const {_id} = req.body; // req.body'den silinecek kategorinin _id'sini alır

        await Category.findByIdAndDelete(_id); //id'si verilen kategoriyi siler
        res.json({message: "Kategori başarıyla silindi!"}); // frontend'e {message: ""} gönderir.
    });
});


// Kategori güncelleme -->  /api/categories/update
router.post("/update", async (req, res) =>{
    response(res, async () =>{
        console.log(req.body); // { _id: 'kategori id', name: 'kategorinin yeni adı' }
        const {_id, name} = req.body; // req.body'den güncellenecek kategorinin _id'sini ve yeni adını alır

        const category = await Category.findOne({_id: _id}); //id'si verilen kategoriyi bulur

        if(category.name != name){
            const checkName = await Category.findOne({name: name}); //aynı isimde kategori varsa checkName'e atanır, yoksa checkName null olur
            if(checkName != null){
                res.status(403).json({message: "Güncelleme Hatası! Bu isimde bir kategori zaten mevcut!"}); 
            } else { //aynı isimde bir kategori yoksa güncellenir.
                category.name = name; //kategorinin adını frontendden gelen name ile günceller
                await Category.findByIdAndUpdate(_id, category); //güncellenmesini sağlar
                res.json({message: "Kategori başarıyla güncellendi!"});
            }
        } else {
            res.status(403).json({message: "Lütfen eskisinden farklı bir kategori adı giriniz!"});
        }
    });
});

module.exports = router;