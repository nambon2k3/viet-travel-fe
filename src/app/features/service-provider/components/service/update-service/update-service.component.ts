// src/app/features/service-provider/components/service/update-service/update-service.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { ApiResponse } from '../../../../../core/models/api-response.model';
import { ServiceResponse, RoomWithDisplay, MealWithDisplay, TransportWithDisplay } from '../../../../../core/models/service.model';
import { NgMultiSelectDropDownModule, IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-update-service',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgMultiSelectDropDownModule],
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.css']
})
export class UpdateServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isLoading: boolean = true;
  service!: ServiceResponse;

  roomOptions: RoomWithDisplay[] = [];
  mealOptions: MealWithDisplay[] = [];
  transportOptions: TransportWithDisplay[] = [];
  selectedRooms: RoomWithDisplay[] = [];
  selectedMeals: MealWithDisplay[] = [];
  selectedTransports: TransportWithDisplay[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'displayText',
    selectAllText: 'Chọn tất cả',
    unSelectAllText: 'Bỏ chọn tất cả',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      nettPrice: [null, [Validators.required, Validators.min(0)]],
      sellingPrice: [null, [Validators.required, Validators.min(0)]],
      imageUrl: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      deleted: [false],
      categoryId: [null, Validators.required],
      categoryName: [null],
      providerId: [null, Validators.required],
      providerName: [null],
      roomDetails: [[]],
      mealDetails: [[]],
      transportDetails: [[]]
    });

    this.loadDropdownOptions();

    const id = this.route.snapshot.paramMap.get('id');
    console.log('Service ID from route:', id);
    if (id) {
      const parsedId = parseInt(id, 10);
      if (!isNaN(parsedId)) {
        this.loadService(parsedId);
      } else {
        this.errorMessage = 'ID dịch vụ không hợp lệ.';
        this.isLoading = false;
        console.error('Invalid service ID:', id);
      }
    } else {
      this.errorMessage = 'Không tìm thấy ID dịch vụ.';
      this.isLoading = false;
      console.error('No service ID found in route');
    }
  }

  loadDropdownOptions(): void {
    this.roomOptions = [
      { id: 1, capacity: 2, availableQuantity: 10, deleted: false, serviceId: 0, facilities: 'TV, Wifi', createdAt: '', updatedAt: '', displayText: 'Phòng 2 người (TV, Wifi)' },
      { id: 2, capacity: 4, availableQuantity: 5, deleted: false, serviceId: 0, facilities: 'AC, Balcony', createdAt: '', updatedAt: '', displayText: 'Phòng 4 người (AC, Balcony)' }
    ];
    this.mealOptions = [
      { id: 1, type: 'BREAKFAST', serviceId: 0, deleted: false, mealDetail: 'Buffet sáng', createdAt: '', updatedAt: '', displayText: 'Bữa sáng - Buffet sáng' },
      { id: 2, type: 'LUNCH', serviceId: 0, deleted: false, mealDetail: 'Cơm trưa', createdAt: '', updatedAt: '', displayText: 'Bữa trưa - Cơm trưa' }
    ];
    this.transportOptions = [
      { id: 1, seatCapacity: 50, deleted: false, serviceId: 0, createdAt: '', updatedAt: '', displayText: 'Xe bus 50 chỗ' },
      { id: 2, seatCapacity: 4, deleted: false, serviceId: 0, createdAt: '', updatedAt: '', displayText: 'Xe máy 4 chỗ' }
    ];
    console.log('Dropdown options loaded:', { roomOptions: this.roomOptions, mealOptions: this.mealOptions, transportOptions: this.transportOptions });
  }

  loadService(id: number): void {
    console.log('Fetching service details for ID:', id);
    this.serviceService.getServiceDetails(id).subscribe({
      next: (response: ApiResponse<any>) => {
        console.log('API response:', response);
        if (response.code === 200) {
          this.service = response.data;
          console.log('Service data received:', this.service);

          this.imagePreview = this.service.imageUrl || null;
          this.selectedRooms = this.service.roomDetails ? [{ ...this.service.roomDetails, displayText: `Phòng ${this.service.roomDetails.capacity} người (${this.service.roomDetails.facilities})` }] : [];
          this.selectedMeals = this.service.mealDetails ? [{ ...this.service.mealDetails, displayText: `Bữa ${this.service.mealDetails.type} - ${this.service.mealDetails.mealDetail}` }] : [];
          this.selectedTransports = this.service.transportDetails ? [{ ...this.service.transportDetails, displayText: `Phương tiện ${this.service.transportDetails.seatCapacity} chỗ` }] : [];

          console.log('Selected items:', {
            selectedRooms: this.selectedRooms,
            selectedMeals: this.selectedMeals,
            selectedTransports: this.selectedTransports
          });

          const formData = {
            id: this.service.id,
            name: this.service.name,
            nettPrice: this.service.nettPrice,
            sellingPrice: this.service.sellingPrice,
            imageUrl: this.service.imageUrl,
            startDate: this.service.startDate,
            endDate: this.service.endDate,
            deleted: this.service.deleted,
            categoryId: this.service.categoryId,
            categoryName: this.service.categoryName,
            providerId: this.service.providerId,
            providerName: this.service.providerName,
            roomDetails: this.selectedRooms,
            mealDetails: this.selectedMeals,
            transportDetails: this.selectedTransports
          };
          console.log('Form data to patch:', formData);
          this.serviceForm.patchValue(formData);
          console.log('Form value after patch:', this.serviceForm.value);
          this.isLoading = false;
        } else {
          // Xử lý lỗi 404 hoặc các mã khác
          this.errorMessage = response.message || 'Không thể tải thông tin dịch vụ.';
          this.isLoading = false;
          console.error('API returned non-success code:', response.code, response.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Không thể tải thông tin dịch vụ: ${err.status} - ${err.error?.message || 'Meal not found hoặc lỗi khác, vui lòng kiểm tra backend.'}`;
        console.error('API error:', err);
        console.error('Error response:', err.error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCancel(): void {
    this.router.navigate(['/service-provider/service']);
  }

  saveChanges(): void {
    if (this.serviceForm.invalid) {
      this.errorMessage = 'Vui lòng kiểm tra lại thông tin.';
      console.error('Form invalid:', this.serviceForm.errors);
      return;
    }

    this.isLoading = true;
    const formData = this.serviceForm.getRawValue();
    console.log('Form data to submit:', formData);

    if (this.selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', this.selectedFile);
      this.serviceService.uploadImage(uploadData).subscribe({
        next: (response: ApiResponse<any>) => {
          if (response.code === 200) {
            formData.imageUrl = response.data;
            this.submitForm(formData);
          } else {
            this.isLoading = false;
            this.errorMessage = 'Tải lên hình ảnh thất bại.';
            console.error('Image upload failed:', response);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Lỗi khi tải lên hình ảnh: ' + (err.message || 'Vui lòng thử lại.');
          console.error('Image upload error:', err);
        }
      });
    } else {
      this.submitForm(formData);
    }
  }

  submitForm(formData: any): void {
    formData.roomDetails = this.selectedRooms.length > 0 ? this.selectedRooms[0] : null;
    formData.mealDetails = this.selectedMeals.length > 0 ? this.selectedMeals[0] : null;
    formData.transportDetails = this.selectedTransports.length > 0 ? this.selectedTransports[0] : null;
    console.log('Final data to submit:', formData);

    this.serviceService.updateService(formData.id, formData).subscribe({
      next: (response: ApiResponse<any>) => {
        this.isLoading = false;
        if (response.code === 200) {
          this.successMessage = 'Cập nhật dịch vụ thành công.';
          this.errorMessage = null;
          //this.router.navigate(['/service-provider/service']);
          console.log('Update successful:', response);
        } else {
          this.errorMessage = response.message || 'Cập nhật dịch vụ thất bại.';
          this.successMessage = null;
          console.error('Update failed:', response);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Lỗi khi cập nhật dịch vụ: ' + (err.message || 'Vui lòng thử lại.');
        console.error('Update error:', err);
      }
    });
  }
}