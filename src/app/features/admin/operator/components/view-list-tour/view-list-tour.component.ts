import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../../../../core/models/tour.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';

@Component({
  selector: 'app-view-list-tour',
  imports: [
      TableActionComponent,
      TableFooterComponent,
      TableHeaderComponent,
      TableRowComponent, 
      //SpinnerComponent
    ],
  templateUrl: './view-list-tour.component.html',
  styleUrl: './view-list-tour.component.css'
})
export class ViewListTourComponent {
  tours = signal<Tour[]>([
    {
      id: 1,
      tourName: "Ha Long Bay Adventure",
      startDate: "2025-04-10",
      slot: 30,
      Operator: {
        id: 1,
        fullName: "John Doe",
        username: "johndoe",
        password: "password",
        email: "john@example.com",
        gender: true,
        phone: "123456789",
        address: "Hanoi, Vietnam",
        avatarImage: "avatar1.jpg",
        roleNames: ["Operator"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: "Scheduled",
      TourGuide: {
        id: 2,
        fullName: "Anna Smith",
        username: "annasmith",
        password: "password",
        email: "anna@example.com",
        gender: false,
        phone: "987654321",
        address: "Da Nang, Vietnam",
        avatarImage: "avatar2.jpg",
        roleNames: ["Tour Guide"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    {
      id: 2,
      tourName: "Sapa Mountain Tour",
      startDate: "2025-05-12",
      slot: 25,
      Operator: {
        id: 3,
        fullName: "Mark Lee",
        username: "marklee",
        password: "password",
        email: "mark@example.com",
        gender: true,
        phone: "1122334455",
        address: "Ho Chi Minh, Vietnam",
        avatarImage: "avatar3.jpg",
        roleNames: ["Operator"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: "Available",
      TourGuide: {
        id: 4,
        fullName: "Lisa Wong",
        username: "lisawong",
        password: "password",
        email: "lisa@example.com",
        gender: false,
        phone: "5566778899",
        address: "Hoi An, Vietnam",
        avatarImage: "avatar4.jpg",
        roleNames: ["Tour Guide"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    {
      id: 3,
      tourName: "Mekong Delta Discovery",
      startDate: "2025-06-20",
      slot: 40,
      Operator: {
        id: 5,
        fullName: "Tom Hardy",
        username: "tomhardy",
        password: "password",
        email: "tom@example.com",
        gender: true,
        phone: "9988776655",
        address: "Can Tho, Vietnam",
        avatarImage: "avatar5.jpg",
        roleNames: ["Operator"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: "Fully Booked",
      TourGuide: {
        id: 6,
        fullName: "Sarah Connor",
        username: "sarahc",
        password: "password",
        email: "sarah@example.com",
        gender: false,
        phone: "6677889900",
        address: "Ho Chi Minh, Vietnam",
        avatarImage: "avatar6.jpg",
        roleNames: ["Tour Guide"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    {
      id: 4,
      tourName: "Phong Nha Cave Adventure",
      startDate: "2025-07-15",
      slot: 20,
      Operator: {
        id: 7,
        fullName: "David Kim",
        username: "davidkim",
        password: "password",
        email: "david@example.com",
        gender: true,
        phone: "7788990011",
        address: "Hue, Vietnam",
        avatarImage: "avatar7.jpg",
        roleNames: ["Operator"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      status: "Scheduled",
      TourGuide: {
        id: 8,
        fullName: "Jane Doe",
        username: "janedoe",
        password: "password",
        email: "jane@example.com",
        gender: false,
        phone: "3344556677",
        address: "Da Nang, Vietnam",
        avatarImage: "avatar8.jpg",
        roleNames: ["Tour Guide"],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  ]);

  totalItems = this.tours().length;
  page = 0;
  size = 10;
  totalPages = signal(Math.ceil(this.totalItems / this.size));
  isLoading: boolean = false;

  keyword = '';
  isDeleted?: boolean;
  sortField = 'createdAt';
  sortDirection = 'desc';

  constructor(private router: Router, private tourService: TourService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500); // Simulate loading time
  }

  onSearch(filters: any): void {
    this.keyword = filters.keyword || '';
    this.isDeleted = filters.status === '2' ? true : filters.status === '1' ? false : undefined;
    this.sortDirection = filters.order === '1' ? 'desc' : 'asc';
    this.page = 0;
    this.loadTours();
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadTours();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0;
    this.loadTours();
  }

  openPostTourDetail(): void {
    this.router.navigate(['/marketer/add-tour']);
  }

  toggleTours(checked: boolean): void {
    this.tours.update((tours) => {
      return tours.map((tour) => {
        return { ...tour, selected: checked };
      });
    });
  }

  filteredTours = computed(() => {
    return this.tours();
  });
}
