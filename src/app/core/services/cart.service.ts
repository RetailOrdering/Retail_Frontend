import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Cart } from 'src/app/models/cart';
import { AddToCartDto, UpdateCartItemDto } from 'src/app/models/dto-models';
import { CartItem } from 'src/app/models/cart-item';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Only load cart if user is already logged in
    if (this.authService.getCurrentUser()) {
      this.loadCart();
    }
    // Listen to login/logout events
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartItemsSubject.next([]); // clear cart on logout
      }
    });
  }

  private loadCart(): void {
    this.getCart().subscribe({
      next: (cart) => this.cartItemsSubject.next(cart.items || []),
      error: (err) => {
        console.warn('Failed to load cart (maybe not logged in)', err);
        this.cartItemsSubject.next([]);
      }
    });
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${environment.apiUrl}/Cart`).pipe(
      tap(cart => this.cartItemsSubject.next(cart.items || []))
    );
  }

  addToCart(dto: AddToCartDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Cart/add`, dto).pipe(
      tap(() => this.loadCart())
    );
  }

  updateCartItem(itemId: number, dto: UpdateCartItemDto): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Cart/item/${itemId}`, dto).pipe(
      tap(() => this.loadCart())
    );
  }

  removeCartItem(itemId: number): Observable<any> {
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