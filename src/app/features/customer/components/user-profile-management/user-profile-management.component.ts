import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
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
export class UserProfileManagementComponent implements OnInit {
  userProfile: any;
  currentRoute: string = '';
  showEditModal = false;
  showChangePasswordModal = false;
  showChangeAvatarModal = false;
  isDropdownOpen: boolean = false;
  userId: any;

  constructor(
    private customerService: CustomerService,
    private userProfileService: UserProfileService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    // Listen for updates from the profile service
    this.userProfileService.userProfile$.subscribe((profile) => {
      if (profile) {
        this.userProfile = profile;
      }
    });
  }

  loadUserProfile(): void {
    this.customerService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data.data;
        this.userProfileService.setUserProfile(data.data);
        this.userId = this.userProfile.id;
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

  // Function to handle "Change Password" action
  onChangePassword(): void {
    this.isDropdownOpen = false;
    this.showChangePasswordModal = true
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
  }

  onChangeAvatar(): void {
    this.isDropdownOpen = false;
    this.showChangeAvatarModal = true;
  }

  closeChangeAvatarModal(): void {
    this.showChangeAvatarModal = false;
  }

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
  }
}
