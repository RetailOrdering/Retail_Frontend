import { OrderItem } from './order-item';

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  address: string;
  paymentMethod: string;
  couponCode?: string;
  discountAmount: number;
  updatedAt?: Date;
  items: OrderItem[];
}