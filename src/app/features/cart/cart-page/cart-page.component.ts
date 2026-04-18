import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../models/cart-item';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.loading = false;
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe();
  }

  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(itemId, { quantity }).subscribe();
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  }
}