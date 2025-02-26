import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';
import { CustomerService } from '../../../features/customer/services/customer.service';
import { NavigationEnd, Router } from '@angular/router';
import { SsrService } from '../../../core/services/ssr.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit, OnDestroy, OnInit {
  userProfile: any;
  isScrolled = false;
  private mainContent: HTMLElement | null = null;
  isProfileOpen: boolean = false;
  isLoggedIn: boolean = false;
  username: string = '';
  isHomepage: boolean = false;

  constructor(
    private customerService: CustomerService,
    private userStorageService: UserStorageService,
    public router: Router,
    private ssrService: SsrService,
  ) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomepage = this.router.url === '/homepage' || this.router.url === '/';
      }
    });
  }

  checkLoginStatus() {
    const user = this.userStorageService.getUser();
    if (user) {
      this.isLoggedIn = true;
      this.username = user.username;
      this.loadUserProfile();
    } else {
      this.isLoggedIn = false;
    }
  }

  loadUserProfile(): void {
    this.customerService.getUserProfile().subscribe({
      next: (data) => {
        if (data?.data) {
          this.userProfile = data.data;
        }
      },
      error: (err) => {
        console.error('Error loading user profile', err);
      },
    });
  }

  toggleProfileMenu() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  closeProfileMenu() {
    this.isProfileOpen = false;
  }

  goHomepage(): void {
    this.router.navigate(['/homepage']);
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      this.mainContent = document.getElementById('main-content');
      if (this.mainContent) {
        this.mainContent.addEventListener('scroll', this.onScroll);
      }
    }
  }

  ngOnDestroy() {
    if (this.mainContent) {
      this.mainContent.removeEventListener('scroll', this.onScroll);
    }
  }

  onScroll = () => {
    if (this.mainContent && this.isHomepage) {
      const scrollPosition = this.mainContent.scrollTop;
      this.isScrolled = scrollPosition > 300;
    }
  };

  onLogout() {
    UserStorageService.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/homepage']);
  }
}
