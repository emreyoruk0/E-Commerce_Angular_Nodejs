const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { v4: uuidv4 } = require('uuid');


// Tüm kategorileri getirme -->  /api/categories
router.get("/", async (req, res) =>{
    try{
        const categories = await Category.find().sort({name: 1}); //tüm kategorileri bulur ve A'dan Z'ye sıralar
        res.json(categories); //mevcut kategorileri döndürür
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

// Kategori ekleme -->  /api/categories/add
router.post("/add", async (req, res) => {
    try{
        const {name} = req.body; //body'den kategori adını alır

        const checkName = await Category.findOne({name: name}); //aynı isimde kategori varsa checkName'e atanır, yoksa checkName null olur

        if(checkName != null){
            res.status(403).json({message: "Bu isimde bir kategori zaten mevcut!"}); //aynı isimde kategori varsa hata döndürür
        } else{ //aynı isimde kategori yoksa eklenir.
            const category = new Category({ //yeni bir kategori oluşturur
                _id: uuidv4(),
                name: name
            });
            await category.save(); //oluşturulan kategoriyi kaydeder
            res.json({message: "Kategori kaydı başarıyla tamamlandı!"}); //silme işleminin başarılı olduğuna dair mesaj döndürür
        }

    } catch (error){
        res.status(500).json({message: error.message});
    }
});

// Kategori silme -->  /api/categories/removeById
router.post("/removeById", async (req, res) =>{
    try{
        const {_id} = req.body; //body'den silinecek kategorinin _id'sini alır
        await Category.findByIdAndDelete(_id); //id'si verilen kategoriyi siler
        res.json({message: "Kategori başarıyla silindi!"}); 
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

// Kategori güncelleme -->  /api/categories/update
router.post("/update", async (req, res) =>{
    try{
        const {_id, name} = req.body; //body'den güncellenecek kategorinin _id'sini ve yeni adını alır
        const category = await Category.findOne({_id: _id}); //id'si verilen kategoriyi bulur

        if(category.name != name){
            const checkName = await Category.findOne({name: name}); //aynı isimde kategori varsa checkName'e atanır, yoksa checkName null olur
            if(checkName != null){
                res.status(403).json({message: "Güncelleme Hatası! Bu isimde bir kategori zaten mevcut!"}); 
            } else{ //aynı isimde bir kategori yoksa güncellenir.
                category.name = name; //kategorinin adını günceller
                await Category.findByIdAndUpdate(_id, category); //güncellenmesini sağlar
                res.json({message: "Kategori başarıyla güncellendi!"});
            }
        }
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

module.exports = router;