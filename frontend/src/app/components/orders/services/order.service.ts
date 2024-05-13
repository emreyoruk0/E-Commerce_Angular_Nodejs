import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { MessageResponseModel } from '../../../common/models/message.response.model';
import { BasketService } from '../../baskets/services/basket.service';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  // http://localhost:5000/api/...
  // api/orders/ , api/orders/create, api/orders/cancelOrderById ve api/orders/cancelAllOrders
  // backend'de API isteklerini bu URL'ler üzerinde yazdık. Bu API'lere göre get veya post işlemi yaparak veri gönderip sonuç alıyoruz veya ilgili işlemi yaptırıyoruz.

  constructor(
    private _http: GenericHttpService,
    private _basketService: BasketService
  ) { }


  // sipariş oluşturma
  create(callback: (res: MessageResponseModel) => void){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let model = {userId: user._id};

    this._http.post<MessageResponseModel>("orders/create", model, res => { // MessageResponseModel dönecek
      this._basketService.getCount(); // sipariş eklendikten sonra sepetteki ürün sayısı güncellenir
      callback(res);
    });
  }

  // tüm siparişleri getirme
  getAll(callback: (res: OrderModel[]) => void){
    let userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let model = {userId: user._id};

    this._http.post<OrderModel[]>("orders/", model, res =>{ // OrderModel[] dönecek
      callback(res);
    });
  }

  // sipariş iptal etme
  cancelOrderById(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>("orders/cancelOrderById", model, res => {
      callback(res);
    });
  }

  // tüm siparişleri iptal etme
  cancelAllOrders(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>("orders/cancelAllOrders", model, res => {
      callback(res);
    })
  }

}
