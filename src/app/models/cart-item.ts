export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  productName?: string;  // for UI convenience
  quantity: number;
  price: number;
  addedAt: Date;
}