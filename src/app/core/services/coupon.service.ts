import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from 'src/app/models/coupon';
import { CreateCouponDto } from 'src/app/models/dto-models';
import { environment } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class CouponService {
  constructor(private http: HttpClient) {}

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${environment.apiUrl}/Coupon`);
  }

  createCoupon(coupon: CreateCouponDto): Observable<Coupon> {
    return this.http.post<Coupon>(`${environment.apiUrl}/Coupon`, coupon);
  }

  validateCoupon(code: string, orderTotal: number): Observable<Coupon | null> {
    return this.http.post<Coupon | null>(`${environment.apiUrl}/Coupon/validate`, { code, orderTotal });
  }

  updateCoupon(id: number, coupon: Partial<Coupon>): Observable<Coupon> {
    return this.http.put<Coupon>(`${environment.apiUrl}/Coupon/${id}`, coupon);
  }

  deleteCoupon(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/Coupon/${id}`);
  }

  toggleCouponStatus(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/Coupon/${id}/toggle`, {});
  }
}