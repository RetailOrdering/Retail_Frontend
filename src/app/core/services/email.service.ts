import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EmailService {
  sendOrderConfirmation(email: string, orderId: number): Observable<boolean> {
    console.log(`Mock email sent to ${email} for order #${orderId}`);
    return of(true).pipe(delay(500));
  }
}