import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { LoginResponseModel } from '../models/login-response.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // http://localhost:5000/api/...
  // api/auth/login ve api/auth/register
  // backend'de API isteklerini bu URL'ler üzerinde yazdık. Bu API'lere göre get veya post işlemi yaparak veri gönderip sonuç alıyoruz veya ilgili işlemi yaptırıyoruz.

  constructor(
    private _http: GenericHttpService
  ) { }

  login(model:LoginModel, callback: (res:LoginResponseModel) => void){
    this._http.post<LoginResponseModel>("auth/login", model, res => callback(res)); //api adresi, model, callback
  }

  register(model: RegisterModel, callback: (res: LoginResponseModel) => void){
    this._http.post<LoginResponseModel>("auth/register", model, res => callback(res));
  }
}
