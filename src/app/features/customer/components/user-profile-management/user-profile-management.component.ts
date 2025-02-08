import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { EditProfileModalComponent } from '../edit-profile/edit-profile.component';
import { UserProfileService } from '../../services/user-profile.service';
import { ChangePasswordComponent } from '../../../common/components/change-password/change-password.component';
import { ChangeAvatarComponent } from './change-avatar/change-avatar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EditProfileModalComponent,
    ChangePasswordComponent,
    ChangeAvatarComponent
  ],
  templateUrl: 'user-profile-management.component.html',
  styleUrls: ['user-profile-management.component.css'],
})
export class UserProfileManagementComponent implements OnInit, OnDestroy {
  userProfile: any;
  currentRoute: string = '';
  showEditModal = false;
  showChangePasswordModal = false;
  showChangeAvatarModal = false;
  isDropdownOpen: boolean = false;
  userId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private customerService: CustomerService,
    private userProfileService: UserProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();

    // Lắng nghe sự kiện thay đổi route
    this.subscriptions.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
        }
      })
    );

    // Lắng nghe thay đổi từ profile service
    this.subscriptions.add(
      this.userProfileService.userProfile$.subscribe((profile) => {
        if (profile) {
          this.userProfile = profile;
          this.userId = profile.id;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadUserProfile(): void {
    this.customerService.getUserProfile().subscribe({
      next: (data) => {
        if (data?.data) {
          this.userProfile = data.data;
          this.userProfileService.setUserProfile(data.data);
          this.userProfileService.setUserAvatar(data.data.avatarImg);
          this.userId = data.data.id;
        }
      },
      error: (err) => {
        console.error('Error loading user profile', err);
      },
    });
  }

  goToHome(): void {
    this.router.navigate(['/homepage']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Hàm mở/đóng modal đổi mật khẩu
  onChangePassword(): void {
    this.isDropdownOpen = false;
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
  }

  // Hàm mở/đóng modal đổi avatar
  onChangeAvatar(): void {
    this.isDropdownOpen = false;
    this.showChangeAvatarModal = true;
  }

  closeChangeAvatarModal(): void {
    this.showChangeAvatarModal = false;
  }

  // Hàm mở/đóng modal chỉnh sửa thông tin
  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
