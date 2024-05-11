// pagination yapısının dönüş yapısını tutan model
// T -> Genel tür (Generic type) parametresidir.
// Genel türler, farklı veri türleriyle çalışabilen ve yeniden kullanılabilir kod yazmamızı sağlar.
export class PaginationResultModel<T> {
  datas: T; // dönen veriler
  pageNumber: number = 1;
  pageSize: number = 1;
  totalPageCount: number = 0;
  isFirstPage: boolean = true;
  isLastPage: boolean = false;
}

// T yerine diren any de kullanılabilir.

// product.service.ts'de getAll metodunda PaginationResultModel<ProductModel[]> şeklinde kullanıldı.
// Mesela orda ProductModel[] gönderdiğimiz için burdaki T ona göre adapte olur ve     datas: ProductModel[]   olmuş olur.
