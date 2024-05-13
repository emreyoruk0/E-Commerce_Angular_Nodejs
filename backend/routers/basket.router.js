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

        res.json({message: "Ürünü sepetten başarıyla kaldırıldı!"}); // front-end'e {message: ""} gönderir
        // post<MessageResponseModel> şeklinde kullanacagız orda
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
        console.log(req.body); // { _id: 'uuidv4 ile oluşturulan benzersiz id', quantity: 'ürün adedi', a: '1 veya -1'}
        const {_id, quantity, decOrInc} = req.body; // req.body'den _id ve quantity'yi alıyoruz

        // decOrInc-> decrease or increase
        // decOrInc ile (+) butonuna basıldıysa 1, (-) butonuna basıldıysa -1 gelecek.

        let selectedBasket = await Basket.findById(_id); // benzersiz _id'ye göre sepeti bulur
        selectedBasket.quantity = quantity;

        let product = await Product.findById(selectedBasket.productId); // sepetteki ilgili ürünü bulur

        // ürün adedi 1'den 0'a düşürülürse ürün sepetten silinecek ve o ürünün stoğu arttırılacak
        if(selectedBasket.quantity <= 0){
            product.stock += 1;
            await Product.findByIdAndUpdate(selectedBasket.productId, product);

            await Basket.findByIdAndDelete(_id); 
            res.json({message: "Ürün adedi 0'a düşürüldüğü için sepetten kaldırıldı!"});
        } else { // ürün adedi 0'dan büyükse o ürünün stoğu artırılacak veya azaltılacak ve sepetteki ürün adedi güncellenecek ve 
            product.stock -= decOrInc; // decOrInc = 1 veya -1, basılan butone göre
            await Product.findByIdAndUpdate(selectedBasket.productId, product);

            await Basket.findByIdAndUpdate(_id, selectedBasket); // benzersiz _id'ye göre sepetteki ürünü günceller
            res.json({message: "Ürün adedi başarıyla güncellendi!"});
        }    
    });
});


// Sepetteki tüm ürünleri silme -> /api/baskets/clearAllBasket
router.post('/clearAllBasket', async (req, res) => {
    response(res, async () => {
        const {userId} = req.body; // req.body'den userId'yi alıyoruz

        let baskets = await Basket.find({userId: userId}); // userId'ye göre kullanıcının sepetini bulur

        // Kullanıcı sepetini temizledikten sonra o ürünlerin mevcut stoğunu artırıyoruz.
        for(let basket of baskets){
            let product = await Product.findById(basket.productId);
            product.stock += basket.quantity;
            await Product.findByIdAndUpdate(basket.productId, product)
        }

        await Basket.deleteMany({userId: userId}); // userId'ye göre kullanıcının sepetini boşaltır
        res.json({message: "Sepet başarıyla temizlendi!"});
    });
});

module.exports = router; 
