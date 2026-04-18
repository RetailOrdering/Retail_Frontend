import { Order } from "./order";

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'Customer';
  createdAt: Date;
  orders?: Order[];
  loyaltyPoint?: LoyaltyPoint;
}

export interface LoyaltyPoint {
  id: number;
  userId: number;
  points: number;
  description: string;
  type: string;
  createdAt: Date;
  lastUpdated: Date;
}