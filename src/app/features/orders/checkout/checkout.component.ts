import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { CartItem } from '../../../models/cart-item';
import { CreateOrderDto } from '../../../models/dto-models';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal = 0;
  discount = 0;
  total = 0;
  loading = true;
  placingOrder = false;

  couponCode = '';
  loyaltyPoints = 0;
  pointsToRedeem = 0;
  pointsDiscount = 0;

  orderData: CreateOrderDto = {
    address: '',
    paymentMethod: '',
    couponCode: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private loyaltyService: LoyaltyService,
    private router: Router
  ) {
    // Get coupon code from navigation state (passed from cart)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const code = navigation.extras.state['couponCode'] || '';
      this.orderData.couponCode = code;
      this.couponCode = code;
    }
  }

  ngOnInit(): void {
    this.loadCart();
    this.loadLoyaltyPoints();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items || [];
        this.calculateTotals();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadLoyaltyPoints(): void {
    this.loyaltyService.getPoints().subscribe({
      next: (points) => this.loyaltyPoints = points,
      error: (err) => console.error(err)
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.discount = 0; // Coupon discount will be applied by backend; we can re‑validate if needed
    this.total = this.subtotal - this.discount - this.pointsDiscount;
  }

  applyPoints(): void {
    const points = Number(this.pointsToRedeem);
    if (points > this.loyaltyPoints || points <= 0) return;

    this.loyaltyService.redeemPoints({ points }).subscribe({
      next: (response: any) => {
        // Adjust discount based on your backend response
        this.pointsDiscount = response.discountAmount || (points / 100) * this.total;
        this.total = this.subtotal - this.discount - this.pointsDiscount;
        this.loyaltyPoints -= points;
        alert(`Redeemed ${points} points!`);
      },
      error: (err) => console.error(err)
    });
  }

  placeOrder(): void {
    if (!this.orderData.address || !this.orderData.paymentMethod) {
      alert('Please fill all required fields');
      return;
    }
    this.placingOrder = true;
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (order) => {
        alert('Order placed successfully!');
        this.router.navigate(['/orders', order.id]);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order. Please try again.');
        this.placingOrder = false;
      }
    });
  }
}