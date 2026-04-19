import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../models/product';
import { CartService } from '../../../core/services/cart.service';
import { AddToCartDto } from '../../../models/dto-models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  // ✅ Accept event parameter and stop propagation
  addToCart(event: Event): void {
    event.stopPropagation(); // Prevent navigating to product detail
    if (this.product.stock === 0 || !this.product.isAvailable) return;

    const dto: AddToCartDto = {
      productId: this.product.id,
      quantity: 1
    };
    this.cartService.addToCart(dto).subscribe({
      next: () => {
        alert(`Added ${this.product.name} to cart`);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add to cart');
      }
    });
  }

  navigateToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }
}