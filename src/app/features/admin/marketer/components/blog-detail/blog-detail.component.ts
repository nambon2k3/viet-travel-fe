import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../services/blog.service';
import { CommonModule } from '@angular/common';
import { Blog } from '../../../../../core/models/blog.model';
import { BlogContentComponent } from "./blog-content/blog-content.component";
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  imports: [ReactiveFormsModule, CommonModule, BlogContentComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent {
  editBlogForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  blog: Blog = <Blog>{};

  constructor(private blogService: BlogService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {

    const navigation = this.router.getCurrentNavigation();
    this.blog = navigation?.extras.state?.['blog'];


    this.editBlogForm = this.fb.group({
      id: [this.blog.id, Validators.required],
      title: [this.blog.title, Validators.required],  // Corrected binding
      description: [this.blog.description, Validators.required],
      content: [this.blog.content, Validators.required],
      tags: [this.blog.tags?.map(tag => tag.name).join(', '), Validators.required],
      authorName: [this.blog.author?.fullName, Validators.required]
    });

    
    
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  saveChanges(): void {



    const formData = this.editBlogForm.value;

    this.blogService.update(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while updating blog.';
          this.errorMessage = apiError;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;

        } else if (!response) {

        } else {
          this.errorMessage = response?.message || 'An error occurred while updating blog.';
          this.successMessage = null;
        }
      });
  }

}
