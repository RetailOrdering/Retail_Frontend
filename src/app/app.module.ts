import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartPageComponent } from './features/cart/cart-page/cart-page.component';
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { OrderHistoryComponent } from './features/orders/order-history/order-history.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ManageProductsComponent } from './features/admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartPageComponent,
    CheckoutComponent,
    OrderHistoryComponent,
    DashboardComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
