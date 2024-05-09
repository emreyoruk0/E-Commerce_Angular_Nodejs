import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../common/shared/shared.module';
import { BasketService } from '../../baskets/services/basket.service';
import { AuthService } from '../../auth/services/auth.service';
import { UserModel } from '../../auth/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  currentUser: UserModel = new UserModel();

  constructor(
    public _basket: BasketService,
    private _authService: AuthService
  ) {}

   ngOnInit(): void {
    this._basket.getCount(); // mevcut sepetteki ürün sayısını hesaplatır
    this.getCurrentUser();
   }

   logOut(){
      this._authService.logOut();
   }

   getCurrentUser(){
      let userString = localStorage.getItem("user"); // local storage'dan mevcut kullanıcı bilgisini alır (string olarak)
      this.currentUser = JSON.parse(userString); // JSON.parse metodu -> string olan kullanıcı bilgilerini JSON'a çevirir
   }
}
