import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogComponent } from "../../../../../public/components/blog/blog.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BlogContentComponent } from '../../../../marketer/components/blog-detail/blog-content/blog-content.component';

@Component({
  selector: 'app-update-tour-day',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    BlogContentComponent,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './update-tour-day.component.html',
  styleUrls: ['./update-tour-day.component.css']
})
export class UpdateTourDayComponent {
  editTourForm!: FormGroup;
  description: string | null = null;

  constructor(
    private router : Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
      this.editTourForm = this.fb.group({
        tourName: [null, Validators.required],
        authorName: [null, Validators.required],
        description: [null, Validators.required],
      });
    }

  onCancel() {
    this.router.navigate(['/head-business/tour-day']);
  }
}