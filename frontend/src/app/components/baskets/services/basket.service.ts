import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { BasketModel } from '../models/basket.model';
import { MessageResponseModel } from '../../../common/models/message.response.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  // http://localhost:5000/api/...
  // api/baskets/, api/baskets/add, api/baskets/removeById, api/baskets/getCount, api/baskets/changeQuantityById ve api/baskets/clearAllBasket
  // backend'de API isteklerini bu URL'ler üzerinde yazdık. Bu API'lere göre get veya post işlemi yaparak veri gönderip sonuç alıyoruz veya ilgili işlemi yaptırıyoruz.

  count: number = 0;

  constructor(
    private _http: GenericHttpService
  ) { }

  // Kullanıcı giriş yaptığında localStorage'a token ve user bilgileri atılıyordu. Burada da bu bilgileri kullanarak ilgili kullanıcının sepetini getiriyoruz.
  // localStorage'de bilgiler string olarak tutulur.
  // localStorage'de tutulan bilgileri kullanabilmek için önce JSON'a çevirmemiz gerek.
  // bunu da JSON.parse() metodu ile yapıyoruz.

  // mevcut kullanıcının sepetini getirir | BasketModel[] dizisi dönderir
  getAll(callback: (res: BasketModel[]) => void){
    let userString = localStorage.getItem("user"); // local storage'dan kullanıcı bilgisini alır (string olarak)
    let user = JSON.parse(userString); // string olan kullanıcı bilgilerini JSON'a çevirir

    // back-end'de http://localhost:5000/api/baskets/ adresinde yazılmış metot bu gönderdiğimiz modeli alacak ve ilgili kullanıcının sepetini getirecek.
    let model = {userId: user._id};
    this._http.post<BasketModel[]>("baskets/", model, res => callback(res));
  }

  getCount(){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);

    let model = {userId: user._id};
    this._http.post<any>("baskets/getCount", model, res => this.count = res.count); // res.json({count: count}); demiştik
  }


  add(model: BasketModel, callback: (res: MessageResponseModel) => void){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);

    model.userId = user._id;
    this._http.post<MessageResponseModel>("baskets/add", model, res => {
      this.getCount(); // sepete ürün eklendikten sonra sepetteki ürün sayısını günceller
      callback(res);
    });
  }


  removeById(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>("baskets/removeById", model, res=> {
      this.getCount();
      callback(res);
    });
  }


  changeQuantityById(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>("baskets/changeQuantityById", model, res => {
      this.getCount();
      callback(res);
    });
  }


  clearAllBasket(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>("baskets/clearAllBasket", model, res => {
      this.getCount();
      callback(res);
    })
  }
}
