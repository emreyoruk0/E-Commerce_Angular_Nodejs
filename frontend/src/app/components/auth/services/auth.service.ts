import { Injectable } from '@angular/core';
import { GenericHttpService } from '../../../common/services/generic-http.service';
import { LoginResponseModel } from '../models/login-response.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // http://localhost:5000/api/...
  // api/auth/login ve api/auth/register
  // backend'de API isteklerini bu URL'ler üzerinde yazdık. Bu API'lere göre get veya post işlemi yaparak veri gönderip sonuç alıyoruz veya ilgili işlemi yaptırıyoruz.

  constructor(
    private _http: GenericHttpService,
    private _router: Router,
    private _toastr: ToastrService
  ) { }

  login(model: LoginModel, callback: (res: LoginResponseModel) => void){
    this._http.post<LoginResponseModel>("auth/login", model, res => callback(res)); //api adresi, model, callback
  } // LoginResponseModel tipinde bir sonuç döner

  register(model: RegisterModel, callback: (res: LoginResponseModel) => void){
    this._http.post<LoginResponseModel>("auth/register", model, res => callback(res));
  }



  // kullanıcı giriş yapmış mı kontrolü, eğer giriş yapmışsa true döner, aksi halde login sayfasına yönlendirir
  // app.routes.ts dosyasında layouts ksımında canActivateChild: [() => inject(AuthService).checkIsAuth()] ile kullanıldı
  checkIsAuth(){
    if(typeof localStorage != 'undefined'){ // localStorage is not defined hatasını engellemek için
      if(localStorage.getItem("user")){
        return true;
      } // eğer kullanıcı giriş yapmışsa true döner yani diğer sayfalara erişim sağlayabilir
    }

    this._router.navigateByUrl("login"); // kullanıcı giriş yapmamışsa başlangıçta login sayfasına yönlendirir
    return false; // kullanıcı giriş yapmadıysa false döner yani diğer sayfalara erişim sağlayamaz
  }

  logOut(){
    this._toastr.info(`Güle Güle! ${JSON.parse(localStorage.getItem("user")).name}` ,"Çıkış Yapıldı");
    localStorage.removeItem("user"); // kullanıcı çıkış yaptığında localStorage'daki user bilgisini siler
    this._router.navigateByUrl("login"); // kullanıcı çıkış yaptığında login sayfasına yönlendirir
  }
}
