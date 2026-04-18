import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('orders');
    if (stored) this.ordersSubject.next(JSON.parse(stored));
  }

  placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Observable<Order> {
    const newOrder: Order = {
      id: Date.now(),
      ...order,
      status: 'Pending',
      createdAt: new Date(),
      items: order.items || []
    };
    const current = this.ordersSubject.value;
    this.ordersSubject.next([...current, newOrder]);
    localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
    return of(newOrder).pipe(delay(500));
  }

  getOrdersForUser(userId: number): Observable<Order[]> {
    const userOrders = this.ordersSubject.value.filter(o => o.userId === userId);
    return of(userOrders).pipe(delay(300));
  }
}