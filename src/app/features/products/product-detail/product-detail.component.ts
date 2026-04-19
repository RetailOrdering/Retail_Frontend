import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../models/product';
import { AddToCartDto } from '../../../models/dto-models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  categoryName = '';
  loading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.quantity = 1;
        if (product.categoryId) {
          this.loadCategoryName(product.categoryId);
        }
        this.loadRelatedProducts(product.categoryId);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  loadCategoryName(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category) => {
        this.categoryName = category.name;
      },
      error: (err) => console.error('Could not load category', err)
    });
  }

  loadRelatedProducts(categoryId: number): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.relatedProducts = products
          .filter(p => p.categoryId === categoryId && p.id !== this.product?.id && p.isAvailable)
          .slice(0, 4);
      },
      error: (err) => console.error(err)
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  validateQuantity(): void {
    if (this.product) {
      if (this.quantity < 1) this.quantity = 1;
      if (this.quantity > this.product.stock) this.quantity = this.product.stock;
    }
  }

  addToCart(): void {
    if (this.product && this.product.isAvailable && this.product.stock > 0) {
      const dto: AddToCartDto = {
        productId: this.product.id,
        quantity: this.quantity
      };
      this.cartService.addToCart(dto).subscribe({
        next: () => {
          alert(`Added ${this.quantity} x ${this.product!.name} to cart`);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to add to cart. Please try again.');
        }
      });
    }
  }
}