import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent implements AfterViewInit {
  @Input() days: number[] = [1, 2, 3, 4, 5];
  @Input() numGuests: number = 0;
  @Output() restaurantAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addRestaurantForm!: FormGroup;

  locations: string[] = ['DA nag', 'HN', 'Hà Nội'];
  types: string[] = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];
  
  restaurantsByLocation: Record<string, { name: string, netPrice: number }[]> = {
    'Hà Nội': [
      { name: 'Muong Thanh Grand Da Nang Restaurant', netPrice: 1450000 },
      { name: 'Vinpearl Condotel Riverfront Da Nang', netPrice: 2000000 }
    ],
    'DA na': [
      { name: 'Imperial Restaurant Hue', netPrice: 1600000 },
      { name: 'Huong Giang Restaurant Resort & Spa', netPrice: 1400000 }
    ],
    'HN': [
      { name: 'La Siesta Hoi An Resort & Spa', netPrice: 1700000 },
      { name: 'Anantara Hoi An Resort', netPrice: 1800000 }
    ]
  };

  restaurants: { name: string, netPrice: number }[] = [];

  prices: { guests: string, sellingPrice: number }[] = [
    { guests: '01-04 khách', sellingPrice: 400000 },
    { guests: '05-10 khách', sellingPrice: 350000 },
    { guests: '11-20 khách', sellingPrice: 250000 }
  ];

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.updateRestaurants(); // Gọi cập nhật danh sách khách sạn theo địa điểm ban đầu
  }

  initializeForm() {
    this.addRestaurantForm = this.fb.group({
      selectedDay: [1], 
      selectedLocation: ['Hà Nội'],
      selectedType: ['Bữa sáng'], 
      selectedRestaurant: [''],
      netPrice: [0],
      prices: this.fb.array(this.prices.map(price => this.fb.group({
        guests: [price.guests],
        sellingPrice: [price.sellingPrice]
      })))
    });
  }

  get pricesFormArray() {
    return this.addRestaurantForm.get('prices') as FormArray;
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('addRestaurantModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  updateRestaurants() {
    const selectedLocation = this.addRestaurantForm.get('selectedLocation')?.value;
    const selectedType = this.addRestaurantForm.get('selectedType')?.value;
    this.restaurants = this.restaurantsByLocation[selectedLocation] || [];

    if (this.restaurants.length > 0) {
      this.addRestaurantForm.patchValue({
        selectedRestaurant: this.restaurants[0].name,
        netPrice: this.restaurants[0].netPrice
      });
    } else {
      this.addRestaurantForm.patchValue({
        selectedRestaurant: '',
        netPrice: 0
      });
    }
  }

  onLocationChange() {
    console.log('Location changed:', this.addRestaurantForm.get('selectedLocation')?.value);
    this.updateRestaurants();
  }

  onRestaurantChange() {
    const selectedRestaurantName = this.addRestaurantForm.get('selectedRestaurant')?.value;
    const selectedRestaurant = this.restaurants.find(h => h.name === selectedRestaurantName);
    if (selectedRestaurant) {
      this.addRestaurantForm.patchValue({ netPrice: selectedRestaurant.netPrice });
    }
  }

  onSubmit() {
    if (this.addRestaurantForm.valid) {
      const formData = {
        day: this.addRestaurantForm.get('selectedDay')?.value,
        location: this.addRestaurantForm.get('selectedLocation')?.value,
        type: this.addRestaurantForm.get('selectedType')?.value,
        restaurant: this.addRestaurantForm.get('selectedRestaurant')?.value,
        netPrice: this.addRestaurantForm.get('netPrice')?.value,
        prices: this.pricesFormArray.value
      };
      console.log('Form submitted:', formData);
      this.restaurantAdded.emit(formData);
    }
  }
}
