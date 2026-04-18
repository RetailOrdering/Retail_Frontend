import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { CouponService } from '../../../core/services/coupon.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  subtotal = 0;
  address = { name: '', line: '' };
  paymentMethod = 'Cash on Delivery';
  couponCode = '';
  discountPercent = 0;
  discountAmount = 0;
  total = 0;
  placingOrder = false;
couponValid: any;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private couponService: CouponService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      this.recalculateTotal();
    });
  }

  applyCoupon(): void {
    if (!this.couponCode) return;
    this.couponService.validateCoupon(this.couponCode, this.subtotal).subscribe(coupon => {
      if (coupon) {
        this.discountPercent = coupon.discountPercentage;
        this.recalculateTotal();
      } else {
        alert('Invalid coupon');
        this.discountPercent = 0;
        this.recalculateTotal();
      }
    });
  }

  recalculateTotal(): void {
    this.discountAmount = (this.subtotal * this.discountPercent) / 100;
    this.total = this.subtotal - this.discountAmount;
  }

  placeOrder(): void {
    this.placingOrder = true;
    const orderData = {
      address: `${this.address.line}, ${this.address.name}`,
      paymentMethod: this.paymentMethod,
      couponCode: this.couponCode || undefined
    };
    this.orderService.placeOrder(orderData).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe();
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Order failed');
        this.placingOrder = false;
      }
    });
  }
}