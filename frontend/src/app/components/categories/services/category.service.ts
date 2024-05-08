import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { CategoryModel } from '../models/category.model';
import { MessageResponseModel } from '../../../common/models/message.response.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  // http://localhost:5000/api/...
  // api/categories/, api/categories/add, api/categories/update ve api/categories/removeById
  // backend'de API isteklerini bu URL'ler üzerinde yazdık. Bu API'lere göre get veya post işlemi yaparak veri gönderip sonuç alıyoruz veya ilgili işlemi yaptırıyoruz.

  constructor(
    private _http: GenericHttpService
  ) { }

  // tüm kategorileri getirir
  getAll(callback: (res: CategoryModel[]) => void){
    this._http.get<CategoryModel[]>('categories/', res => callback(res)); // CategoryModel[] tipinde bir dizi döner
  }


  add(name: string, callback: (res: MessageResponseModel) => void){
    let model = {name: name}; //yeni kategorinin adı
    this._http.post<MessageResponseModel>('categories/add', model, res => callback(res)); // MessageResponseModel tipinde bir mesaj dönderir sadece
  }

  update(model: CategoryModel, callback: (res: MessageResponseModel) => void){
    this._http.post<MessageResponseModel>('categories/update', model, res => callback(res)); // api adresi, güncellenecek model, callback fonksiyonu
  }

  removeById(_id: string, callback: (res: MessageResponseModel) => void){
    let model = {_id: _id}; //silinecek kategorinin id'si
    this._http.post<MessageResponseModel>('categories/removeById', model, res => callback(res));
  }
}
