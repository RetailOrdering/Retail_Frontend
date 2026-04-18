import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Auth Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// Product Components
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';

// Cart Component
import { CartPageComponent } from './features/cart/cart-page/cart-page.component';

// Order Components
import { CheckoutComponent } from './features/orders/checkout/checkout.component';
import { OrderHistoryComponent } from './features/orders/order-history/order-history.component';

// Admin Components
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ManageProductsComponent } from './features/admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders.component';

const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  
  // Protected routes (guards will be added later)
  { path: 'cart', component: CartPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderHistoryComponent },
  
  // Admin routes (guards will be added later)
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/products', component: ManageProductsComponent },
  { path: 'admin/orders', component: ManageOrdersComponent },
  
  // Default route
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  
  // Wildcard route (404)
  { path: '**', redirectTo: '/products' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }