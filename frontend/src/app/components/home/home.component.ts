import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';
import { CategoryModel } from '../categories/models/category.model';
import { CategoryService } from '../categories/services/category.service';
import { RequestModel } from '../../common/models/request.model';
import { ProductService } from '../products/services/product.service';
import { ProductModel } from '../products/models/product.model';

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
    private _productService: ProductService
  ){}

  ngOnInit(){
    this.getCategories();
    this.getAll();
  }

  // tüm ürünleri burdaki products dizisine atar
  getAll(){
    this._productService.getAllforHomePage(this.request, res =>this.products = res);
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
}
