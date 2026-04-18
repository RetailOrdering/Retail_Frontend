import { OrderItem } from './order-item';

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  address: string;
  paymentMethod: string;  // 'COD', 'Card', etc.
  couponCode?: string;
  discountAmount: number;
  items: OrderItem[];
}