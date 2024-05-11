const express = require('express');
const router = express.Router();
const response = require('../services/response.service');
const Basket = require('../models/basket');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product');

// Veriler front-end'den req.body ile gelir.
// Veriler front-end'den obje şeklinde geldiği için direk atamak yerine değişkenleri {} içinde yazıp öyle req.body'ye eşitliyoruz.

// req.body, istemci/front-end tarafından sunucuya/back-end'e gönderilen verileri içeren bir nesneyi temsil eder. İstemci (örneğin bir tarayıcı), sunucuya bir istek (GET/POST) gönderdiğinde, bu isteğin içeriği req.body içinde depolanır ve sunucu tarafından işlenebilir. Bu sayede sunucu tarafında (back-end'de), kullanıcının front-end'den gönderdiği verilere erişebilir ve bu verileri işleyebiliriz.


// Sepete ürün ekleme -> /api/baskets/add
router.post('/add', async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { userId: 'kullanıcının id'si', productId: 'ürünün id'si', price: 'ürünün fiyatı', quantity: 'ürünün adedi' }
        const {userId, productId, price, quantity} = req.body; // req.body'den userId, productId, price ve quantity kısımlarını alıp burdaki değişkenlere atıyoruz

        let basket = new Basket();
        basket._id = uuidv4(); // _id, uuidv4() metodu ile benzersiz bir şekilde oluşturulur. Aynı sepetteki aynı ürünler için bile farklı bir _id oluşturulur.
        basket.userId = userId; // frontend'den gelen userId'yi yeni oluşturulan Basket nesnesinin userId'sine atıyoruz
        basket.productId = productId;
        basket.price = price;
        basket.quantity = quantity;
        
        await basket.save(); //async bir işlem olduğu için await kullanıyoruz. await sayesinde işlem tamamlananmadan sonraki işlemlere geçilmez. Yani burda save işlemi tamamlanmadan alttaki işlemlere geçilmez.

        // Kullanıcı ürünü sepete ekledikten sonra o ürünün mevcut stoğunu azaltmalıyız
        let product = await Product.findById(productId); //productId'ye göre sepetteki ürünü buluyoruz
        product.stock -= quantity; 
        await Product.findByIdAndUpdate(productId, product); //ürünün stoğunu azalttıktan sonra güncelliyoruz.

        res.json({message: 'Ürün sepete başarıyla eklendi.'});  // front-end'e {message: ""} gönderir
        // burda ne gönderiyorsa front-end kısmında basket.service.ts'deki add metodunda da o tipte dönmesi gerekiyor.
        // Mesela sadece message dönderdiği için orada da MessageResponseModel tipinde dönüş yapılmalı.
        // add(,callback: (res: MessageResponseModel) => void)
        //  this._http.post<MessageResponseModel>...
        // kısımları bu şekilde olmalı
    });
});


// Sepetten ürün silme -> /api/baskets/removeById
router.post('/removeById', async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { _id: 'uuidv4 ile oluşturulan benzersiz id' }
        const {_id} = req.body; // req.body'den _id'yi alıyor

        let basket = await Basket.findById(_id); // benzersiz _id'ye göre sepetteki seçilen ürünü bulur

        // Kullanıcı ürünü sepetten sildikten sonra o ürünün mevcut stoğunu arttırmalıyız
        let product = await Product.findById(basket.productId); // sepetteki silinmek istenen ürünü bulur
        product.stock += basket.quantity;
        await Product.findByIdAndUpdate(basket.productId, product); //ürünün stoğunu arttırdıktan sonra güncelliyoruz.

        await Basket.findByIdAndDelete(_id); // _id'ye göre sepetten seçilen ürünü siler

        res.json({message: "Ürünü sepetten başarıyla kaldırıldı!"}); //frontend'e silme işleminin başarılı olduğuna dair mesaj döndürür. post<MessageResponseModel> şeklinde kullanacagız orda
    });
}); 


// Sepetteki tüm ürünleri listeleme -> /api/baskets/
router.post('/', async (req, res) => {
    response(res, async () => {
        //console.log(req.body); // { userId: 'kullanıcının id'si' }
        const {userId} = req.body; // req.body'den userId'yi alıyoruz. Hangi kullanıcının sepet listesini aldığını bilmek için. Yani o kullanıcının sepetindeki ürünleri getirecek

        // aggregate metodu, MongoDB'de join işlemi yapmamızı sağlar
        const baskets = await Basket.aggregate([
            {
                $match: {userId: userId} //userId'ye göre sepeti eşleştiriyoruz (join işlemi)
            },
            {
                $lookup: {
                    from: 'products', // products collection'ından
                    localField: 'productId', // baskets collection'undaki productId alanı
                    foreignField: '_id', // products collection'undaki _id alanı
                    as: 'products' // baskets collection'unda products adıyla yeni bir alan oluşturuyoruz
                }
                // Bu işlem, baskets collection'ındaki productId alanı ile products collection'ındaki _id alanını eşleştirir ve bu iki collection'ı birleştirir. 
            }
        ]);
        
        res.json(baskets); // front-end'e baskets'i gönderir
        // Bunda da mesela front-end kısmında basket.service.ts dosyasındaki getAll metodunda dönüş tipi olarak BasketModel[] tipinde dönmesi gerekiyor. Çünkü burda o tipte dönüş yapılıyor.
        // getAll(callback: (res: BasketModel[]) => void)
        //  this._http.post<BasketModel[]>...
    });
});

// Sepetteki ürün sayısını getirir -> /api/baskets/getCount
router.post('/getCount', async (req, res) => {
    response(res, async () => {
        //console.log(req.body); // { userId: 'kullanıcının id'si' }
        const {userId} = req.body; // req.body'den userId'yi alıyoruz. Hangi kullanıcının sepetinde ürün olduğunu bilmek için

        const count = await Basket.find({userId: userId}).count(); //userId'ye göre sepeti eşleştirip sayısını döndürüyoruz

        res.json({count: count});  // front-end'e {count: count} gönderir
        // direk count diye vermiyoruz. Bunun sebebi: string, integer veya boolean tarzı json formatlarını bir objeye yerleştirmeden Angular tarafına yollarsak Angular bunu hata olarak algılar. O yüzden mutlaka bir obje içerisine yerleştirip o şekilde karşı tarafa göndermemiz gerekiyor.
    });
});




// Sepetteki ürün adedini güncelleme -> /api/baskets/changeQuantityById
router.post('/changeQuantityById', async (req, res) => {
    response(res, async () => {
        console.log(req.body); // { _id: 'uuidv4 ile oluşturulan benzersiz id', quantity: 'ürün adedi' }
        const {_id, quantity} = req.body; // req.body'den _id ve quantity'yi alıyoruz

        let basket = await Basket.findById(_id); // benzersiz _id'ye göre sepetteki seçilen ürünü bulur
        basket.quantity = quantity;

        if(basket.quantity <= 0){
            await Basket.findByIdAndDelete(_id); // eğer quantity 0'dan küçükse sepetten ürünü siler
            res.json({message: "Ürün sepetten başarıyla kaldırıldı!"});
            return;
        }

        await Basket.findByIdAndUpdate(_id, basket); // benzersiz _id'ye göre sepetteki ürünü günceller
        res.json({message: "Ürün adedi başarıyla güncellendi!"});
    });
});

module.exports = router; 
