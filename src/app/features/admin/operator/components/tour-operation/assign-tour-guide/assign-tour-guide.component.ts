import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TourService } from '../../../services/tour.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-tour-guide',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-tour-guide.component.html',
  styleUrls: ['./assign-tour-guide.component.css']
})
export class AssignTourGuideComponent {
  @Input() scheduleId!: number;
  @Output() tourGuideAssigned = new EventEmitter<void>();

  assignForm!: FormGroup;
  tourGuides: any[] = []; // Khởi tạo mặc định là mảng rỗng
  id: number = 0;
  showDropdown: boolean = false;
  filteredTourGuides: any[] = []; // Khởi tạo mặc định là mảng rỗng

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.assignForm = this.fb.group({
      searchText: [''],
      tourGuideId: [null, Validators.required],
      meetingLocation: ['', Validators.required],
      departureHour: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
      departureMinute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      departureSecond: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      departureNano: [0]
    });

    this.route.queryParams.subscribe(params => {
      this.scheduleId = params['id'];
      if (this.scheduleId) {
        this.fetchTourGuides();
      }
    });

    this.assignForm.get('searchText')?.valueChanges.subscribe(value => {
      this.filterGuides(value);
      this.showDropdown = true;
    });
  }

  fetchTourGuides(): void {
    this.tourService.getListTourGuide(this.scheduleId).subscribe({
      next: (response: any) => {
        // Kiểm tra và xử lý response để đảm bảo là mảng
        if (Array.isArray(response)) {
          this.tourGuides = response;
        } else if (response && Array.isArray(response.data)) {
          // Trường hợp response là object chứa mảng trong thuộc tính 'data'
          this.tourGuides = response.data;
        } else {
          // Nếu không có dữ liệu hợp lệ, gán mảng rỗng
          this.tourGuides = [];
          console.warn('No valid tour guide data received from API');
        }
        this.filteredTourGuides = [...this.tourGuides]; // Sao chép mảng an toàn
      },
      error: (error: any) => {
        console.error('Error fetching tour guides:', error);
        this.tourGuides = []; // Gán mảng rỗng trong trường hợp lỗi
        this.filteredTourGuides = [];
      }
    });
  }

  filterGuides(query: string): void {
    const searchText = query?.toLowerCase() || '';
    this.filteredTourGuides = this.tourGuides.filter(guide =>
      guide.fullName?.toLowerCase().includes(searchText)
    );
  }

  selectGuide(guide: any) {
    this.assignForm.patchValue({
      searchText: guide.fullName,
      tourGuideId: guide.id
    });
    this.showDropdown = false;
  }

  assignGuide() {
    if (this.assignForm.valid) {
      const { departureHour, departureMinute, departureSecond } = this.assignForm.value;

      const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}:${departureSecond.toString().padStart(2, '0')}`;

      const formData = {
        departureTime: departureTime,
        tourGuideId: this.assignForm.value.tourGuideId,
        meetingLocation: this.assignForm.value.meetingLocation
      };

      this.tourService.assignTourGuide(this.scheduleId, formData).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.tourGuideAssigned.emit();
            this.assignForm.reset();
          } else {
            console.error('Error:', response.message);
          }
        },
        error: (error: any) => {
          console.error('Error assigning tour guide:', error);
        }
      });
    } else {
      console.error('Invalid form data');
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
}