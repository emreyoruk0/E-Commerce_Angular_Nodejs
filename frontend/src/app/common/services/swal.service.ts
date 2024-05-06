import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  // Generic Swal Service


  callSwal(text: string, title: string, btnName: string, callback: () => void){
    Swal.fire({
      text: text,
      title: title,
      showConfirmButton: true,
      confirmButtonText: btnName,
      showCancelButton: true,
      cancelButtonText: 'Vazgeç',
      icon: 'question'
    })
    .then(res => {
      if(res.isConfirmed){ // kullanıcı confirm(onayla) butonuna tıklarsa
        callback();
      }
    });
  }
}
