import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(+id);
    } else {
      this.goBack();
    }
  }

  loadOrder(id: number): void {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load order details';
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not load order details.',
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

  cancelOrder(): void {
    if (!this.order) return;
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
        this.orderService.cancelOrder(this.order!.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cancelled',
              text: 'Order has been cancelled.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadOrder(this.order!.id);
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

  goBack(): void {
    this.location.back();
  }
}