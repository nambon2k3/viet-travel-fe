import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { UserStorageService } from '../../../core/services/user-storage/user-storage.service';
import { CustomerService } from '../../../features/customer/services/customer.service';

@Component({
  selector: 'app-header',
  imports:[
    CommonModule
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  userProfile: any;
  isScrolled = false;
  private mainContent: HTMLElement | null = null;
  isProfileOpen: boolean = false;

  constructor(
    private customerService: CustomerService
  ){}

  ngOnInit(): void {
    this.loadUserProfile();
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

  ngAfterViewInit() {
    // Lấy phần tử có id là main-content
    this.mainContent = document.getElementById('main-content');
    if (this.mainContent) {
      // Lắng nghe sự kiện scroll trên phần tử này
      this.mainContent.addEventListener('scroll', this.onScroll);
    }
  }

  ngOnDestroy() {
    // Cleanup khi component bị hủy
    if (this.mainContent) {
      this.mainContent.removeEventListener('scroll', this.onScroll);
    }
  }

  onScroll = () => {
    if (this.mainContent) {
      const scrollPosition = this.mainContent.scrollTop;
      this.isScrolled = scrollPosition > 300;
    }
  };

  onLogout(){
    UserStorageService.signOut();
  }
}
