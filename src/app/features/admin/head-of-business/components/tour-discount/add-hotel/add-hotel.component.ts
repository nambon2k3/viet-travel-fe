import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.css']
})
export class AddHotelComponent implements AfterViewInit {
  @Input() days: number[] = [1, 2, 3, 4, 5];
  @Input() numGuests: number = 0;
  @Output() hotelAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addHotelForm!: FormGroup;

  locations: string[] = ['Đà Nẵng', 'Huế', 'Hội An'];
  
  hotelsByLocation: Record<string, { name: string, netPrice: number }[]> = {
    'Đà Nẵng': [
      { name: 'Muong Thanh Grand Da Nang Hotel', netPrice: 1450000 },
      { name: 'Vinpearl Condotel Riverfront Da Nang', netPrice: 2000000 }
    ],
    'Huế': [
      { name: 'Imperial Hotel Hue', netPrice: 1600000 },
      { name: 'Huong Giang Hotel Resort & Spa', netPrice: 1400000 }
    ],
    'Hội An': [
      { name: 'La Siesta Hoi An Resort & Spa', netPrice: 1700000 },
      { name: 'Anantara Hoi An Resort', netPrice: 1800000 }
    ]
  };

  hotels: { name: string, netPrice: number }[] = [];

  prices: { guests: string, sellingPrice: number }[] = [
    { guests: '01-04 khách', sellingPrice: 1600000 },
    { guests: '05-10 khách', sellingPrice: 1550000 },
    { guests: '11-20 khách', sellingPrice: 1500000 }
  ];

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.updateHotels(); // Gọi cập nhật danh sách khách sạn theo địa điểm ban đầu
  }

  initializeForm() {
    this.addHotelForm = this.fb.group({
      selectedDay: [1], 
      selectedLocation: ['Đà Nẵng'], 
      selectedHotel: [''],
      netPrice: [0],
      prices: this.fb.array(this.prices.map(price => this.fb.group({
        guests: [price.guests],
        sellingPrice: [price.sellingPrice]
      })))
    });
  }

  get pricesFormArray() {
    return this.addHotelForm.get('prices') as FormArray;
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('addHotelModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  updateHotels() {
    const selectedLocation = this.addHotelForm.get('selectedLocation')?.value;
    this.hotels = this.hotelsByLocation[selectedLocation] || [];

    if (this.hotels.length > 0) {
      this.addHotelForm.patchValue({
        selectedHotel: this.hotels[0].name,
        netPrice: this.hotels[0].netPrice
      });
    } else {
      this.addHotelForm.patchValue({
        selectedHotel: '',
        netPrice: 0
      });
    }
  }

  onLocationChange() {
    console.log('Location changed:', this.addHotelForm.get('selectedLocation')?.value);
    this.updateHotels();
  }

  onHotelChange() {
    const selectedHotelName = this.addHotelForm.get('selectedHotel')?.value;
    const selectedHotel = this.hotels.find(h => h.name === selectedHotelName);
    if (selectedHotel) {
      this.addHotelForm.patchValue({ netPrice: selectedHotel.netPrice });
    }
  }

  onSubmit() {
    if (this.addHotelForm.valid) {
      const formData = {
        day: this.addHotelForm.get('selectedDay')?.value,
        location: this.addHotelForm.get('selectedLocation')?.value,
        hotel: this.addHotelForm.get('selectedHotel')?.value,
        netPrice: this.addHotelForm.get('netPrice')?.value,
        prices: this.pricesFormArray.value
      };
      console.log('Form submitted:', formData);
      this.hotelAdded.emit(formData);
    }
  }
}
