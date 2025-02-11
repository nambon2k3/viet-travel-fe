import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Blog } from '../../../../../../core/models/blog.model';
import { BlogService } from '../../services/blog.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, DatePipe],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() blog: Blog = <Blog>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(private blogService: BlogService) {}


  hideBlog(): void {
    this.blogService.updateBlogStatus(this.blog.id, true).subscribe({
      next: (response) => {
        if(response.code === 200) {
          this.blog.deleted = true;
        }
      },
      error: (err) => {
        console.error('Failed to hide blog:', err);
      },
    });
  }

  showBlog(): void {
    this.blogService.updateBlogStatus(this.blog.id, false).subscribe({
      next: (response) => {
        if(response.code === 200) {
          this.blog.deleted = false;
        }
      },
      error: (err) => {
        console.error('Failed to show blog:', err);
      },
    });
  }

}
