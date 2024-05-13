import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';
import { OrderModel } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { SwalService } from '../../../../common/services/swal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: OrderModel[] = [];

  constructor(
    private _orderService: OrderService,
    private _swal: SwalService,
    private _toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._orderService.getAll(res => this.orders = res);
  }


  cancelOrderById(id: string){
    this._swal.callSwal("Sipraişi iptal etmek istediğinizden emin misiniz?","Sipariş İptali", "İptal Et", () =>
      {
        let model = { _id: id }
        this._orderService.cancelOrderById(model, res => {
        this._toastr.info(res.message);
        this.getAll(); // sipariş iptal edildikten sonra sipariş listesi güncellenir
      });
    });
  }


  cancelAllOrders(){
    this._swal.callSwal("Tüm siparişleri iptal etmek istediğinizden emin misiniz?", "Tüm Siparişleri İptal Et", "İptal Et", () =>
      {
        let userString = localStorage.getItem("user");
        let user = JSON.parse(userString);

        let model = { userId: user._id }
        this._orderService.cancelAllOrders(model, res => {
          this._toastr.info(res.message);
          this.getAll();
        })
    });
  }

}



