import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Coupon } from '../../models/coupon';

@Injectable({ providedIn: 'root' })
export class CouponService {
  private mockCoupons: Coupon[] = [
    {
      id: 1,
      code: 'SAVE10',
      discountPercentage: 10,
      expiryDate: new Date('2026-12-31'),
      isActive: true,
      minimumOrderAmount: 20
    },
    {
      id: 2,
      code: 'WELCOME5',
      discountPercentage: 5,
      expiryDate: new Date('2026-10-01'),
      isActive: true,
      minimumOrderAmount: 10
    }
  ];

  validateCoupon(code: string, orderTotal: number): Observable<Coupon | null> {
    const coupon = this.mockCoupons.find(c => c.code === code && c.isActive && new Date() < c.expiryDate && orderTotal >= c.minimumOrderAmount);
    return of(coupon || null).pipe(delay(300));
  }
}