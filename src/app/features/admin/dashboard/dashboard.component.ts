import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  totalUsers = 0;
  lowStockCount = 0;

  constructor(
    private adminService: AdminService,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService   // ✅ Add this
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'Admin') {
      this.loadStats();
    }
  }

  loadStats(): void {
    // Get products count
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.lowStockCount = products.filter(p => p.stock < 10).length;
      },
      error: (err) => console.error('Error loading products', err)
    });

    // Get orders count (admin endpoint)
    this.orderService.getAllOrders().subscribe({
      next: (orders) => this.totalOrders = orders.length,
      error: (err) => console.error('Error loading orders', err)
    });

    // Get users count
    this.adminService.getAllUsers().subscribe({
      next: (users) => this.totalUsers = users.length,
      error: (err) => console.error('Error loading users', err)
    });
  }
}