import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { Router } from '@angular/router';
import { Locations } from '../../../../../core/models/location.model';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-list-location',
  imports: [
        TableActionComponent,
        TableFooterComponent,
        TableHeaderComponent,
        TableRowComponent,
        CommonModule,
  ],
  templateUrl: './list-location.component.html',
  styleUrl: './list-location.component.css'
})
export class ListLocationComponent {
  location = signal<Locations[]>([]);
    totalItems = 0;
    page = 0;
    size = 10;
    totalPages = signal(0); 
  
    constructor(
      private locationService: LocationService,
      private router : Router
    ) { }
  
    ngOnInit(): void {
      this.loadLocation();
    }
  
    loadLocation(): void {
      this.locationService.getLocationByPage(this.page, this.size).subscribe({
        next: (response) => {
          this.location.set(response.data.items);
          this.totalItems = response.data.total;
          this.page = response.data.page;
          this.size = response.data.size;
          this.totalPages.set(Math.ceil(this.totalItems / this.size));
        },
        error: (err) => {
          console.error('Failed to load location:', err);
        },
      });
    }
  
    onPageSizeChange(newSize: number): void {
      this.size = newSize;
      this.page = 0; 
      this.loadLocation();
    }
  
    openAddLocationModal(): void {
      this.router.navigate(['/head-business/location-details']);
    }
  
    onPageChange(newPage: number): void {
      if (newPage >= 0 && newPage < this.totalPages()) {
        this.page = newPage;
        this.loadLocation();
      }
    }
  
    public toggleLocation(checked: boolean): void {
      this.location.update((location) => {
        return location.map((location) => {
          return { ...location, selected: checked };
        });
      });
    }
  
    filteredLocation = computed(() => {
      return this.location();
    });
}
