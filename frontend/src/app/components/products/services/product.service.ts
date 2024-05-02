import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { MessageResponseModel } from '../../../common/models/message.response.model';
import { RequestModel } from '../../../common/models/request.model';
import { PaginationResultModel } from '../../../common/models/pagination-result.model';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // http://localhost:5000/api/...
  // api/products/, api/products/add, api/products/removeById, api/products/changeIsActive, api/products/getById,  api/products/update, api/products/removeImageByProductIdAndIndex ve api/products/getAllForHomePage
  // backend'de API isteklerini bu URL'ler üzerinde yazdık. Bu API'lere göre get veya post işlemi yaparak veri gönderip sonuç alıyoruz veya ilgili işlemi yaptırıyoruz.

  constructor(
    private _http: GenericHttpService
  ) { }

  // Ürün ekleme
  add(model: FormData, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>('products/add', model, res => callback(res));
  } // post ile MessageResponseModel tipinde sonucu dönderir sadece

  //Ürün güncelleme
  update(model: FormData, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>('products/update', model, res => callback(res));
  }

  getAll(model: RequestModel, callback: (res: PaginationResultModel<ProductModel[]>) => void){
    this._http.post<PaginationResultModel<ProductModel[]>>('products/', model, res => callback(res));
  } // post ile ProductModel[] listesi/dizisi dönderir
  // pagination yapısı kullandığımız için direk ProductModel[] vermek yerine önce PaginationResultModel içerisine ProductModel[] gönderip onu dönderiyoruz.


  // Ürün silme
  removeById(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>('products/removeById', model, res => callback(res));
  }


  // Ürünün aktiflik durumunu değiştirme
  changeActiveStatus(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>('products/changeActiveStatus', model, res => callback(res));
  }


  // id'ye göre ürün getirme
  getById(model: any, callback: (res: ProductModel) => void){
    this._http.post<ProductModel>('products/getById', model, res => callback(res));
  } // post ile ProductModel tipinde ürünü dönderir


  // Üründen resim silme(ürün id'si ve resim index'i ile silme işlemi yapılır)
  removeImageByProductIdAndIndex(model: any, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>('products/removeImageByProductIdAndIndex', model, res => callback(res));
  }

  // Anasayfa için ürünleri getirme
  getAllForHomePage(model: RequestModel, callBack: (res: ProductModel[])=> void){
    this._http.post<ProductModel[]>("products/getAllForHomePage", model, res=> callBack(res));
  }
}
