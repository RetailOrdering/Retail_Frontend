import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Product } from 'src/app/models/product';
import { CreateProductDto, UpdateProductDto } from 'src/app/models/dto-models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/Product`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/Product/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
  return this.http.post<Product>(`${environment.apiUrl}/Product`, product);
}

  updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/Product/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Product/${id}`);
  }
}