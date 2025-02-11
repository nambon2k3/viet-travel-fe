import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from '../../../../../shared/components/table/table-action/table-action.component';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../../../../../core/models/blog.model';
import { BlogService } from '../services/blog.service';

@Component({
  selector: 'app-list-blog',
  imports: [TableActionComponent, TableFooterComponent,  TableHeaderComponent],
  templateUrl: './list-blog.component.html',
  styleUrl: './list-blog.component.css'
})
export class ListBlogComponent {
  blogs = signal<Blog[]>([]);
  totalItems = 0;
  page = 0;
  size = 10;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }


  loadBlogs(): void {
    this.blogService.getBlogByPage(this.page, this.size).subscribe({
      next: (response) => {
        this.blogs = response.data.items;
        this.totalItems = response.data.total;
        this.page = response.data.page;
        this.size = response.data.size;
      },
      error: (err) => {
        console.error('Failed to load blogs:', err);
      },
    });
  }
  

  public toggleUsers(isChecked: boolean): void {

    
  }


  filteredUsers = computed(() => {
    return this.blogs();
  });


}
