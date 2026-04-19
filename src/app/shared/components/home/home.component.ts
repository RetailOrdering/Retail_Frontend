import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  isLoading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Show first 6 available products
        this.featuredProducts = products
          .filter(p => p.isAvailable && p.stock > 0)
          .slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load featured products', err);
        this.isLoading = false;
      }
    });
  }
}