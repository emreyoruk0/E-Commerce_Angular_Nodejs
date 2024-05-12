import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from './components/auth/services/auth.service';

export const routes: Routes = [
  {
    path: "login",
    loadComponent:
        () => import("./components/auth/components/login/login.component")
        .then(c => c.LoginComponent)
  },
  {
    path: "register",
    loadComponent:
        () => import("./components/auth/components/register/register.component")
        .then(c => c.RegisterComponent)
  },
  {
    path: "",
    loadComponent:
        () => import("./components/layouts/layouts.component")
        .then(c => c.LayoutsComponent),
    canActivateChild: [() => inject(AuthService).checkIsAuth()], // bu gerekli, kullanıcı giriş yapmadan bu sayfaları görememesi için
    children: [
      {
        path: "",
        loadComponent:
            () => import("./components/home/home.component")
            .then(c => c.HomeComponent)
      },
      {
        path: "products",
        loadComponent:
            () => import("./components/products/components/products/products.component")
            .then(c => c.ProductsComponent)
      },
      {
        path: "products/add",
        loadComponent:
            () => import("./components/products/components/product-add/product-add.component")
            .then(c => c.ProductAddComponent)
      },
      {
        path: "products/update/:value",
        loadComponent:
            () => import("./components/products/components/product-update/product-update.component")
            .then(c => c.ProductUpdateComponent)
      },
      {
        path: "products/detail/:value",
        loadComponent:
            () => import("./components/products/components/product-detail/product-detail.component")
            .then(c => c.ProductDetailComponent)
      },
      {
        path: "categories",
        loadComponent:
            () => import("./components/categories/components/categories/categories.component")
            .then(c => c.CategoriesComponent)
      },
      {
        path: "baskets",
        loadComponent:
            () => import("./components/baskets/components/baskets/baskets.component")
            .then(c => c.BasketsComponent)
      },
      {
        path: "orders",
        loadComponent:
            () => import("./components/orders/components/orders/orders.component")
            .then(c => c.OrdersComponent)
      }
    ]
  }
];
