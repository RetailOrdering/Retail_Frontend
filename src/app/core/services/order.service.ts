import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { environment } from 'src/environments/environments';
import { CreateOrderDto, UpdateOrderStatusDto } from 'src/app/models/dto-models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(order: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/Order`, order);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/Order`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/Order/${id}`);
  }

  cancelOrder(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Order/${id}`);
  }

  // Admin only
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/Order/admin/all`);
  }

  updateOrderStatus(id: number, dto: UpdateOrderStatusDto): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Order/${id}/status`, dto);
  }
}