// pagination yapısı kullandığımızda isteyebileceğimiz model yapısı
export class RequestModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = '';
  categoryName: string = 'Tümü'; //  başlangıçta tümünü göstermek için
  categoryId: string = ''; // Home sayfasında categoryId üzerinden arama yapılacak
  priceFilter: string = '0';
}
// categoryName ve priceFilter sayesinde Home sayfasında kategoriye ve fiyata göre filtreleme yapılıp ürünler ona göre getirilecek
