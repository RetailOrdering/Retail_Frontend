import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic cheese and tomato pizza',
      price: 12.99,
      imageUrl: 'assets/pizza.jpg',
      categoryId: 1,
      stock: 50,
      isAvailable: true,
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'Cold Drink - Cola',
      description: 'Refreshing cola 500ml',
      price: 2.49,
      imageUrl: 'assets/cola.jpg',
      categoryId: 2,
      stock: 200,
      isAvailable: true,
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic butter',
      price: 4.99,
      imageUrl: 'assets/garlic-bread.jpg',
      categoryId: 3,
      stock: 100,
      isAvailable: true,
      createdAt: new Date()
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(300));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(200));
  }
}