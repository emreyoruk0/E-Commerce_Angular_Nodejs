import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {

  apiUrl: string = 'http://localhost:5000/api';
  constructor(
    private _http: HttpClient
  ) { }

  get<T>(api: string, callback: (res:T)=> void){
    this._http.get<T>(`${this.apiUrl}/${api}`).subscribe({
      next: (res:T) => callback(res),
      error: (err:HttpErrorResponse) => console.log(err)
    });
  }

  post<T>(api: string, model:T, callback: (res:T)=> void){
    this._http.post<T>(`${this.apiUrl}/${api}`, model, {}).subscribe({
      next: (res:T) => callback(res),
      error: (err:HttpErrorResponse) => console.log(err)
    });
  }
}
