const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Order = require('../models/order');
const Basket = require('../models/basket');
const response = require('../services/response.service');

// Veriler front-end'den req.body ile gelir.
// Veriler front-end'den obje şeklinde geldiği için direk atamak yerine değişkenleri {} içinde yazıp öyle req.body'ye eşitliyoruz.

// req.body, istemci/front-end tarafından sunucuya/back-end'e gönderilen verileri içeren bir nesneyi temsil eder. İstemci (örneğin bir tarayıcı), sunucuya bir istek (GET/POST) gönderdiğinde, bu isteğin içeriği req.body içinde depolanır ve sunucu tarafından işlenebilir. Bu sayede sunucu tarafında (back-end'de), kullanıcının front-end'den gönderdiği verilere erişebilir ve bu verileri işleyebiliriz.


// Sipariş oluşturma(Sepet sayfasındaki Ödeme Yap butonuna bağlı fonksiyon) -> api/orders/create
router.post('/create', async (req, res) => {
    response(res, async () => {
        // console.log(req.body); // { userId: 'user id' }
        const {userId} = req.body; // req.body'den userId'yi alır

        let baskets = await Basket.find({userId: userId}); // mevcut kullanıcının sepetindeki ürünleri getirir

        // Sepetteyken Ödeme Yap dendiğinde sepetteki her bir ürün için Order nesnesi oluşturulur
        for(const basket of baskets){
            let order = new Order();
            order._id = uuidv4();
            order.productId = basket.productId;
            order.price = basket.price;
            order.quantity = basket.quantity;
            order.userId = userId;
            order.createdDate = new Date();

            await order.save(); // siparişi kaydeder

            await Basket.findByIdAndDelete(basket._id); // sepetten siparişlere eklenen ürünü siler
        }

        res.json({message: 'Siparişiniz başarıyla oluşturuldu.'}); // front-end'e {message: ""} gönderir
        // bu yüzden front-end kısmındaki order.service.ts içindeki create metodunda MessageResponseModel döndürmesi gerek
        // create(callback: (res: MessageResponseModel) => void)
        //  this._http.post<MessageResponseModel>...
    });
});


// Tüm siparişleri getirme -> api/orders/
router.post('/', async (req, res) => {
    response(res, async () => {
        // console.log(req.body); // { userId: 'user id' }
        const {userId} = req.body; // req.body'den userId'yi alır

        // aggregate metodu, MongoDB'de join işlemi yapmamızı sağlar
        let orders = await Order.aggregate([
            {
                $match: {userId: userId} //userId'ye göre siparişi eşleştiriyoruz (join işlemi)
            },
            {
                $lookup: {
                    from: 'products', // products collection'undan
                    localField: 'productId', // orders collection'undaki productId alanı
                    foreignField: '_id', // products collection'undaki _id alanı
                    as: 'products' // orders collection'unda products adıyla yeni bir alan oluşturuyoruz
                }
                // Bu işlem, orders collection'ındaki productId alanı ile products collection'ındaki _id alanını eşleştirir ve bu iki collection'ı birleştirir. 
            }
        ])
        .sort({createdDate: -1}); //createdDate'e göre sıralama yapar. -1 sayesinde son eklenen kayıt en başa gelir.

        res.json(orders); // front-end'e orders'ı gönderir
        // bu yüzden front-end kısmındaki order.service.ts içindeki getAll metodunda OrderModel[] döndürmesi gerek
        // getAll(callback: (res: OrderModel[]) => void)
        //  this._http.post<OrderModel[]>...
    });
});


// Sipariş iptali -> api/orders/cancelOrderById
router.post('/cancelOrderById', async (req, res) => {
    response(res, async () => {
        const {_id} = req.body

        await Order.findByIdAndDelete(_id);

        res.json({message: "Sipariş başarıyla iptal edildi!"});
    });
});


module.exports = router;