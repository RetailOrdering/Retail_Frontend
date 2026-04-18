export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;   // snapshot price
  // Optional for UI convenience
  productName?: string;
  totalPrice?: number;
}