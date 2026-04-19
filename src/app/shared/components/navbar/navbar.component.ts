import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { LoyaltyService } from '../../../core/services/loyalty.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  isScrolled = false;

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
          this.cartItemCount = 0;
          this.loyaltyPoints = 0;
        }
      },
      error: (err) => console.error('Auth error', err)
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
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
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.userMenuOpen = false;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
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

  async logout(): Promise<void> {
    const result = await Swal.fire({
      title: 'Leaving so soon?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#C84B31',
      cancelButtonColor: '#9A9AAE',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Stay',
      // borderRadius: '12px',
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      }
    });

    if (result.isConfirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
      Swal.fire({
        title: 'See you soon!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.cartSub?.unsubscribe();
    this.loyaltySub?.unsubscribe();
  }
}