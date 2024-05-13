import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NgxSpinnerModule, CommonModule],
  template:`
  <router-outlet></router-outlet>
  <button class="backtotop" *ngIf="isShow" (click)="gotoTop()">
      <i class="fa-solid fa-circle-chevron-up"></i>
  </button>
  <ngx-spinner bdColor = "rgba(0, 0, 0, 0.8)" size = "medium" color = "#fff" type = "square-loader" [fullScreen] = "true"><p style="color: white">Yükleniyor...</p></ngx-spinner>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  isShow: boolean = false;
  topPosToStartShowing = 100;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
