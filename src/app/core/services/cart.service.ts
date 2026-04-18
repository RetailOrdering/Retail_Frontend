import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from '../../models/cart-item';
import { Product } from '../../models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('cart');
    if (stored) this.cartItemsSubject.next(JSON.parse(stored));
  }

  private updateStorage(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addToCart(product: Product, quantity: number): void {
    const current = this.cartItemsSubject.value;
    const existing = current.find(item => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
      this.updateStorage([...current]);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        cartId: 0, // will be set on backend
        productId: product.id,
        quantity,
        price: product.price,
        productName: product.name,
        totalPrice: product.price * quantity
      };
      this.updateStorage([...current, newItem]);
    }
  }

  removeFromCart(productId: number): void {
    const filtered = this.cartItemsSubject.value.filter(item => item.productId !== productId);
    this.updateStorage(filtered);
  }

  updateQuantity(productId: number, quantity: number): void {
    const current = this.cartItemsSubject.value.map(item =>
      item.productId === productId ? { ...item, quantity, totalPrice: item.price * quantity } : item
    );
    this.updateStorage(current);
  }

  clearCart(): void {
    this.updateStorage([]);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }
}