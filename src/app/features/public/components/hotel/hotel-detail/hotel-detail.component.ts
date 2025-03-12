import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from "../../../../../shared/components/footer/footer.component";
import { ActivatedRoute } from '@angular/router';
import { Hotel } from '../../../../../core/models/hotel.model';
import { HotelService } from '../../../services/hotel.service';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { SsrService } from '../../../../../core/services/ssr.service';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    CurrencyVndPipe
  ],
  templateUrl: './hotel-detail.component.html',
  styleUrls: [],
})
export class HotelDetailComponent {
  isShow: boolean = false;
  hotelDetails!: Hotel;
  rooms: any[] = [];
  allRooms: any[] = [];
  selectedRoom: any = null;
  otherServices: any[] = [];
  price: number = 0;
  private map!: L.Map;

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private ssrService: SsrService,
  ) { }

  // ngOnInit() {
  //   const hotelId = Number(this.route.snapshot.paramMap.get('id'));
  //   if (hotelId) {
  //     this.loadHotelDetail(hotelId);
  //   }
  // }

  ngOnInit() {
    // Dữ liệu test cứng thay vì gọi API
    this.hotelDetails = {
      id: 1,
      name: "Khách sạn Test",
      location: {
        name: "Hà Nội, Việt Nam",
        id: 0,
        description: '',
        image: ''
      },
      star: 4.5,
      website: "https://example.com",
      imageUrl: "https://via.placeholder.com/300x200?text=Hotel+Image",
      abbreviation: "KS",
      address: "KS",
      email: "info@example.com",
      phone: "0123456789",
      geoPosition: {
        id: 0,
        latitude: 21.028511,
        longitude: 105.804817
      }
    };
  
    this.allRooms = [
      {
        name: "Phòng đôi",
        sellingPrice: 800000,
        imageUrl: "https://via.placeholder.com/300x200?text=Phòng+đôi",
      },
      {
        name: "Single Room",
        sellingPrice: 600000,
        imageUrl: "https://via.placeholder.com/300x200?text=Single+Room",
      },
      {
        name: "Phòng 3 người",
        sellingPrice: 900000,
        imageUrl: "https://via.placeholder.com/300x200?text=Phòng+3+người",
      }, // Phòng này sẽ bị ẩn vì không phải phòng đôi hoặc đơn
    ];
  
    
    this.rooms = [...this.allRooms];
    this.price = this.rooms[0]?.sellingPrice || 0;
  }
  

  loadHotelDetail(id: number) {
    this.hotelService.getHotelDetail(id).subscribe({
      next: (response: any) => {
        if (response.code === 200 && response.data) {
          this.hotelDetails = response.data.serviceProvider;
          this.rooms = response.data.rooms.filter((room: any) => 
            room.name.toLowerCase().includes('double') || room.name.toLowerCase().includes('single')
          );
          this.price = response.data.minRoomPrice;
        }
      },
      error: (err: any) => console.error('Error fetching hotel details', err),
    });
  }

  ngAfterViewInit(): void {
    if (this.ssrService.isBrowser) {
      this.initMap();
    }
  }

  selectRoom(room: any) {
    if (this.selectedRoom === room) {
      // Nếu ấn đổi phòng, hiển thị lại danh sách ban đầu
      this.selectedRoom = null;
      this.rooms = [...this.allRooms];
      this.price = 0;
    } else {
      // Chọn phòng, ẩn các phòng khác
      this.selectedRoom = room;
      this.rooms = [room];
      this.price = room.sellingPrice;
    }
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');
  
    this.map = L.map('map').setView(
      [this.hotelDetails.geoPosition.latitude, this.hotelDetails.geoPosition.longitude], 
      13
    );
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  
    L.marker([this.hotelDetails.geoPosition.latitude, this.hotelDetails.geoPosition.longitude])
      .addTo(this.map);
  }
  

  showOrHide() {
    this.isShow = !this.isShow;
  }
}
