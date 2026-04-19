import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models/product';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { AddToCartDto } from '../../../models/dto-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  isAddingToCart = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  getCategoryIcon(): string {
    const name = this.product.name?.toLowerCase() || '';
    if (name.includes('pizza')) return '🍕';
    if (name.includes('drink') || name.includes('cola') || name.includes('juice') || name.includes('soda')) return '🥤';
    if (name.includes('bread') || name.includes('bun') || name.includes('roll')) return '🍞';
    if (name.includes('burger')) return '🍔';
    if (name.includes('cake') || name.includes('sweet')) return '🎂';
    return '🛍️';
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    if (this.product.stock === 0 || !this.product.isAvailable || this.isAddingToCart) return;

    const isLoggedIn = this.authService.getCurrentUser() !== null;
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add items to your cart',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4F46E5',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Login Now',
        cancelButtonText: 'Stay'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.isAddingToCart = true;
    const dto: AddToCartDto = {
      productId: this.product.id,
      quantity: 1
    };

    this.cartService.addToCart(dto).subscribe({
      next: () => {
        this.isAddingToCart = false;
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        }).fire({
          icon: 'success',
          title: `<strong>${this.product.name}</strong> added to cart!`
        });
      },
      error: (err) => {
        this.isAddingToCart = false;
        console.error(err);
        Swal.fire({
          title: 'Oops!',
          text: 'Failed to add item to cart. Please try again.',
          icon: 'error',
          confirmButtonColor: '#4F46E5'
        });
      }
    });
  }

  navigateToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }
}