import { Component } from '@angular/core';
import { BlogService } from '../../../../admin/marketer/components/services/blog.service';
import { Blog } from '../../../../../core/models/blog.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe],
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
