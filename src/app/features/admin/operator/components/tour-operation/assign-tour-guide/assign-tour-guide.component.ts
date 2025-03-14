import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../../services/tour.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-tour-guide',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './assign-tour-guide.component.html',
  styleUrl: './assign-tour-guide.component.css'
})
export class AssignTourGuideComponent {
  assignForm!: FormGroup;

  showDropdown = false;
  id: number = 0;
  searchText = '';
  departureLocation = '';
  departureTime = '';
  notes = '';
  tourGuides: any[] = [];

  constructor(private route: ActivatedRoute,
    private tourService: TourService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.fetchTourGuides();
        // this.showModal();
      }
    });
  }

  fetchTourGuides(): void {
    this.tourService.getListTourGuide(this.id).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.tourGuides = response.data;
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Error fetching tour guides:', error);
      }
    });
  }

  assignGuide() {
    if (this.assignForm.valid) {
      const formData = this.assignForm.value;
      this.tourService.assignTourGuide(this.id, formData).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            console.log('Tour guide assigned successfully');
          } else {
            console.error('Error:', response.message);
          }
        }
      }
      );
      this.assignForm.reset({
        departureLocation: '',
        departureTime: '',
        notes: ''
      });
    } else {
      console.error('Invalid form data');
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectGuide(guide: any) {
    this.searchText = guide.name;
    this.showDropdown = false;
  }
}
