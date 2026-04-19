import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CouponService } from '../../../core/services/coupon.service';
import { CartItem } from '../../../models/cart-item';
import { Coupon } from '../../../models/coupon';
import { UpdateCartItemDto } from '../../../models/dto-models';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  loading = false;
  error = '';
  subtotal = 0;
  discount = 0;
  total = 0;

  couponCode = '';
  appliedCoupon: Coupon | null = null;
  applyingCoupon = false;

  updatingItemId: number | null = null;
  removingItemId: number | null = null;
  clearingCart = false;

  constructor(
    private cartService: CartService,
    private couponService: CouponService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.error = '';
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items || [];
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load cart. Please try again.';
        this.loading = false;
      }
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (this.appliedCoupon) {
      // Check minimum order amount
      if (this.appliedCoupon.minimumOrderAmount && this.subtotal >= this.appliedCoupon.minimumOrderAmount) {
        this.discount = (this.subtotal * this.appliedCoupon.discountPercentage) / 100;
      } else {
        this.discount = 0;
        // Optionally remove invalid coupon
        this.appliedCoupon = null;
      }
    } else {
      this.discount = 0;
    }
    this.total = this.subtotal - this.discount;
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity < 1) return;
    if (this.updatingItemId === item.id) return;
    this.updatingItemId = item.id;

    const dto: UpdateCartItemDto = { quantity: newQuantity };
    this.cartService.updateCartItem(item.id, dto).subscribe({
      next: () => {
        item.quantity = newQuantity;
        this.calculateTotals();
        this.updatingItemId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update quantity');
        this.updatingItemId = null;
      }
    });
  }

  onQuantityChange(item: CartItem): void {
    if (item.quantity < 1) item.quantity = 1;
    this.updateQuantity(item, item.quantity);
  }

  removeItem(itemId: number): void {
    if (confirm('Remove this item from cart?')) {
      this.removingItemId = itemId;
      this.cartService.removeCartItem(itemId).subscribe({
        next: () => {
          this.cartItems = this.cartItems.filter(i => i.id !== itemId);
          this.calculateTotals();
          this.removingItemId = null;
        },
        error: (err) => {
          console.error(err);
          alert('Failed to remove item');
          this.removingItemId = null;
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Clear your entire cart?')) {
      this.clearingCart = true;
      this.cartService.clearCart().subscribe({
        next: () => {
          this.cartItems = [];
          this.calculateTotals();
          this.clearingCart = false;
          this.appliedCoupon = null;
          this.couponCode = '';
        },
        error: (err) => {
          console.error(err);
          alert('Failed to clear cart');
          this.clearingCart = false;
        }
      });
    }
  }

  // ✅ FIXED: Pass subtotal as second argument
  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.applyingCoupon = true;
    this.couponService.validateCoupon(this.couponCode, this.subtotal).subscribe({
      next: (coupon) => {
        if (coupon) {
          this.appliedCoupon = coupon;
          this.calculateTotals();
          alert(`Coupon applied! ${coupon.discountPercentage}% off`);
        } else {
          alert('Invalid or expired coupon');
        }
        this.applyingCoupon = false;
      },
      error: (err) => {
        console.error(err);
        alert('Invalid or expired coupon');
        this.applyingCoupon = false;
      }
    });
  }

  removeCoupon(): void {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.calculateTotals();
  }

  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.router.navigate(['/checkout'], {
      state: { couponCode: this.appliedCoupon?.code }
    });
  }
}