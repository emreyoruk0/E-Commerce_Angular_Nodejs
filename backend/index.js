// Uygulama başlatma ve bağlantı işlemleri yapılıyor.
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./database/db');

app.use(express.json());
app.use(cors());

const authRouter = require('./routers/auth.router'); 
const categoryRouter = require('./routers/category.router');

app.use("/api/auth", authRouter); // api/auth/register ve api/auth/login isteklerini yönlendirir.
app.use("/api/categories", categoryRouter); // api/categories/add, api/categories/removeById, api/categories/update ve api/categories/getAll isteklerini yönlendirir.

connection();



const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Uygulama http://localhost: ${port} portunda çalışıyor.`);
});