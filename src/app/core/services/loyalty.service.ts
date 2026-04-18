import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { LoyaltyPoint } from 'src/app/models/user';
import { RedeemPointsRequest } from 'src/app/models/dto-models';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  constructor(private http: HttpClient) {}

  getPoints(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/Loyalty/points`);
  }

  getHistory(): Observable<LoyaltyPoint[]> {
    return this.http.get<LoyaltyPoint[]>(`${environment.apiUrl}/Loyalty/history`);
  }

  redeemPoints(request: RedeemPointsRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Loyalty/redeem`, request);
  }
}