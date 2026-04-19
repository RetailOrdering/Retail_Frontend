import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CategoryService } from 'src/app/core/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedCategoryId = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load products. Please try again.',
          confirmButtonColor: '#4F46E5'
        });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not load categories.',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    if (this.selectedCategoryId) {
      filtered = filtered.filter(p => p.categoryId === +this.selectedCategoryId);
    }

    this.filteredProducts = filtered;
  }

  onCategoryChange(event: any): void {
    this.selectedCategoryId = event.target.value;
    this.applyFilters();
  }
}