import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';
import { CategoryModel } from '../categories/models/category.model';
import { CategoryService } from '../categories/services/category.service';
import { RequestModel } from '../../common/models/request.model';
import { ProductService } from '../products/services/product.service';
import { ProductModel } from '../products/models/product.model';
import { BasketModel } from '../baskets/models/basket.model';
import { BasketService } from '../baskets/services/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  categories: CategoryModel[] = [];
  request: RequestModel = new RequestModel(); // kategoriye göre ürünleri getirmek için
  products: ProductModel[] = [];

  constructor(
    private _categoryService: CategoryService,
    private _productService: ProductService,
    private _basketService: BasketService,
    private _toastr: ToastrService
  ){}

  ngOnInit(){
    this.getCategories();
    this.getAll();
  }

  // tüm ürünleri burdaki products dizisine atar
  getAll(){
    this._productService.getAllForHomePage(this.request, res =>this.products = res);
  }

  // tüm kategorileri burdaki categories dizisine atar
  getCategories(){
    this._categoryService.getAll(res => this.categories = res)
  }

  // seçili kategoriyi değiştirme
  changeCategory(categoryId: string, categoryName: string){
    this.request.categoryName = categoryName;
    this.request.categoryId = categoryId;
    this.getAll(); // kategoriyi değiştirdikten sonra sadce o kategoriye ait ürünleri getirir
  }


  // sepete ekleme metodu
  addBasket(productId: string, price: number){
    let model = new BasketModel();
    model.productId = productId;
    model.price = price;
    model.quantity = 1;
    this._basketService.add(model, res => {
      this._toastr.success(res.message);
      this.getAll();
    });
  }
}
