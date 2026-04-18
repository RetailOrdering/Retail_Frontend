import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { User } from 'src/app/models/user';
import { UpdateRoleRequest } from 'src/app/models/dto-models';
import { Product } from 'src/app/models/product';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Admin/dashboard`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/Admin/users`);
  }

  updateUserRole(userId: number, body: UpdateRoleRequest): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Admin/users/${userId}/role`, body);
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/Admin/low-stock`);
  }
}