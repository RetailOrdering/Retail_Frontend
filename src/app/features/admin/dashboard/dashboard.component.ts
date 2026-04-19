import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../models/user';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = false;
  error = '';
  dashboardData: any = null;
  users: User[] = [];
  lowStockProducts: Product[] = [];
  showUsers = false;
  showLowStock = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    if (this.users.length === 0) {
      this.adminService.getAllUsers().subscribe({
        next: (users) => this.users = users,
        error: (err) => console.error(err)
      });
    }
    this.showUsers = !this.showUsers;
    this.showLowStock = false;
  }

  loadLowStock(): void {
    if (this.lowStockProducts.length === 0) {
      this.adminService.getLowStockProducts().subscribe({
        next: (products) => this.lowStockProducts = products,
        error: (err) => console.error(err)
      });
    }
    this.showLowStock = !this.showLowStock;
    this.showUsers = false;
  }

  updateUserRole(userId: number, newRole: string): void {
    this.adminService.updateUserRole(userId, { role: newRole }).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === userId);
        if (user) user.role = newRole as 'Admin' | 'Customer';
        alert('User role updated');
      },
      error: (err) => console.error(err)
    });
  }
}