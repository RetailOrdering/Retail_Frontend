import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.currentUserSubject.next(JSON.parse(stored));
  }

  login(email: string, password: string): Observable<User> {
    // Mock: accept any email/password, create admin if email includes 'admin'
    const mockUser: User = {
      id: Math.floor(Math.random() * 1000),
      name: email.split('@')[0],
      email,
      passwordHash: 'mockhash',
      role: email.includes('admin') ? 'Admin' : 'Customer',
      createdAt: new Date()
    };
    return of(mockUser).pipe(
      delay(500),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(userData: { name: string; email: string; password: string }): Observable<User> {
    const newUser: User = {
      id: Math.floor(Math.random() * 1000),
      name: userData.name,
      email: userData.email,
      passwordHash: 'mockhash',
      role: 'Customer',
      createdAt: new Date()
    };
    return of(newUser).pipe(delay(500));
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}