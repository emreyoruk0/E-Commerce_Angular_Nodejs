import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValid]',
  standalone: true
})
export class ValidDirective {

  @Input() appValid: boolean = false;
  // form elementi içinde [appValid]="xxx.validity.valid" şeklinde kullanılır. true/false

  constructor(
    private _el: ElementRef<any>
  ) { }

  // herhangi bir tuşa her basıldığında tetiklenir
  @HostListener('keyup') keyup(){
    if(this.appValid){ // ilgili form elementi geçerliyse yani appValid = true ise
      this._el.nativeElement.className = "form-control is-valid";
    } else{ // geçersizse yani appValid = false ise
      this._el.nativeElement.className = "form-control is-invalid";
    }
  }
}
