import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product';
import { CreateProductDto, UpdateProductDto } from '../../../models/dto-models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openAddModal(): void {
    // Simple prompt – you can replace with a proper modal form
    Swal.fire({
      title: 'Add Product',
      html: `<input id="name" class="swal2-input" placeholder="Name">
             <input id="price" class="swal2-input" type="number" placeholder="Price">
             <input id="stock" class="swal2-input" type="number" placeholder="Stock">
             <input id="categoryId" class="swal2-input" type="number" placeholder="Category ID">`,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const stock = parseInt((document.getElementById('stock') as HTMLInputElement).value);
        const categoryId = parseInt((document.getElementById('categoryId') as HTMLInputElement).value);
        if (!name || isNaN(price) || isNaN(stock) || isNaN(categoryId)) {
          Swal.showValidationMessage('Please fill all fields');
          return false;
        }
        return { name, price, stock, categoryId, description: '', packaging: '', brand: '' };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const dto: CreateProductDto = { ...result.value, description: '', packaging: '', brand: '', isAvailable: true };
        this.productService.createProduct(dto).subscribe({
          next: () => {
            Swal.fire('Success', 'Product added', 'success');
            this.loadProducts();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to add product', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  openEditModal(product: Product): void {
    Swal.fire({
      title: 'Edit Product',
      html: `<input id="name" class="swal2-input" value="${product.name}">
             <input id="price" class="swal2-input" type="number" value="${product.price}">
             <input id="stock" class="swal2-input" type="number" value="${product.stock}">
             <input id="isAvailable" type="checkbox" ${product.isAvailable ? 'checked' : ''}> Available`,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const stock = parseInt((document.getElementById('stock') as HTMLInputElement).value);
        const isAvailable = (document.getElementById('isAvailable') as HTMLInputElement).checked;
        return { name, price, stock, isAvailable };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const dto: UpdateProductDto = result.value;
        this.productService.updateProduct(product.id, dto).subscribe({
          next: () => {
            Swal.fire('Success', 'Product updated', 'success');
            this.loadProducts();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to update product', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Product removed', 'success');
            this.loadProducts();
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to delete', 'error');
            console.error(err);
          }
        });
      }
    });
  }
}