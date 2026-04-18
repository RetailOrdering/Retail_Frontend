export interface OrderItem {
product: any;
  id: number;
  orderId: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
}