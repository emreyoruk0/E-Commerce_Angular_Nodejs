import { Component, OnInit } from '@angular/core';
import { PaginationResultModel } from '../../../../common/models/pagination-result.model';
import { ProductModel } from '../../models/product.model';
import { RequestModel } from '../../../../common/models/request.model';
import { ProductService } from '../../services/product.service';
import { SwalService } from '../../../../common/services/swal.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../../common/shared/shared.module';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  result: PaginationResultModel<ProductModel[]> = new PaginationResultModel<ProductModel[]>(); // veriler pagination yapısına uygun olarak result değişkenine atanacak
  request: RequestModel = new RequestModel(); // pagination için gerekli request modeli
  pageNumbers: number[] = []; // sayfa numaralarını tutacak değişken
  products: ProductModel = new ProductModel();

  constructor(
    private _productService: ProductService,
    private _swal: SwalService,
    private _toastr: ToastrService
  ) {}

  // component yüklendiğinde an çalışır ve verileri getirir
  ngOnInit(): void {
    this.getAll();
  }

  // pageNumber = 1 olduğunda ilk sayfadaki ürünleri getirir. Eğer 1 dışında parametre gönderilirse yani sayfa numarası belirtilirse o sayfayı getirir
  getAll(pageNumber = 1) {
    this.request.pageNumber = pageNumber;
    this._productService.getAll(this.request, (res) => {
      this.result = res;
      this.setPageNumbers();
    });
  }

  // Sayfa numaralarını belirler
  setPageNumbers() {
    const startPage = Math.max(1, this.result.pageNumber - 2);
    const endPage = Math.min(this.result.totalPageCount, this.result.pageNumber + 2);

    this.pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      this.pageNumbers.push(i);
    }
  }

  // arama input'undaki (keyup)="search()" ile tetiklenir yani her tuşa basıldığında çalışır
  search() {
    if (this.request.search.length >= 3) {
      this.getAll(1);
    } // arama için girilen kelime 3 karakterden büyükse otomatik yani enter'a basmadan arama yapması için
  }

  // id'si gönderilen ürünü siler
  removeById(id: string) {
    this._swal.callSwal("Ürünü silmek istediğinizden emin misiniz?", "Ürünü Sil","Sil", () =>{
      let model = { _id: id };
      this._productService.removeById(model, (res) => {
        this._toastr.info(res.message);
        this.getAll(this.request.pageNumber); // ürün silindikten sonra mevcut sayfadaki güncel ürünleri getirmek için
      });
    });
  }

  // id'si gönderilen ürünün aktiflik durumunu değiştirir
  changeProductStatus(id: string) {
    let model = { _id: id };
    this._productService.changeActiveStatus(model, (res) => {
      this._toastr.info(res.message);
    });
  }
}
