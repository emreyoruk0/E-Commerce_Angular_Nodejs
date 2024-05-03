const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const Order = require('../models/order');
const Basket = require('../models/basket');
const response = require('../services/response.service');


router.post('/create', async(req, res) => {
    response(res, async () => {
        const {userId} = req.body; // body'den userId'yi alır
        let baskets = await Basket.find({userId: userId}); // kullanıcının sepetindeki ürünleri getirir

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

        res.json({message: 'Siparişiniz başarıyla oluşturuldu.'}); // mesaj döndürür
        // bu yüzden front-end kısmındaki order.service.ts içindeki create metodunda MessageResponseModel döndürmesi gerek
        // create(callback: (res: MessageResponseModel) => void)
        //  this._http.post<MessageResponseModel>...
    });
});


router.post('/', async(req, res) => {
    response(res, async () => {
        const {userId} = req.body;
        let orders = await Order.aggregate([
            {
                $match: {userId: userId} //userId'ye göre siparişi eşleştiriyoruz
            },
            {
                $lookup: {
                    from: 'products', //products collection'ından
                    localField: 'productId', //productId'ye göre
                    foreignField: '_id', //id'ye eşit olan
                    as: 'products' //product adıyla yeni bir alan oluşturuyoruz
                }
            }
        ])
        .sort({createdDate: -1}); //createdDate'e göre sıralama yapar. -1 sayesinde son eklenen kayıt en başa gelir.

        res.json(orders); // orders'ı döndürür
        // bu yüzden front-end kısmındaki order.service.ts içindeki getAll metodunda OrderModel[] döndürmesi gerek
        // getAll(callback: (res: OrderModel[]) => void)
        //  this._http.post<OrderModel[]>...
    });
});

module.exports = router;