// pagination yapısı kullandığımızda isteyebileceğimiz model yapısı
export class RequestModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';
}
