import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../common/shared/shared.module';
import { CategoryModel } from './models/category.model';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from './services/category.service';
import { NgForm } from '@angular/forms';
import { SwalService } from '../../common/services/swal.service';
import { CategoryPipe } from './pipes/category.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SharedModule, CategoryPipe],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  categories: CategoryModel[] = []; // tüm kategorileri tutar
  updateCategory: CategoryModel = new CategoryModel(); // güncellenecek kategoriyi tutar

  search: string = ""; // arama çubuğu için.

  constructor(
    private _toastr: ToastrService,
    private _categoryService: CategoryService,
    private _swal: SwalService
  ){}

  // uygulama başladığında tüm kategorileri getirir
  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this._categoryService.getAll(res => this.categories = res);
  }

  // get metodu güncellenecek kategoriyi alır ve buradaki CategoryModel tipindeki updateCategory değişkenine atar
  get(category: CategoryModel){
    this.updateCategory = {...category}; //referans olarak değil, değer olarak atama yapar
  }

  add(form: NgForm){
    if(form.valid){
      this._categoryService.add(form.controls["name"].value, res => {
        this._toastr.success(res.message);

        // addModalın close butonuna tıklatmak için
        let element = document.getElementById("addModalCloseBtn");
        element?.click();

        form.reset(); // formu resetler
        this.getAll(); // yeni eklenen kategoriden sonra tüm kategorileri tekrar getirir
      });
    }
  }

  // Güncelleme işlemini yapar. Güncellenecek kategori get metodu ile alınıp buradaki updateCategory değişkenine atanır ardından bu değişken kullanarak güncelleme işlemi yapılır
  update(form: NgForm){
    if(form.valid){
      this._categoryService.update(this.updateCategory, res => {
        this._toastr.warning(res.message);
        this.getAll();
        let element = document.getElementById("updateModalCloseBtn");
        element?.click();
      });
    }
  }

  // Direk silinecek kategoriyi alır ve silme işlemi yapar
  removeById(model: CategoryModel){
    this._swal.callSwal(`${model.name} kategorisini silmek istediğinizden emin misiniz?`, "", "Sil", () =>{
      this._categoryService.removeById(model._id, res => {
        this._toastr.info(res.message);
        this.getAll();
      });
    });
  }
}
