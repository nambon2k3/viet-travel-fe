import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from "../../../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent
  ],
  templateUrl: './hotel-detail.component.html',
  styleUrls: [],
})
export class HotelDetailComponent {
  isShow: boolean = false;
  hotelDetails = {
    highlights: `<p>Không chỉ nằm trong tầm tay với nhiều điểm tham quan hấp dẫn dành cho chuyến phiêu lưu của bạn, 
    mà nghỉ dưỡng tại Melia Ba Vì Mountain Retreat cũng sẽ mang đến cho bạn một kỳ nghỉ dễ chịu. 
    Khu nghỉ dưỡng này là lựa chọn hoàn hảo cho các cặp đôi tìm kiếm một kỳ nghỉ lãng mạn hoặc một kỳ nghỉ trăng mật. 
    Tận hưởng những đêm đáng nhớ nhất và người thương yêu của bạn bằng cách lưu trú tại Melia Ba Vì Mountain Retreat.</p>
    <p>Nơi đây còn mang lại nhiều tiện ích như hồ bơi vô cực, spa thư giãn, và những hoạt động ngoài trời lý thú như trekking, yoga, hay đơn giản chỉ là nhâm nhi tách cà phê bên khung cửa sổ ngập tràn ánh nắng.</p>
    <p>Đừng bỏ lỡ cơ hội trải nghiệm kỳ nghỉ hoàn hảo giữa thiên nhiên hùng vĩ của Ba Vì.</p>`
  };

  showOrHide() {
    this.isShow = !this.isShow;
  }

  rooms = [
    {
      type: 'Phòng đôi',
      guests: 2,
      price: 800000,
      availability: 4,
      image: 'assets/room1.jpg',
    },
    {
      type: 'Single Room',
      guests: 1,
      price: 600000,
      availability: 7,
      image: 'assets/room2.jpg',
    },
  ];

  hotels = [
    {
      name: 'Deluxe Room',
      imageUrl: 'https://sakos.vn/wp-content/uploads/2022/12/WTTC-Gives-Seven-More-Countries-Safe-Travel-Stamp-2-2.jpg',
      location: 'Hà Nội',
      code: 'DLX001',
      duration: '2 Days 1 Night',
      price: '750.000 đ',
    },
    {
      name: 'Suite Room',
      imageUrl: 'https://sakos.vn/wp-content/uploads/2022/12/WTTC-Gives-Seven-More-Countries-Safe-Travel-Stamp-2-2.jpg',
      location: 'Hà Nội',
      code: 'DLX001',
      duration: '2 Days 1 Night',
      price: '750.000 đ',
    },
    {
      name: 'Family Room',
      imageUrl: 'https://sakos.vn/wp-content/uploads/2022/12/WTTC-Gives-Seven-More-Countries-Safe-Travel-Stamp-2-2.jpg',
      location: 'Hà Nội',
      code: 'DLX001',
      duration: '2 Days 1 Night',
      price: '750.000 đ',
    }
  ];
}
