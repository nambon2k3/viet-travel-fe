import { Component } from '@angular/core';
import { BlogService } from '../../../../admin/marketer/components/services/blog.service';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent {
  constructor(
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {
    this.blogService.getBlogById(7).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error('Failed to load blog:', err);
      }
    });
  }
}
