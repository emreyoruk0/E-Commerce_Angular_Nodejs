// Uygulama başlatma ve bağlantı işlemleri yapılıyor.
const express = require('express'); 
const app = express(); 
const cors = require('cors'); //farklı domainlerden gelen istekleri kabul etmek için kullanılır.
const connection = require('./database/db'); //veritabanı bağlantısı için kullanılır.
const path = require('path'); //dosya yolu işlemleri için kullanılır.

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //uploads klasörünü paylaşıma açar. resimlerin dışarıdan okunması için gerekli.

const authRouter = require('./routers/auth.router'); 
const categoryRouter = require('./routers/category.router');
const productRouter = require('./routers/product.router');
const basketRouter = require('./routers/basket.router');
const orderRouter = require('./routers/order.router');



app.use("/api/auth", authRouter); 
//  api/auth/register
//  api/auth/login
//  isteklerini yönlendirir.



app.use("/api/categories", categoryRouter); 
//  api/categories/
//  api/categories/add
//  api/categories/removeById
//  api/categories/update
//  isteklerini yönlendirir.



app.use("/api/products", productRouter); 
//  api/products/
//  api/products/add
//  api/products/removeById
//  api/products/changeActiveStatus
//  api/products/getById
//  api/products/update
//  api/products/removeImageByProductIdAndIndex
//  api/products/getAllForHomePage
//  isteklerini yönlendirir.



app.use("/api/baskets", basketRouter); 
//  api/baskets/add
//  api/baskets/removeById
//  api/baskets/
//  api/baskets/getCount
//  api/baskets/changeQuantityById 
//  api/baskets/clearAllBasket 
//  isteklerini yönlendirir.



app.use("/api/orders", orderRouter); 
//  api/orders/create
//  api/orders/
//  api/orders/cancelOrderById 
//  api/orders/cancelAllOrders
//  isteklerini yönlendirir.



connection();

const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Uygulama http://localhost: ${port} portunda çalışıyor.`);
});