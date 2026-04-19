import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
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
  loyaltyPoints = 0;
  mobileMenuOpen = false;
  userMenuOpen = false;

  private userSub?: Subscription;
  private cartSub?: Subscription;
  private loyaltySub?: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private loyaltyService: LoyaltyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe({
      next: (user) => {
        this.isLoggedIn = !!user;
        this.userRole = user?.role || '';
        this.userName = user?.name || user?.email || 'User';

        if (this.isLoggedIn) {
          if (this.userRole !== 'Admin') {
            this.loadLoyaltyPoints();
            this.loadCart();
          }
        } else {
          // reset on logout
          this.cartItemCount = 0;
          this.loyaltyPoints = 0;
        }
      },
      error: (err) => console.error('Auth error', err)
    });
  }

  loadLoyaltyPoints(): void {
    this.loyaltySub = this.loyaltyService.getPoints().subscribe({
      next: (points) => this.loyaltyPoints = points,
      error: (err) => console.error('Loyalty error', err)
    });
  }

  loadCart(): void {
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
    if (!target.closest('.mobile-toggle') && !target.closest('.nav-links')) {
      this.mobileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.cartSub?.unsubscribe();
    this.loyaltySub?.unsubscribe();
  }
}