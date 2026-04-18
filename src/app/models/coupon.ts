export interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  expiryDate: Date;
  isActive: boolean;
  minimumOrderAmount: number;
}