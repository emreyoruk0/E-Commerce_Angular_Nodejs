// pagination yapısı kullandığımızda isteyebileceğimiz model yapısı
export class RequestModel {
  pageNumber: number = 1;
  pageSize: number = 10;
  search: string = ''; // Home sayfasında aranan kelimeye göre ürünleri getirirken kullanılacak
  categoryName: string = 'Tümü'; //  başlangıçta tümünü göstermek için
  categoryId: string = ''; // Home sayfasında categoryId'ye göre ürünleri getirirken kullanılacak
  priceFilter: string = "0";
}
// categoryName ve priceFilter sayesinde Home sayfasında kategoriye ve fiyata göre filtreleme yapılıp ürünler ona göre getirilecek
