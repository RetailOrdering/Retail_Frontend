import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order';
import { UpdateOrderStatusDto } from '../../../models/dto-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateStatus(orderId: number, status: string): void {
    const dto: UpdateOrderStatusDto = { status };
    this.orderService.updateOrderStatus(orderId, dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: 'Order status updated.',
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
          text: 'Could not update status.',
          confirmButtonColor: '#4F46E5'
        });
        this.loadOrders(); // revert on error
      }
    });
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/admin/orders', orderId]); // or to order detail
  }
}