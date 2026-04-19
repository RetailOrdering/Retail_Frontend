import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../models/user';
import { Product } from '../../../models/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {};
  users: User[] = [];
  lowStockProducts: Product[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.adminService.getDashboard().subscribe({
      next: (data) => this.dashboardData = data,
      error: (err) => console.error(err)
    });
    this.adminService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error(err)
    });
    this.adminService.getLowStockProducts().subscribe({
      next: (products) => this.lowStockProducts = products,
      error: (err) => console.error(err),
      complete: () => this.loading = false
    });
  }

  updateRole(userId: number, role: string): void {
    this.adminService.updateUserRole(userId, { role }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'User role updated successfully.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Could not update user role.',
          confirmButtonColor: '#4F46E5'
        });
      }
    });
  }
}