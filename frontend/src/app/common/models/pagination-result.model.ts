// pagination yapısının dönüş yapısını tutan model
// T -> Genel tür (Generic type) parametresidir.
// Genel türler, farklı veri türleriyle çalışabilen ve yeniden kullanılabilir kod yazmamızı sağlar.
export class PaginationResultModel<T> {
  datas: T; // dönen veriler
  pageNumber: number = 1;
  pageSize: number = 1;
  isFirstPage: boolean = true;
  isLastPage: boolean = false;
  totalPageCount: number = 0;
}
