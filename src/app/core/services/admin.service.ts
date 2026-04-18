import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../../models/product';
import { Order } from '../../models/order';

@Injectable({ providedIn: 'root' })
export class AdminService {
  updateProduct(product: Product): Observable<Product> {
    console.log('Mock update product', product);
    return of(product).pipe(delay(400));
  }

  getAllOrders(): Observable<Order[]> {
    const stored = localStorage.getItem('orders');
    const orders = stored ? JSON.parse(stored) : [];
    return of(orders).pipe(delay(300));
  }
}