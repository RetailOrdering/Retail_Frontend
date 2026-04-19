import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user';
import { environment } from 'src/environments/environments';

// Flexible login response – backend might send token under different keys
interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
  token?: string;        // standard
  accessToken?: string;  // alternative key
  [key: string]: any;    // allow any other fields
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
          console.log('🔐 Login response received:', res);
          
          // Extract token – try 'token' first, then 'accessToken'
          const token = res.token || res.accessToken;
          if (!token) {
            console.error('❌ No token in login response! Response structure:', res);
            return;
          }
          console.log('✅ Token extracted (first 15 chars):', token.substring(0, 15) + '...');
          
          const user: User = {
            id: res.id,
            name: res.name,
            email: res.email,
            role: res.role,
            passwordHash: '',
            createdAt: new Date(),
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', token);          // store as 'token'
          this.currentUserSubject.next(user);
          
          console.log('✅ User stored, token saved. User role:', user.role);
        },
        error: (err) => {
          console.error('❌ Login API error:', err);
          if (err.status === 500) {
            console.error('⚠️ Backend 500 error – check server logs (likely duplicate email or validation)');
          }
        }
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('🔓 Logged out, storage cleared');
  }

  register(userData: { name: string; email: string; password: string }): Observable<any> {
    console.log('📝 Registering user:', userData.email);
    return this.http.post(`${environment.apiUrl}/Auth/register`, userData).pipe(
      tap({
        next: () => console.log('✅ Registration successful'),
        error: (err) => console.error('❌ Registration error:', err)
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}