export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;   // only used on login/register, not stored in frontend state
  role: 'Admin' | 'Customer';
  createdAt: Date;
  // navigation (optional)
  loyaltyPoint?: LoyaltyPoint;
}

export interface LoyaltyPoint {
  id: number;
  userId: number;
  points: number;
  lastUpdated: Date;
}