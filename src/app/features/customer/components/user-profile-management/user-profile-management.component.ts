import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStorageService } from '../../../../core/services/user-storage/user-storage.service';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule
  ],
  templateUrl: 'user-profile-management.component.html',
  styleUrl: 'user-profile-management.component.css'
})
export class UserProfileManagementComponent {

  logout(){
    UserStorageService.signOut();
  }
}
