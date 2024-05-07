import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {

  apiUrl: string = 'http://localhost:5000/api';
  constructor(
    private _http: HttpClient,
    private _toastr: ToastrService,
    private _spinner: NgxSpinnerService
  ){ }

  // T -> Genel tür (Generic type) parametresidir.
  // Genel türler, farklı veri türleriyle çalışabilen ve yeniden kullanılabilir kod yazmamızı sağlar. Bu sayede aynı get/post işlevini farklı veri türleri için aynı kodu çoğaltmadan kullanabiliriz.
  // Özetle, T, farklı veri türleriyle çalışabilen esnek bir işlev oluşturmamıza olanak tanır ve çağırırken sağladığımız özel türe adapte olur.

  get<T>(api: string, callback: (res: T) => void){
    this._spinner.show();
    this._http.get<T>(`${this.apiUrl}/${api}`).subscribe({
      next: (res: T) => {
        callback(res);
        this._spinner.hide();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this._toastr.error(err.error.message);
        this._spinner.hide();
      }
    });
  }

  post<T>(api: string, model: any, callback: (res: T) => void){
    this._spinner.show();
    this._http.post<T>(`${this.apiUrl}/${api}`, model, {}).subscribe({
      next: (res: T) => {
        callback(res);
        this._spinner.hide();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this._toastr.error(err.error.message);
        this._spinner.hide();
      }
    });
  }
}
