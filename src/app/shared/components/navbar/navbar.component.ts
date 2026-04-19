import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userRole = '';
  userName = '';
  cartItemCount = 0;
  mobileMenuOpen = false;
  userMenuOpen = false;

  private userSub?: Subscription;
  private cartSub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe({
      next: (user) => {
        this.isLoggedIn = !!user;
        this.userRole = user?.role || '';
        this.userName = user?.name || user?.email || 'User';
        // If user logs out, clear cart count
        if (!this.isLoggedIn) {
          this.cartItemCount = 0;
        }
      },
      error: (err) => console.error('Auth error', err)
    });

    this.cartSub = this.cartService.cartItems$.subscribe({
      next: (items) => {
        this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      },
      error: (err) => console.error('Cart error', err)
    });
  }

  get userNameInitial(): string {
    return this.userName ? this.userName.charAt(0).toUpperCase() : '👤';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }
}