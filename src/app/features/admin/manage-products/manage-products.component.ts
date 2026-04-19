import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { CreateProductDto, UpdateProductDto } from '../../../models/dto-models';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  error = '';
  showForm = false;
  editingProduct: Product | null = null;

  formData: CreateProductDto = {
    name: '',
    description: '',
    price: 0,
    packaging: '',
    brand: '',
    categoryId: 0,
    stock: 0,
    isAvailable: true
  };

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: (err) => { this.error = 'Failed to load products'; this.loading = false; }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  openCreateForm(): void {
    this.editingProduct = null;
    this.formData = { name: '', description: '', price: 0, packaging: '', brand: '', categoryId: 0, stock: 0, isAvailable: true };
    this.showForm = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.formData = { ...product };
    this.showForm = true;
  }

  deleteProduct(id: number): void {
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Delete failed')
      });
    }
  }

  submitForm(): void {
    if (this.editingProduct) {
      const updateDto: UpdateProductDto = this.formData;
      this.productService.updateProduct(this.editingProduct.id, updateDto).subscribe({
        next: () => { this.loadProducts(); this.showForm = false; },
        error: (err) => alert('Update failed')
      });
    } else {
      this.productService.createProduct(this.formData).subscribe({
        next: () => { this.loadProducts(); this.showForm = false; },
        error: (err) => alert('Create failed')
      });
    }
  }

  cancelForm(): void { this.showForm = false; }
}