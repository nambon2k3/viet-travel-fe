import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogContentComponent } from '../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    BlogContentComponent],
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent {
  highlight : string | null = null;
  editTourForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.editTourForm = this.fb.group({
      tourName: [null, Validators.required],
      authorName: [null, Validators.required],
      destination: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      duration: [null, Validators.required],
      nights: [null, Validators.required],
      highlights: [null, Validators.required],
      note: [null, Validators.required]
    });
  }

  onCancel() {
    this.router.navigate(['/head-business/list-tour']);
  }

  onSubmit() {
    console.log(this.editTourForm.value);
    console.log(this.editTourForm.get('highlights')?.value);
  }
}
