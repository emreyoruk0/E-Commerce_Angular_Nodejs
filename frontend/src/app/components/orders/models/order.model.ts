import { ProductModel } from "../../products/models/product.model";

export class OrderModel{
  _id: string = "";
  productId: string = ""; // siparişteki ürün id'si
  products: ProductModel[] = []; // siparişteki ürünler
  price: number = 0;
  quantity: number = 0;
  createdDate: string = "";
  userId: string = ""; // siparişi veren kullanıcı id'si
}

// MongoDB'deki orders collection'unda products alanı yok normalde. Fakat siparişleri getirme kısmında /api/orders/ join işlemi yaparak products alanı oluşturup dolduruyoruz. O yüzden frontend'deki OrderModel'de de products alanını tanımlamamız gerekiyor.
