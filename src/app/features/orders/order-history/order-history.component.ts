import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not load orders.',
          confirmButtonColor: '#4F46E5'
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'delivered': return 'delivered';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  cancelOrder(orderId: number): void {
    Swal.fire({
      title: 'Cancel Order?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.cancelOrder(orderId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cancelled',
              text: 'Order cancelled successfully.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadOrders();
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Could not cancel order.',
              confirmButtonColor: '#4F46E5'
            });
          }
        });
      }
    });
  }
}