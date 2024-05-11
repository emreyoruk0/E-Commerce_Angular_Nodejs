const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const {v4: uuidv4} = require('uuid');
const fs = require('fs'); // Dosya işlemleri için kullanılır.
const upload = require('../services/file.service'); 
const response = require('../services/response.service'); //response fonksiyonunu import eder

// Veriler front-end'den req.body ile gelir.
// Veriler front-end'den obje şeklinde geldiği için direk atamak yerine değişkenleri {} içinde yazıp öyle req.body'ye eşitliyoruz.

// req.body, istemci/front-end tarafından sunucuya/back-end'e gönderilen verileri içeren bir nesneyi temsil eder. İstemci (örneğin bir tarayıcı), sunucuya bir istek (GET/POST) gönderdiğinde, bu isteğin içeriği req.body içinde depolanır ve sunucu tarafından işlenebilir. Bu sayede sunucu tarafında (back-end'de), kullanıcının front-end'den gönderdiği verilere erişebilir ve bu verileri işleyebiliriz.


// Ürün Ekleme --> /api/products/add
// upload.array("images") parametresi -> birden fazla resim yüklemek için kullanılır.
router.post('/add', upload.array("images"), async (req, res) => {
    response(res, async ()=>{
        console.log(req.body); // { name: 'Ürün adı', stock: 'Stok miktarı', price: 'Fiyat', categories: 'Kategoriler' }
        const {name, stock, price, categories} = req.body; // req.body'den name, stock, price, categories alanlarını alır

        const productId = uuidv4();
        let product = new Product({ //yeni bir ürün oluşturur
            _id: productId,
            name: name,
            stock: stock,
            price: price,
            categories: categories,
            isActive: true,
            imageUrls: req.files, // req.files -> upload.array("images") ile alınan resimleri tutar
            createdDate: new Date()
        }); // eklenecek ürünün özelliklerini belirler

        await product.save(); // yeni ürünü kaydeder
        res.json({message: 'Ürün başarıyla eklendi.'});  // front-end'e {message: ""} gönderir. | MessageResponseModel şeklinde kullancaz
    });
});


// Ürün silme --> /api/products/removeById
router.post('/removeById', async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { _id: 'Ürün _id' }
        const {_id} = req.body; // req.body'den silinecek ürünün _id'sini alır

        const product = await Product.findById(_id); //id'si verilen ürünü bulur
        
        for(const image of product.imageUrls){
            fs.unlink(image.path, () => {});
        } //ürüne ait resimleri uploads klasöründen silmek için

        await Product.findByIdAndDelete(_id); //ürünün kendisini siler
        res.json({message: 'Ürün başarıyla silindi.'});
    });
}); 


// Ürün Listesi Getirme --> /api/products/
router.post("/", async (req, res) => {
    // pagination yapısına uygun şekilde ürünleri getirir. Mesela aranan kelimeyle eşleşen ürünler veya sadece ilgili sayfadaki ürünler(3/20 vs) gibi...
    // pagination yapısını kullanmak önemlidir çünkü tüm ürünleri tek seferde getirmek performans sorunlarına yol açabilir
    // base practise olarak bu şekilde olmalı (ileri seviye)
    response(res, async () => {
        // console.log(req.body); // { pageNumber: 'Sayfa numarası', pageSize: 'Sayfa boyutu', search: 'Arama kelimesi' }
        const {pageNumber, pageSize, search} = req.body; // req.body'den pageNumber, pageSize, search kısımlarını alır

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
                    name: { $regex: search, $options: 'i' } // arama kelimesine göre ürünleri getirir
                }
            ]
        })
        .sort({name: 1}) // A'dan Z'ye sıralar
        .populate('categories') // ürünlerin kategorilerini doldurur
        .skip((pageNumber - 1) * pageSize) // ürünleri göstermeye kaçıncı sayfadan başlayacağını belirler. 0->ilk sayfa
        .limit(pageSize); // her sayfada kaç ürün olacağını belirler

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

        res.json(model);  // front-end'e model'i gönderir
        // front-end'de aynı bu yapıda bir model oluşturduk -> PaginationResultModel
    });
});



// Ürünün Aktiflik Durumunu Değiştirme --> /api/products/changeActiveStatus
router.post('/changeActiveStatus', async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { _id: 'Ürün _id' }
        const {_id} = req.body; // req.body'den aktiflik durumu değiştirilen ürünün _id'sini alır

        let product = await Product.findById(_id); // _id'si verilen ürünü bulur
        product.isActive = !product.isActive; // ürünün aktiflik durumunu tersine çevirir

        await Product.findByIdAndUpdate(_id, product); // _id'si verilen ürünü yukarıda oluşturduğumuz product nesnesiyle günceller

        if(product.isActive){
            res.json({message: "Ürün Aktif hale getirildi!"});
        } else {
            res.json({message: "Ürün Pasif hale getirildi!"});
        }
    });
});


// Ürünü Id'ye Göre Getirme --> /api/products/getById
router.post("/getById", async (req, res) =>{
    response(res, async () => {
        console.log(req.body); // { _id: 'Ürün _id' }
        const {_id} = req.body; // req.body'den ürünün _id'sini alır
        let product = await Product.findById(_id); // _id'si verilen ürünü bulur

        res.json(product);  // front-end'e product'u gönderir | ordaki ProductModel yapısında
    });
});


// Ürün Güncelleme --> /api/products/update
router.post("/update", upload.array("images"), async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { _id: 'Ürün _id', name: 'Ürün adı', stock: 'Stok miktarı', price: 'Fiyat', categories: 'Kategoriler' }
        const {_id, name, stock, price, categories} = req.body; // req.body'den güncellenecek ürünün _id, name, stock, price, categories kısımlarını alır

        let product = await Product.findById(_id); // _id'si verilen güncellenecek ürünü bulur

        // yeni resimler upload.array("images") parametresi ile alınır ve eski resimlerle birleştirilir
        // req.files -> upload.array("images") ile alınan resimleri döndürür
        let imageUrls;
        imageUrls = [...product.imageUrls, ...req.files]; //eski ve yeni resimleri birleştirir

        // (_id ile bulunan) güncellenecek ürünün yeni özelliklerine front-end'den gelen bilgileri atayarak yeni nesne oluşturulur
        product = {
            name: name,
            stock: stock,
            price: price,
            imageUrls: imageUrls,
            categories: categories
        };

        await Product.findByIdAndUpdate(_id, product); // _id'si verilen ürünü yukarıda oluşturduğumuz product nesnesiyle günceller
        res.json({message: 'Ürün başarıyla güncellendi.'});
    });
});



// Ürün resmi silme --> /api/products/removeImageByProductIdAndIndex
router.post('/removeImageByProductIdAndIndex', async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { _id: 'Ürün _id', index: 'silinecek resmin indexi' }
        const {_id, index} = req.body; // req.body'den resmi silinecek ürünün _id'sini ve resmin index'ini(seçilen resmi) alır

        let product = await Product.findById(_id); // id'si verilen ürünü bulur

        if(product.imageUrls.length == 1){
            res.status(500).json({message: 'Son ürün resmini silemezsiniz! Ürün en az bir resme sahip olmalıdır.'});
        } else {
            let image = product.imageUrls[index]; //index'e göre seçilen resmi bulur
            product.imageUrls.splice(index, 1); //seçili resmi imageUrls'den isim olarak siler
            await Product.findByIdAndUpdate(_id, product); // _id'si verilen ürünü resim silindikten sonra günceller(product nesnesiyle)
            fs.unlink(image.path, () => {}); //seçili resmi fiziki olarak uploads klasöründen siler
            
            res.json({message: 'Resim başarıyla silindi.'});
        }
    });
});


// Ana sayfa için ürün listesini getirme --> /api/products/getAllForHomePage
router.post("/getAllForHomePage", async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { pageNumber: 'Sayfa numarası', pageSize: 'Sayfa boyutu', search: 'Arama kelimesi', categoryName: 'Kategori adı', categoryId: 'Kategori _id', priceFilter: 'Fiyat filtresi' }
        const {pageNumber, pageSize, search, categoryName, categoryId, priceFilter} = req.body;
        
        // pageNumber ve pageSize'ı kullanarak istersek pagination yapısını da oluşturabiliriz ama burada kullanmadık

        let products;
        if(priceFilter == "0"){ // Filtreleme yoksa
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
               .sort({name: 1}) //ürünleri isimlerine göre sıralar (A'dan Z'ye)
               .populate('categories'); // ürünlerin kategorilerini doldurur. Ana sayfada ürünlerin kategorilerini listeleyeceksek gerekli, onun dışında kullanılmasa da olur 
        } else {
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
               .sort({price: Number(priceFilter)}) //fiyat filtrelemesine göre ürünleri sıralar (filtre yok=0, artan=1, azalan=-1)
               .populate('categories');
        }

        res.json(products);  // front-end'e products'u gönderir
    });
});

module.exports = router;
