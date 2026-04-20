import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LoyaltyPoint } from 'src/app/models/user';
import { RedeemPointsRequest } from 'src/app/models/dto-models';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  constructor(private http: HttpClient) {}

  // ✅ Fix: Extract the numeric points value from backend response
  getPoints(): Observable<number> {
    return this.http.get<any>(`${environment.apiUrl}/Loyalty/points`).pipe(
      map(response => {
        // If response is already a number, return it
        if (typeof response === 'number') return response;
        // If response is an object with a points property
        if (response && typeof response.points === 'number') return response.points;
        // If response is an object with a loyaltyPoints property
        if (response && typeof response.loyaltyPoints === 'number') return response.loyaltyPoints;
        // Fallback: log warning and return 0
        console.warn('Unexpected points response format:', response);
        return 0;
      })
    );
  }

  getHistory(): Observable<LoyaltyPoint[]> {
    return this.http.get<LoyaltyPoint[]>(`${environment.apiUrl}/Loyalty/history`);
  }

  redeemPoints(request: RedeemPointsRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Loyalty/redeem`, request);
  }
}