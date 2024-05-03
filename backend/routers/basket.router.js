const express = require('express');
const router = express.Router();
const response = require('../services/response.service');
const Basket = require('../models/basket');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product');


// Sepete ürün ekleme -> /api/basket/add
router.post('/add', async (req, res) => {
    response(res, async () => {
        const {userId, productId, price, quantity} = req.body; //body'den gelen verileri alıp değişkenlere atıyoruz

        let basket = new Basket();
        basket._id = uuidv4();
        basket.userId = userId;
        basket.productId = productId;
        basket.price = price;
        basket.quantity = quantity;

        await basket.save(); //async bir işlem olduğu için await kullanıyoruz

        // Kullanıcı ürünü sepete ekledikten sonra o ürünün mevcut stoğunu azaltmalıyız
        let product = await Product.findById(productId); //productId'ye göre sepetteki ürünü buluyoruz
        product.stock -= quantity; //ürünün stok miktarını güncelliyoruz
        await Product.findByIdAndUpdate(productId, product); //ürünün stoğunu güncelledikten sonra kaydediyoruz.

        res.json({message: 'Ürün sepete başarıyla eklendi.'});
        // burda ne döndürüyorsa front-end kısmında basket.service.ts dosyasındaki add metodunda da o tipte dönmesi gerekiyor.
        // Mesela sadece message dönderdiği için orada da MessageResponseModel tipinde dönüş yapılmalı.
        // add(,callback: (res: MessageResponseModel) => void)
        //  this._http.post<MessageResponseModel>...
        // kısımları bu şekilde olmalı
    });
});


// Sepetten ürün silme -> /api/basket/removeById
router.post('/removeById', async (req, res) => {
    response(res, async () => {
        const {_id} = req.body; // body'den gelen id'yi alıyor

        let basket = await Basket.findById(_id); //id'ye göre sepetteki mevcut ürünü bulur

        // Kullanıcı ürünü sepetten sildikten sonra o ürünün mevcut stoğunu arttırmalıyız
        let product = await Product.findById(basket.productId); //ürünü bulur
        product.stock += basket.quantity; //ürünün stok miktarını arttırıyoruz.
        await Product.findByIdAndUpdate(basket.productId, product); 

        await Basket.findByIdAndDelete(_id); //id'ye göre ürünü siliyoruz

        res.json({message: "Ürünü sepetten başarıyla kaldırıldı!"});
    });
}); 


// Sepetteki tüm ürünleri listeleme -> /api/basket/
router.post('/', async (req, res) => {
    response(res, async () => {
        const {userId} = req.body; //body'den gelen userId'yi alıyoruz. Hangi kullanıcının sepet listesini aldığını bilmek için. Yani o kullanıcının sepetindeki ürünleri getirmeceğiz

        const baskets = await Basket.aggregate([
            {
                $match: {userId: userId} //userId'ye göre sepeti eşleştiriyoruz
            },
            {
                $lookup: {
                    from: 'products', //products collection'ından
                    localField: 'productId', //productId'ye göre
                    foreignField: '_id', //id'ye eşit olan
                    as: 'products' //product adıyla yeni bir alan oluşturuyoruz
                }
            }
        ]);

        res.json(baskets); //bulunan sepeti döndürüyoruz
        // Bunda da mesela front-end kısmında basket.service.ts dosyasındaki getAll metodunda dönüş tipi olarak BasketModel[] tipinde dönmesi gerekiyor. Çünkü burda o tipte dönüş yapılıyor.
        // getAll(callback: (res: BasketModel[]) => void)
        //  this._http.post<BasketModel[]>...
    });
});

// Sepetteki ürün sayısını getirir -> /api/basket/getCount
router.post('/getCount', async(req, res) => {
    response(res, async () => {
        const {userId} = req.body; //body'den gelen userId'yi alıyoruz. Hangi kullanıcının sepetinde kaç ürün olduğunu bilmek için
        const count = await Basket.find({userId: userId}).count(); //userId'ye göre sepeti eşleştirip sayısını döndürüyoruz


        res.json({count: count}); // direk count diye vermiyoruz. Bunun sebebi: string, integer veya boolean tarzı json formatlarını bir objeye yerleştirmeden Angular tarafına yollarsak Angular bunu hata olarak algılar. O yüzden mutlaka bir obje içerisine yerleştirip o şekilde karşı tarafa göndermemiz gerekiyor.
    });
});

module.exports = router; 
