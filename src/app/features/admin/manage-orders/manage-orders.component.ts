import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../core/services/order.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateStatus(order: Order): void {
    this.orderService.updateOrderStatus(order.id, { status: order.status }).subscribe();
  }

  viewDetails(order: Order): void {
    this.selectedOrder = order;
    const modalElem = document.getElementById('orderDetailModal');
    const modal = new Modal(modalElem!);
    modal.show();
  }
}