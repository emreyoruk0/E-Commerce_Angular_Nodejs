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
    this._basket.getCount();
    this.getCurrentUser();
   }

   logOut(){
      this._authService.logOut();
   }

   getCurrentUser(){
      let userJson = localStorage.getItem("user"); // mevcut kullanıcıyı JSON formatında alır
      this.currentUser = JSON.parse(userJson); // JSON.parse metodu, JSON formatındaki veriyi javascript objesine dönüştürür
   }

}
