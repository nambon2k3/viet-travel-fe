import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { Blog } from '../../../../../core/models/blog.model';
import { BlogService } from '../services/blog.service';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-blog',
  imports: [TableActionComponent, 
            TableFooterComponent,  
            TableHeaderComponent, 
            TableRowComponent],
  templateUrl: './list-blog.component.html',
  styleUrl: './list-blog.component.css'
})
export class ListBlogComponent {
  blogs = signal<Blog[]>([]);
  totalItems = 0;
  page = 0;
  size = 10;

  constructor(
    private router: Router,
    private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogByPage(this.page, this.size).subscribe({
      next: (response) => {
        this.blogs.set(response.data.items);
        this.totalItems = response.data.total;
        this.page = response.data.page;
        this.size = response.data.size;
      },
      error: (err) => {
        console.error('Failed to load blogs:', err);
      },
    });
  }

  openPostBlogDetail(): void {
    this.router.navigate(['/marketer/blog-details']);
  }
  
  public toggleBlogs(checked: boolean): void {
    this.blogs.update((blogs) => {
      return blogs.map((blog) => {
        return { ...blog, selected: checked };
      });
    });
    
  }

  filteredBlogs = computed(() => {
    return this.blogs();
  });

}
