import { Component } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { BasketModel } from '../../../baskets/models/basket.model';
import { BasketService } from '../../../baskets/services/basket.service';
import { CategoryModel } from '../../../categories/models/category.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  productId: string = "";
  product: ProductModel = new ProductModel();

  categories: CategoryModel[] = []

  imageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private _productService: ProductService,
    private _basketService: BasketService,
    private _toastr: ToastrService,
    private _activated: ActivatedRoute
  ){
    this._activated.params.subscribe(res => {
      this.productId = res["value"];
      this.getById();
    });
  }

  getById(){
    let model = {_id: this.productId};
    this._productService.getById(model, res => this.product = res);
  }

  increase(){
    this.quantity++;
  }

  decrease(){
    if(this.quantity > 1){
      this.quantity--;
    }
  }

  addBasket(productId: string, price: number){
    let model = new BasketModel();
    model.productId = productId;
    model.price = price;
    model.quantity = this.quantity;
    this._basketService.add(model, res => {
      this._toastr.success(res.message);
      this.getById(); // sepete ürün eklendikten sonra ürünleri tekrar getirir. Çünkü stok azalıyor ekleyince.
    });
  }
}
