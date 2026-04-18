export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  packaging: string;
  brand: string;
  categoryId: number;
  stock: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}