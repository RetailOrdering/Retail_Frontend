import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoyaltyPoint } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  private mockPoints: { [userId: number]: number } = {
    1: 120,
    2: 45
  };

  getPoints(userId: number): Observable<number> {
    return of(this.mockPoints[userId] || 0).pipe(delay(200));
  }

  addPoints(userId: number, points: number): Observable<void> {
    if (!this.mockPoints[userId]) this.mockPoints[userId] = 0;
    this.mockPoints[userId] += points;
    return of(undefined).pipe(delay(200));
  }
}