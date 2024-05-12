import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../common/shared/shared.module';
import { CategoryModel } from '../../../categories/models/category.model';
import { NgForm } from '@angular/forms';
import { CategoryService } from '../../../categories/services/category.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css'
})
export class ProductAddComponent implements OnInit {
  categories: CategoryModel[] = [];
  images: File[] = [];
  imageUrls: any[] = [];

  constructor(
    private _categoryService: CategoryService,
    private _toastr: ToastrService,
    private _productService: ProductService,
    private _router: Router
  ){}

  ngOnInit(): void {
      this.getCategories();
  }

  // Tüm kategorileri getir
  getCategories() {
    this._categoryService.getAll(res => this.categories = res);
  }

  getImages(event: any) {
    const file: File[] = Array.from(event.target.files); // Dosyaları file değişkenine atanır
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


  add(form: NgForm) {
    if(form.value["name"] == "" || form.value["categoriesSelect"].length == 0 || form.value["price"] == "" || form.value["stock"] == ""){
      this._toastr.error("Lütfen ürün bilgilerini eksiksiz doldurunuz!..");
      return;
    }

    if(form.valid){
      let product = form.value; // Formun tüm verileri product değişkenine atanır. name, categoriesSelect, price, stock alanlarının tümü alınır
      let name = product["name"];
      let categories: string[] = product["categoriesSelect"];
      let price = product["price"];
      let stock = product["stock"];
      price = price.toString().replace(",", ".");

      let formData = new FormData(); // Form verilerini göndermek için FormData nesnesi oluşturulur
      // **Resim veya dosya ekleyeceksek mutlaka FormData ile almamız gerek**

      // Form verileri FormData nesnesinin ilgili alanlarına eklenir
      formData.append("name", name);
      formData.append("stock", stock);
      formData.append("price", price);
      for(const category of categories){
        formData.append("categories", category);
      }
      for(const image of this.images){
        formData.append("images", image, image.name);
      }

      this._productService.add(formData, res => {
        this._toastr.success(res.message);
        form.reset();
        this.imageUrls = [];
        this._router.navigateByUrl("/products"); // Ürün eklendikten sonra ürünler sayfasına geri döndürür
      });
    }
  }


  removeImage(name: string, size: number, index: number){
    this.imageUrls.splice(index, 1); // resmin URL'sini siler

    let i = this.images.findIndex(x => x.name === name && x.size === size); // resmin indexini bulur
    this.images.splice(i, 1); // resmi dosya olarak siler
  }
}
