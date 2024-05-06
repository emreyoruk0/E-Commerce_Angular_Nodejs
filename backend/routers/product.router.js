const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const {v4: uuidv4} = require('uuid');
const fs = require('fs'); // Dosya işlemleri için kullanılır.
const upload = require('../services/file.service');
const response = require('../services/response.service'); //response fonksiyonunu import eder


//Ürün Ekleme --> /api/products/add
// upload.array("images") parametresi -> birden fazla resim yüklemek için kullanılır.
router.post('/add', upload.array("images"), async (req, res) => {
    response(res, async ()=>{
        const {name, stock, price, categories} = req.body; //body'den eklenecek ürünün adını, stok miktarını, fiyatını ve kategorilerini alır

        const productId = uuidv4();
        let product = new Product({ //yeni bir ürün oluşturur
            _id: productId,
            name: name.toUpperCase(),
            stock: stock,
            price: price,
            categories: categories,
            isActive: true,
            imageUrls: req.files, //upload.array("images") parametresi ile alınan resimler
            createdDate: new Date()
        }); //eklenecek ürünün özelliklerini belirler
        await product.save(); //yeni ürünü kaydeder

        res.json({message: 'Ürün başarıyla eklendi.'});
    });
});


// Ürün silme --> /api/products/removeById
router.post('/removeById', async (req, res) => {
    response(res, async () => {
        const {_id} = req.body; //body'den silinecek ürünün _id'sini alır

        const product = await Product.findById(_id); //id'si verilen ürünü bulur
        
        for(const image of product.imageUrls){
            fs.unlink(image.path, () => {}); //ürüne ait resimleri siler
        }

        await Product.findByIdAndDelete(_id); //ürünün kendisini siler
        res.json({message: 'Ürün başarıyla silindi.'});
    });
}); 


// Ürün Listesi Getirme --> /api/products/
router.post("/", async (req, res) => {

    // pagination yapısına uygun şekilde ürünleri getirir. Mesela aranan kelimeyle eşleşen ürünler veya sadece ilgili sayfadaki ürünler(3/20 vs) gibi...
    // base practise olarak bu şekilde olmalı (ileri seviye)
    response(res, async () => {
        const {pageNumber, pageSize, search} = req.body; //body'den sayfa numarasını, sayfa boyutunu ve arama kelimesini alır

        //arama sonucuna göre ürün sayısını bulur
        let productCount = await Product.find({
            $or: [
                {
                    name: { $regex: search, $options: 'i' }
                }
            ]
        }).count(); 

        //arama sonucuna göre ürünleri bulur ve sayfa numarasına göre sıralar
        let products = await Product.find({
            $or: [
                {
                    name: { $regex: search, $options: 'i' }
                }
            ]
        }).sort({name: 1})
        .populate('categories')
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize); 

        let totalPageCount = Math.ceil(productCount / pageSize); //toplam sayfa sayısını bulur

        //bulunan ürünleri ve sayfa bilgilerini model'e atar"
        let model = {
            datas: products,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPageCount: totalPageCount,
            isFirstPage: pageNumber == 1 ? true : false,
            isLastPage: totalPageCount == pageNumber ? true : false
        }

        res.json(model); //bulunan ürünleri ve sayfa bilgilerini döndürür
    });
});



// Ürünün Aktiflik Durumunu Değiştirme --> /api/products/changeActiveStatus
router.post('/changeActiveStatus', async (req, res) => {
    response(res, async () => {
        const {_id} = req.body; //body'den aktiflik durumu değiştirilecek ürünün _id'sini alır
        let product = await Product.findById(_id); //id'si verilen ürünü bulur
        product.isActive = !product.isActive; //ürünün aktiflik durumunu tersine çevirir

        await Product.findByIdAndUpdate(_id, product); // _id'si verilen ürünü yukarıda oluşturduğumuz product nesnesiyle günceller
        res.json({message: 'Ürünün aktiflik durumu başarıyla değiştirildi.'});
    });
});


// Ürünü Id'ye Göre Getirme --> /api/products/getById
router.post("/getById", async (req, res) =>{
    response(res, async () => {
        const {_id} = req.body; //body'den ürünün _id'sini alır
        let product = await Product.findById(_id); //id'si verilen ürünü bulur
        res.json(product); // ürünü geri döndürür
    });
});


// Ürün Güncelleme --> /api/products/update
router.post("/update", upload.array("images"), async (req, res) => {
    response(res, async () => {
        const {_id, name, stock, price, categories} = req.body; //body'den güncellenecek ürünün _id'sini, adını, stok miktarını, fiyatını ve kategorilerini alır
        let product = await Product.findById(_id); //id'si verilen güncellenecek ürünü bulur

        //ürüne ait resimleri siler
        // for(const image of product.imageUrls){
        //     fs.unlink(image.path, () => {}); 
        // }

        // yeni resimler upload.array("images") parametresi ile alınır ve eski resimlerle birleştirilir
        // req.files -> upload.array("images") ile alınan resimleri döndürür
        let imageUrls;
        imageUrls = [...product.imageUrls, ...req.files]; //eski ve yeni resimleri birleştirir

        //güncellenecek ürünün yeni özelliklerini belirler
        product = {
            name: name.toUpperCase(),
            stock: stock,
            price: price,
            imageUrls: imageUrls,
            categories: categories
        };

        await Product.findByIdAndUpdate(_id, product); // _id'si verilen ürünü yukarıda oluşturduğumuz product nesnesiyle günceller
        res.json({message: 'Ürün başarıyla güncellendi.'}); // geriye mesaj döndürür
    });
});



// Ürün resmi silme --> /api/products/removeImageByProductIdAndIndex
router.post('/removeImageByProductIdAndIndex', async (req, res) => {
    response(res, async () => {
        const {_id, index} = req.body; //body'den resmi silinecek ürünün _id'sini ve index'ini(seçilen resmi) alır

        let product = await Product.findById(_id); //id'si verilen ürünü bulur

        if(product.imageUrls.length == 1){
            res.status(500).json({message: 'Son ürün resmini silemezsiniz! Ürün en az bir resme sahip olmalıdır.'});
        } else {
            let image = product.imageUrls[index]; //index'ine göre seçili resmi resmi bulur
            product.imageUrls.splice(index, 1); //seçili resmi resimlerden isim olarak siler
            await Product.findByIdAndUpdate(_id, product); // _id'si verilen ürünü resim silindikten sonra günceller(product nesnesiyle)
            fs.unlink(image.path, () => {}); //seçili resmi fiziki olarak siler
            
            res.json({message: 'Resim başarıyla silindi.'}); //geriye mesaj döndürür
        }
    });
});


// Ana sayfa için ürün listesini getirme --> /api/products/getAllForHomePage
router.post("/getAllForHomePage", async (req, res) => {
    response(res, async () => {
        const {pageNumber, pageSize, search, categoryId, priceFilter} = req.body;
        let products;

        // Filtreleme yoksa
        if(priceFilter == "0"){
            products = await Product
               .find({
                    isActive: true, //sadece aktif ürünleri getirir
                    categories: { $regex: categoryId, $options: 'i' }, //categoryId'ye göre ürünleri getirir
                    $or: [
                        {
                            name: { $regex: search, $options: 'i' }
                        }
                    ] //arama kelimesine göre ürünleri getirir
               })
               .sort({name: 1}) //ürünleri isimlerine göre sıralar
               .populate('categories'); //kategorileri getirir
        } else{
            products = await Product
               .find({
                    isActive: true,
                    categories: { $regex: categoryId, $options: 'i' },
                    $or: [
                        {
                            name: { $regex: search, $options: 'i' }
                        }
                    ]
               })
               .sort({price: Number(priceFilter)}) //fiyat filtrelemesine göre ürünleri sıralar(artan-azalan)(1/-1)
               .populate('categories');
        }

        res.json(products); 
    });
});

module.exports = router;
