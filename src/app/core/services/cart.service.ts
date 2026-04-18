import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Cart } from 'src/app/models/cart';
import { AddToCartDto, UpdateCartItemDto } from 'src/app/models/dto-models';
import { CartItem } from 'src/app/models/cart-item';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    this.http.get<Cart>(`${environment.apiUrl}/Cart`).subscribe({
      next: (cart) => this.cartItemsSubject.next(cart.items || []),
      error: () => this.cartItemsSubject.next([])
    });
  }

  addToCart(dto: AddToCartDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Cart/add`, dto).pipe(
      tap(() => this.loadCart())
    );
  }

  

  updateQuantity(itemId: number, dto: UpdateCartItemDto): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Cart/item/${itemId}`, dto).pipe(
      tap(() => this.loadCart())
    );
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Cart/item/${itemId}`).pipe(
      tap(() => this.loadCart())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Cart/clear`).pipe(
      tap(() => this.cartItemsSubject.next([]))
    );
  }
}