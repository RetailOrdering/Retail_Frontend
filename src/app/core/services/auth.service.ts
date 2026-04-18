import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { environment } from 'src/environments/environments';

// Actual response from your backend (based on console log)
interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored && stored !== 'null' && stored !== 'undefined') {
      try {
        const user = JSON.parse(stored);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/Auth/login`, { email, password })
      .pipe(tap({
        next: (res) => {
          // Response has id, name, email, role, token directly
          const user: User = {
            id: res.id,
            name: res.name,
            email: res.email,
            role: res.role,
            passwordHash: '', // not needed client-side
            createdAt: new Date(),
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(user);
        },
        error: (err) => console.error('Login API error:', err)
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Auth/register`, userData);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}