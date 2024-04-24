import { Pipe, PipeTransform } from '@angular/core';
import { CategoryModel } from '../models/category.model';

@Pipe({
  name: 'categoryPipe',
  standalone: true
})
export class CategoryPipe implements PipeTransform {

  // value = tüm kategoriler, search = aranan kelime
  transform(value: CategoryModel[], search: string): CategoryModel[] {

    if(search == ""){
      return value; // arama çubuğu boşsa tüm kategorileri döndürür
    }

    // değilse de arama çubuğuna yazılan kelimeye göre kategorileri filtreler
    return value.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

}
