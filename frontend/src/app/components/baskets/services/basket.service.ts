import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { BasketModel } from '../models/basket.model';
import { MessageResponseModel } from '../../../common/models/message.response.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  count: number = 0;

  constructor(
    private _http: GenericHttpService
  ) { }

  // Kullanıcı giriş yaptığında localStorage'a token ve user bilgileri atılıyordu. Burada da bu bilgileri kullanarak ilgili kullanıcının sepetini getiriyoruz.

  // ilgili kullanıcının sepetini getirir
  getAll(callback: (res: BasketModel[]) => void){
    let userString = localStorage.getItem("user"); // local storage'dan kullanıcı bilgisini alır
    let user = JSON.parse(userString); // string olan kullanıcı bilgisini json'a çevirir
    let model = {userId: user._id};
    this._http.post<BasketModel[]>("baskets", model, res => callback(res));
  }

  getCount(){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let model = {userId: user._id};
    this._http.post<any>("baskets/getCount", model, res => this.count = res.count);
  }


  add(model:BasketModel, callback: (res: MessageResponseModel) => void){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    model.userId = user._id;
    this._http.post<MessageResponseModel>("baskets/add", model, res => {
      this.getCount(); // sepete ürün eklendikten sonra sepetteki ürün sayısını günceller
      callback(res);
    });
  }


  removeById(model:any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>("baskets/removeById", model, res=> {
      this.getCount();
      callback(res);
    });
  }
}
