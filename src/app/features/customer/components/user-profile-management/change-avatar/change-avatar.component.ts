import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { UserProfileService } from '../../../services/user-profile.service';

@Component({
  selector: 'app-change-avatar',
  imports: [
    CommonModule
  ],
  templateUrl: './change-avatar.component.html',
  styleUrl: './change-avatar.component.css'
})
export class ChangeAvatarComponent {
  @Output() closeModal = new EventEmitter<void>();
  @Input() userId: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private customerService: CustomerService,
    private userProfileService: UserProfileService
  ) { }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            this.previewUrl = e.target.result as string | ArrayBuffer;
          }
        };
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  removeSelectedFile(): void {
    this.selectedFile = null;

    // Tạo một input mới để reset giá trị của input file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
      this.previewUrl = null;
    }
  }

  uploadAvatar(): void {
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('avatar', this.selectedFile);
  
    console.log(this.userId, formData);
    this.customerService.changeAvatar(this.userId, formData).subscribe({
      next: (response) => {
        this.successMessage = response.message;
  
        // Cập nhật avatar trong service (giả sử response.data.avatar chứa URL ảnh)
        if (response?.data?.avatar) {
          this.userProfileService.setUserAvatar(response.data.avatar);
        }
  
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Error: ' + err.message;
      }
    });
  }
  

}
