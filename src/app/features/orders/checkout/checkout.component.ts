import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { CartItem } from '../../../models/cart-item';
import { CreateOrderDto } from '../../../models/dto-models';
import Swal from 'sweetalert2';

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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not load cart.',
          confirmButtonColor: '#4F46E5'
        });
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
    this.discount = 0;
    this.total = this.subtotal - this.discount - this.pointsDiscount;
  }

  applyPoints(): void {
    const points = Number(this.pointsToRedeem);
    if (points > this.loyaltyPoints || points <= 0) return;

    this.loyaltyService.redeemPoints({ points }).subscribe({
      next: (response: any) => {
        this.pointsDiscount = response.discountAmount || (points / 100) * this.total;
        this.total = this.subtotal - this.discount - this.pointsDiscount;
        this.loyaltyPoints -= points;
        Swal.fire({
          icon: 'success',
          title: 'Points Redeemed',
          html: `${points} points redeemed!`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: (err) => console.error(err)
    });
  }

  placeOrder(): void {
    if (!this.orderData.address || !this.orderData.paymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in address and payment method.',
        confirmButtonColor: '#4F46E5'
      });
      return;
    }
    this.placingOrder = true;
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (order) => {
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          html: `Your order #${order.id} has been placed successfully.`,
          confirmButtonColor: '#4F46E5',
          confirmButtonText: 'View Order'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/orders', order.id]);
          } else {
            this.router.navigate(['/orders']);
          }
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Order Failed',
          text: 'Could not place order. Please try again.',
          confirmButtonColor: '#4F46E5'
        });
        this.placingOrder = false;
      }
    });
  }
}