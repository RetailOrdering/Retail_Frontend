import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';
import { Modal } from 'bootstrap';
import { CreateProductDto } from 'src/app/models/dto-models';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  isEditMode = false;
  editId: number | null = null;
  formData: CreateProductDto = {
    name: '',
    description: '',
    price: 0,
    packaging: '',
    brand: '',
    categoryId: 1,
    stock: 0,
    isAvailable: undefined
  };
  private modal: any;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openModal(): void {
    this.isEditMode = false;
    this.editId = null;
    this.formData = {
      name: '',
      description: '',
      price: 0,
      packaging: '',
      brand: '',
      categoryId: 1,
      stock: 0
    };
    const modalElem = document.getElementById('productModal');
    this.modal = new Modal(modalElem!);
    this.modal.show();
  }

  editProduct(product: Product): void {
    this.isEditMode = true;
    this.editId = product.id;
    this.formData = {
      name: product.name,
      description: product.description,
      price: product.price,
      packaging: product.packaging,
      brand: product.brand,
      categoryId: product.categoryId,
      stock: product.stock,
      isAvailable: product.isAvailable
    };
    const modalElem = document.getElementById('productModal');
    this.modal = new Modal(modalElem!);
    this.modal.show();
  }

  saveProduct(): void {
    if (this.isEditMode && this.editId) {
      this.productService.updateProduct(this.editId, this.formData).subscribe(() => {
        this.modal.hide();
        this.loadProducts();
      });
    } else {
      this.productService.createProduct(this.formData).subscribe(() => {
        this.modal.hide();
        this.loadProducts();
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Delete this product permanently?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}