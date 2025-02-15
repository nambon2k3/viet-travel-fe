import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../services/blog.service';
import { CommonModule } from '@angular/common';
import { Blog } from '../../../../../core/models/blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { BlogContentComponent } from './blog-content/blog-content.component';

@Component({
  selector: 'app-blog-detail',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BlogContentComponent
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent {
  editBlogForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  blogId: number | null = null;
  blog!: Blog;

  constructor(private blogService: BlogService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.editBlogForm = this.fb.group({
      id: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      content: [null, Validators.required],
      tags: [null, Validators.required],
      authorName: [null, Validators.required],
      thumbnailImageUrl: [null]
    });
    

    this.route.queryParams.subscribe(params => {
      this.blogId = params['id'];
      if (this.blogId) {
        this.getBlogById(this.blogId);
      }
    });
  }


  getBlogById(id: number): void {
    this.blogService.getBlogById(id).subscribe({
      next: (response) => {
        this.blog = response.data;
        
        // Đảm bảo patchValue có cấu trúc giống với form
        this.editBlogForm.patchValue({
          id: this.blog.id,
          title: this.blog.title,
          description: this.blog.description,
          content: this.blog.content,
          tags: this.blog.tags.map((tag) => tag.name).join(', '),
          authorName: this.blog.author.fullName,
          thumbnailImageUrl: this.blog.thumbnailImageUrl
        });
        
        if (this.blog.thumbnailImageUrl) {
          this.imagePreview = this.blog.thumbnailImageUrl;
        }
      }
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

  onCancel(): void {
    this.router.navigate(['/marketer/blog']);
  }

  saveChanges(): void {
    const formData = this.editBlogForm.value;
    formData.tags = formData.tags.split(',').map((tag: string) => tag.trim());


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
