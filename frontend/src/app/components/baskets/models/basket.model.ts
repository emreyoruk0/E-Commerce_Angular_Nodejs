import { ProductModel } from "../../products/models/product.model";

export class BasketModel{
  _id: string = "";
  userId: string = ""; // sepetin hangi kullanıcıya ait olduğunu tutmak için
  productId: string = "";
  products: ProductModel[] = []; // sepetin içindeki ürünleri tutmak için
  price: number = 0;
  quantity: number = 1;
}

// MongoDB'deki baskets collection'unda products alanı yok normalde. Fakat ürünleri listeleme kısmında (/api/baskets/) join işlemi yaparak products alanı oluşturup dolduruyoruz. O yüzden frontend'deki BasketModel'de de products alanını tanımlamamız gerekiyor.
