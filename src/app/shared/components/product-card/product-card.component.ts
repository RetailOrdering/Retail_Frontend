import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  addingToCart = false;

  // Placeholder images per category (you can use base64 or URLs)
  pizzaImage = 'assets/pizza-placeholder.png';
  drinkImage = 'assets/drink-placeholder.png';
  breadImage = 'assets/bread-placeholder.png';
  defaultImage = 'assets/placeholder.png';

  constructor(private cartService: CartService) {}

  getProductImage(): string {
    // Fallback by categoryId
    switch (this.product.categoryId) {
      case 1: return this.pizzaImage;
      case 2: return this.drinkImage;
      case 3: return this.breadImage;
      default: return this.defaultImage;
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  addToCart(): void {
    this.addingToCart = true;
    this.cartService.addToCart({ productId: this.product.id, quantity: 1 }).subscribe({
      next: () => this.addingToCart = false,
      error: () => this.addingToCart = false
    });
  }
}