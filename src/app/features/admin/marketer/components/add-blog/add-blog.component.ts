import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Blog } from '../../../../../core/models/blog.model';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { CommonModule } from '@angular/common';
import { BlogLoadingComponent } from '../../../../../shared/components/blog-loading/blog-loading.component';
import { BlogContentComponent } from '../blog-detail/blog-content/blog-content.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-add-blog',
  imports: [
      ReactiveFormsModule,
      CommonModule,
      BlogContentComponent,
      NgMultiSelectDropDownModule,
      BlogLoadingComponent,
      FormsModule
    ],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.css'
})
export class AddBlogComponent {
  editBlogForm!: FormGroup;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    imagePreview: string | null = null;
    selectedFile: File | null = null;
    blog!: Blog;
  
    dropdownList: any = [];
    dropdownSettings: IDropdownSettings = {};
    selectedItems: any = [];
  
    isLoading: boolean = true;
  
  
    constructor(private blogService: BlogService,
      private fb: FormBuilder,
      private router: Router) { }
  
    ngOnInit(): void {
  
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 5,
        searchPlaceholderText: 'Search Tags Name',
        allowSearchFilter: true
      };
  
      this.editBlogForm = this.fb.group({
        id: [null, Validators.required],
        title: [null, Validators.required],
        description: [null, Validators.required],
        content: ['', Validators.required],
        tags: [null, Validators.required],
        thumbnailImageUrl: [null]
      });
      

      this.getAllTags();
      
    }
  
    onItemSelect(item: any) {
      console.log(item);
      console.log(this.selectedItems);
    }
    onSelectAll(items: any) {
      console.log(items);
    }
  
    onDeSelect(item: any) {
      console.log(item);
      console.log(this.selectedItems);
    }
    
  
    getAllTags(): void {
      this.blogService.getAllTags().subscribe({
        next: (response) => {
          this.isLoading = false;
          this.dropdownList = response.data.map((tag: { id: string, name: string }) => {
            return {
              item_id: tag.id,
              item_text: tag.name
            };
          });
  
        }
      });
    }
  

    resetItems(): void {
      this.selectedItems = this.selectedItems.map((tag: any) => ({
        item_id: tag.id,
        item_text: tag.name
      }));
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


      if (this.selectedItems.length <= 0) {
        this.errorMessage = 'Please select at least one tag.';
      } else if (!this.selectedFile) {
        this.errorMessage = 'Please select Image File';
      } else {
        this.blogService.uploadImage(this.selectedFile).subscribe({
          next: (response) => {
            this.editBlogForm.get('thumbnailImageUrl')?.setValue(response.data);
            this.editBlogForm.get('tags')?.setValue(this.selectedItems.map((tag: any) => ({ id: tag.item_id, name: tag.item_text })));
            this.addBlog(this.editBlogForm.value);
          }
        });
      } 
  
      this.resetItems();
  
    }

    addBlog(formData: any): void {
        this.blogService.update(formData, formData.id)
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
