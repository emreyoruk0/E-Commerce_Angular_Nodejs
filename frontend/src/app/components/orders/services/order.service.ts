import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { MessageResponseModel } from '../../../common/models/message.response.model';
import { BasketService } from '../../baskets/services/basket.service';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private _http: GenericHttpService,
    private _basketService: BasketService
  ) { }


  // sipariş oluşturma
  create(callback: (res: MessageResponseModel) => void){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let model = {userId: user._id};

    this._http.post<MessageResponseModel>("orders/create", model, res =>{
      this._basketService.getCount(); // sipariş eklendikten sonra sepetteki ürün sayısı güncellenir
      callback(res);
    });
  }

  // tüm siparişleri getirme
  getAll(callback: (res: OrderModel[]) => void){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let model = {userId: user._id};

    this._http.post<OrderModel[]>("orders", model, res =>{
      callback(res);
    });
  }

}
