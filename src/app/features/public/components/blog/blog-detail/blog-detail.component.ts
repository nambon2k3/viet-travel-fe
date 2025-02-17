import { Component } from '@angular/core';
import { Blog } from '../../../../../core/models/blog.model';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../../admin/marketer/services/blog.service';
import { BlogLoadingComponent } from "../../../../../shared/components/blog-loading/blog-loading.component";

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, BlogLoadingComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent {

  blog: Blog | undefined;
  isLoading: boolean = true;


  constructor(
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {
    this.blogService.getBlogById(11).subscribe({
      next: (response) => {
        this.blog = response.data;
        this.isLoading = false;
        console.log('Blog:', this.blog);
      },
      error: (err) => {
        console.error('Failed to load blog:', err);
      }
    });
  }
}
