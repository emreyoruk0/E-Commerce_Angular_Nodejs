import { Component, OnInit } from '@angular/core';
import { BasketModel } from '../../models/basket.model';
import { SharedModule } from '../../../../common/shared/shared.module';
import { BasketService } from '../../services/basket.service';
import { ToastrService } from 'ngx-toastr';
import { SwalService } from '../../../../common/services/swal.service';
import { OrderService } from '../../../orders/services/order.service';

@Component({
  selector: 'app-baskets',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './baskets.component.html',
  styleUrl: './baskets.component.css'
})
export class BasketsComponent implements OnInit{
  baskets: BasketModel[] = [];
  sum: number = 0; // sepet toplam tutarı

  constructor(
    private _basketService: BasketService,
    private _toastr: ToastrService,
    private _swal: SwalService,
    private _orderService: OrderService
  ){}

  ngOnInit(): void {
    this.getAll();
  }

  // sepeti getirir
  getAll(){
    this._basketService.getAll(res => {
      this.baskets = res;
      this.calculate();
    });
  }

  // sepetin toplam tutarını hesaplar
  calculate(){
    this.sum = 0;
    this.baskets.forEach(bas =>{
      (this.sum += bas.price * bas.quantity);
    });
  }


  // sepetten _id'ye göre ürün silme işlemi
  removeById(_id: string){
    this._swal.callSwal("Ürünü sepetten silmek istiyor musunuz?","Ürünü Sil", "Sil", () =>
      {
        let model = { _id: _id }
        this._basketService.removeById(model, res => {
        this._toastr.info(res.message);
        this.getAll(); // ürün silindikten sonra sepet güncellenir
      });
    });
  }

  decrease(basket: BasketModel, decOrInc: number){ // decOrInc = -1
    basket.quantity--;
    this.changeQuantityById(basket._id, basket.quantity, decOrInc);
  }

  increase(basket:BasketModel, decOrInc: number){ // decOrInc = 1
    basket.quantity++;
    this.changeQuantityById(basket._id, basket.quantity, decOrInc);
  }


  changeQuantityById(_id: string, quantity: number, decOrInc: number){
    let model = {
        _id: _id,
        quantity: quantity,
        decOrInc: decOrInc
      };
    this._basketService.changeQuantityById(model, res => {
      this._toastr.info(res.message);
      this.getAll(); // ürün miktarı değiştirildikten sonra sepet güncellenir
    });
  }


  clearAllBasket(){
    this._swal.callSwal("Sepeti boşaltmak istediğinizden emin misiniz?","Sepeti Boşalt","Temizle", () => {
      let userString = localStorage.getItem("user");
      let user = JSON.parse(userString);

      let model = { userId: user._id };
      this._basketService.clearAllBasket(model, res => {
        this._toastr.info(res.message);
        this.getAll();
      });
    });
  }


  // sipariş oluşturma işlemi
  createOrder(){
    this._swal.callSwal("Sepetinizdeki ürünleri satın almak istiyor musunuz?","Ürünleri Al","Ödeme Yap", ()=>{
      this._orderService.create(res => {
        this._toastr.success(res.message);
        this.getAll(); // sipariş oluşturulduktan sonra sepet güncellenir
      });
    });
  }
}
