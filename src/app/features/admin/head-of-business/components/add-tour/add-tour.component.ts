import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import { TourDetailHOB } from '../../../../../core/models/tour.model';
import { LocationService } from '../../services/location/location.service';
import { BlogContentComponent } from '../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { AdminService } from '../../../admin.service';

interface Location {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-tour',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    BlogContentComponent,
    NgSelectModule
  ],
  templateUrl: './add-tour.component.html',
  styleUrl: './add-tour.component.css'
})
export class AddTourComponent {
  highlight: string | null = null;
  editTourForm!: FormGroup;
  tourId: string | null = null;
  locations: Location[] = [];
  tags: Tag[] = [];
  dropdownList: Location[] = [];
  dropdownTagList: Tag[] = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownTagSettings: IDropdownSettings = {};
  searchText$ = new Subject<string>();

  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  previewImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tourService: TourService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false, // Cho phép chọn nhiều địa điểm
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Tìm kiếm địa điểm...',
    };

    this.dropdownTagSettings = {
      singleSelection: false, // Cho phép chọn nhiều thẻ
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      itemsShowLimit: 3,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Tìm kiếm tên Thẻ',
      allowSearchFilter: true
    };

    this.editTourForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      tagIds: [[], Validators.required],
      locationIds: [[], Validators.required],
      departLocationId: [[], Validators.required],
      numberDays: [null, Validators.required],
      numberNights: [null, Validators.required],
      highlights: [null, Validators.required],
      note: [null, Validators.required],
      tourType: ["SIC", Validators.required],
      tourStatus: ["PENDING_PRICING", Validators.required],
      privacy: [this.getPrivacy(), Validators.required],
      tourImages: [[]],
    });

    // Lấy tourId từ query params
    this.route.queryParams.subscribe(params => {
      this.tourId = params['id'] || null;
      if (this.tourId) {
        this.loadTourDetails(this.tourId);
      }
    });

    this.getAllTags();
    this.loadLocations();
  }

  loadTourDetails(id: string): void {
    this.tourService.getTourById(id).subscribe({
      next: (response: any) => {
        const tourData: TourDetailHOB = response.data;
        this.mapTourDataToForm(tourData);
      },
      error: (err: any) => {
        console.error('Failed to load tour details:', err);
      },
    });
  }

  loadLocations(keyword: string = ''): void {
    this.locationService.getLocationByPage(0, 100, keyword).subscribe({
      next: (response: any) => {
        this.locations = response.data.items;
        this.dropdownList = this.locations;
      },
      error: (err: any) => {
        console.error('Failed to load locations:', err);
      },
    });
  }

  getAllTags(): void {
    this.tourService.getAllTags().subscribe({
      next: (response) => {
        this.tags = response.data;
        this.dropdownTagList = this.tags;
      }
    });
  }

  mapTourDataToForm(tour: TourDetailHOB): void {
    this.editTourForm.patchValue({
      id: tour.id,
      name: tour.name,
      tagIds: tour.tags ? tour.tags.map(tag => tag.id) : [],
      locationIds: tour.locations ? tour.locations.map(location => location.id) : [],
      numberDays: tour.numberDays,
      numberNights: tour.numberNight,
      highlights: tour.highlights,
      note: tour.note,
      privacy: tour.privacy || this.getPrivacy(),
      tourImages: tour.tourImages || null,
    });

    this.highlight = tour.highlights;
  }

  onCancel(): void {
    this.router.navigate(['/head-business/list-tour']);
  }

  onSubmit(): void {
    const formData = this.editTourForm.value;
    if (this.tourId) {
      this.tourService.updateTour(formData).subscribe({
        next: (response: any) => {
          console.log('Tour updated successfully:', response);
          this.router.navigate(['/head-business/list-tour']);
        },
        error: (err: any) => {
          console.error('Failed to update tour:', err);
        },
      });
    } else {
      console.log('Creating new tour with data:', formData);
      // this.tourService.createTour(formData).subscribe({
      //   next: (response: any) => {
      //     console.log('Tour created successfully:', response);
      //     this.router.navigate(['/head-business/list-tour']);
      //   },
      //   error: (err: any) => {
      //     console.error('Failed to create tour:', err);
      //   },
      // });
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  confirmImage(): void {
    if (this.selectedFile && this.previewImage) {
      this.selectedFiles.push(this.selectedFile);
      this.imagePreviews.push(this.previewImage);
    }
  }
  
  saveChanges(): void {
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
  
    this.adminService.uploadImage(formData).subscribe({
      next: (response) => {
        const uploadedImages = response.data;
        const currentImages = this.editTourForm.get('tourImages')?.value || [];
        this.editTourForm.get('tourImages')?.setValue([...currentImages, ...uploadedImages]);
      },
      error: (err) => {
        console.error('Lỗi tải ảnh:', err);
      }
    });
  }  

  onSearch(event: any): void {
    const keyword = event || '';
    this.searchText$.next(keyword);
  }

  getPrivacy(): string {
    return `<h2>PHẦN I: ĐIỀU KIỆN BÁN VÉ CÁC CHƯƠNG TRÌNH DU LỊCH NỘI ĐỊA</h2>
    <h3>1. GIÁ VÉ DU LỊCH</h3>
    <p>Giá vé du lịch được tính theo tiền Đồng (Việt Nam - VND). Trường hợp khách thanh toán bằng ngoại tệ sẽ được quy đổi ra VND theo tỷ giá của Ngân hàng Đầu tư và Phát triển Việt Nam - Chi nhánh TP.HCM tại thời điểm thanh toán.</p>
    <p>Giá vé chỉ bao gồm những khoản được liệt kê một cách rõ ràng trong phần “Bao gồm” trong các chương trình du lịch. Vietravel không có nghĩa vụ thanh toán bất cứ chi phí nào không nằm trong phần “Bao gồm”.</p>
    <h3>2. GIÁ DÀNH CHO TRẺ EM</h3>
    <ul>
        <li><strong>Trẻ em dưới 5 tuổi:</strong> không thu phí dịch vụ, bố mẹ tự lo cho bé và thanh toán các chi phí phát sinh (đối với các dịch vụ tính phí theo chiều cao…). Hai người lớn chỉ được kèm 1 trẻ em dưới 5 tuổi, trẻ em thứ 2 sẽ đóng phí theo quy định dành cho độ tuổi từ 5 đến dưới 12 tuổi và phụ thu phòng đơn. Vé máy bay, tàu hỏa, phương tiện vận chuyển công cộng mua vé theo quy định của các đơn vị vận chuyển (nếu có).</li>
        <li><strong>Trẻ em từ 5 tuổi đến dưới 12 tuổi:</strong> 50% giá tour người lớn đối với tuyến xe, 75% giá tour người lớn đối với tuyến có vé máy bay (không có chế độ giường riêng). Hai người lớn chỉ được kèm 1 trẻ em từ 5 - dưới 12 tuổi, trẻ em thứ hai trở lên phải mua 1 suất giường đơn.</li>
        <li><strong>Trẻ em từ 12 tuổi trở lên:</strong> mua một vé như người lớn.</li>
    </ul>
    <h3>3. THANH TOÁN</h3>
    <p>Khi đăng ký, Quý khách vui lòng cung cấp đầy đủ thông tin và đóng một khoản tiền cọc để giữ chỗ. Số tiền cọc khác nhau tùy theo chương trình mà Quý khách chọn, số tiền còn lại sẽ thanh toán trước ngày khởi hành tối thiểu 05 ngày làm việc.</p>
    <p>Thanh toán bằng tiền mặt, cà thẻ tại văn phòng Vietravel hoặc chuyển khoản tới tài khoản ngân hàng của Vietravel.</p>
    <div class="bank-info">
        <p><strong>Tên Tài Khoản:</strong> Công ty CP Du lịch và Tiếp thị GTVT Việt Nam – Vietravel</p>
        <p><strong>Số Tài khoản:</strong> 190261 6659 4669</p>
        <p><strong>Ngân hàng:</strong> Techcombank - Chi nhánh TP.HCM</p>
    </div>`;
  }
}