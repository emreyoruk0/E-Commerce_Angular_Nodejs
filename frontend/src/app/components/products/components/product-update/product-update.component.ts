import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';
import { CategoryModel } from '../../../categories/models/category.model';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../categories/services/category.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})
export class ProductUpdateComponent implements OnInit {
  categories: CategoryModel[] = [];
  images: File[] = [];
  imageUrls: any[] = [];

  selectedProductId: string = ""; // Seçilen(güncellenecek) ürünün id'si bu değişkende tutulacak
  selectedProduct: ProductModel = new ProductModel(); // Güncellenecek ürün bu değişkende tutulacak

  constructor(
    private _categoryService: CategoryService,
    private _toastr: ToastrService,
    private _productService: ProductService,
    private _router: Router,
    private _activated: ActivatedRoute
  ){
    this._activated.params.subscribe(res => {
      this.selectedProductId = res["value"]; // URL'den gelen value parametresini productId değişkenine atar
      //routerLink="/products/update/{{ product._id }}" products.component'da bu şekilde kullanıldı. Yani ürünün _id'si alınarak bu sayfaya yönlendirilir
      this.getById(); // adres çubuğundan gelen id'ye göre ürünü getirir
    });
  }

  ngOnInit(): void {
      this.getCategories();
  }

  getById(){
    let model = { _id: this.selectedProductId };
    this._productService.getById(model, res => this.selectedProduct = res);
  }

  // Tüm kategorileri getir
  getCategories() {
    this._categoryService.getAll(res => this.categories = res);
  }

  getImages(event: any) {
    const file: File[] = Array.from(event.target.files); // Dosyalar file değişkenine atanır
    this.images.push(...file); // Dosyaları images dizisine ekler

    for (let i = 0; i < event.target.files.length; i++) {
      const element = event.target.files[i];

      const reader = new FileReader(); // Dosyaları okumak için
      reader.readAsDataURL(element); // Dosyaları okur

      // Dosya okunduğunda bu fonksiyon çalışır
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.addImage(imageUrl, file);
      }
    }
  }


  addImage(imageUrl: string, file: any){
    this.imageUrls.push(
      {imageUrl: imageUrl, name: file.name, size: file.size}
    );
  }


  update(form: NgForm) {
    if(form.value["name"] == "" || form.value["categoriesSelect"].length == 0 || form.value["price"] == "" || form.value["stock"] == ""){
      this._toastr.error("Lütfen ürün bilgilerini eksiksiz doldurunuz!..");
      return;
    }

    if(form.valid){
      let product = form.value;
      let categories: string[] = product["categoriesSelect"];
      let price = product["price"];
      let stock = product["stock"];
      price = price.toString().replace(",", ".");

      let formData = new FormData();
      formData.append("_id", this.selectedProduct._id);
      formData.append("name", this.selectedProduct.name);
      formData.append("price", price);
      formData.append("stock", stock);
      for(const category of categories){
        formData.append("categories", category);
      }

      if(this.images != undefined){
        for(const image of this.images){
          formData.append("images", image, image.name);
        }
      }

      this._productService.update(formData, res =>{
        this._toastr.info(res.message);
        this._router.navigateByUrl("/products"); // Ürün güncellendikten sonra ürünler sayfasına geri döndürür
      });
    }
  }


  deleteImage(_id: string, index: number){
    let model = {
        _id: _id,
        index: index
      };
    this._productService.removeImageByProductIdAndIndex(model, res => {
      this._toastr.warning(res.message);
      this.getById(); // Resim silindikten sonra ürünü tekrar getirir
    });
  }
}
