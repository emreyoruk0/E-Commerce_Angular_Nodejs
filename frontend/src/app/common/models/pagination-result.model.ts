// pagination yapısının dönüş yapısını tutan model
// <T> genel bir tür (generic type) parametresidir.
export class PaginationResultModel<T> {
  datas: T[]; // dönen veriler
  pageNumber: number = 1;
  pageSize: number = 1;
  isFirstPage: boolean = true;
  isLastPage: boolean = false;
  totalPageCount: number = 0;
}
