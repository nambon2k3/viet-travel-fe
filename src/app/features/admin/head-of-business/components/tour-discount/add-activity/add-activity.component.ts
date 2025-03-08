import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent implements AfterViewInit {
  @Input() days: number[] = [1, 2, 3, 4, 5];
  @Input() numGuests: number = 0;
  @Output() activityAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addActivityForm!: FormGroup;

  providers: string[] = ['DA nag', 'HN', 'Hà Nội'];
  types: string[] = ['Bữa sáng', 'Bữa trưa', 'Bữa tối'];
  
  activitysByProvider: Record<string, { name: string, netPrice: number }[]> = {
    'Hà Nội': [
      { name: 'Muong Thanh Grand Da Nang Activity', netPrice: 1450000 },
      { name: 'Vinpearl Condotel Riverfront Da Nang', netPrice: 2000000 }
    ],
    'DA na': [
      { name: 'Imperial Activity Hue', netPrice: 1600000 },
      { name: 'Huong Giang Activity Resort & Spa', netPrice: 1400000 }
    ],
    'HN': [
      { name: 'La Siesta Hoi An Resort & Spa', netPrice: 1700000 },
      { name: 'Anantara Hoi An Resort', netPrice: 1800000 }
    ]
  };

  activitys: { name: string, netPrice: number }[] = [];

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
    this.updateActivitys(); // Gọi cập nhật danh sách khách sạn theo địa điểm ban đầu
  }

  initializeForm() {
    this.addActivityForm = this.fb.group({
      selectedDay: [1], 
      selectedProvider: ['Hà Nội'],
      selectedType: ['Bữa sáng'], 
      selectedActivity: [''],
      netPrice: [0],
      prices: this.fb.array(this.prices.map(price => this.fb.group({
        guests: [price.guests],
        sellingPrice: [price.sellingPrice]
      })))
    });
  }

  get pricesFormArray() {
    return this.addActivityForm.get('prices') as FormArray;
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('addActivityModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  updateActivitys() {
    const selectedProvider = this.addActivityForm.get('selectedProvider')?.value;
    const selectedType = this.addActivityForm.get('selectedType')?.value;
    this.activitys = this.activitysByProvider[selectedProvider] || [];

    if (this.activitys.length > 0) {
      this.addActivityForm.patchValue({
        selectedActivity: this.activitys[0].name,
        netPrice: this.activitys[0].netPrice
      });
    } else {
      this.addActivityForm.patchValue({
        selectedActivity: '',
        netPrice: 0
      });
    }
  }

  onProviderChange() {
    console.log('Provider changed:', this.addActivityForm.get('selectedProvider')?.value);
    this.updateActivitys();
  }

  onActivityChange() {
    const selectedActivityName = this.addActivityForm.get('selectedActivity')?.value;
    const selectedActivity = this.activitys.find(h => h.name === selectedActivityName);
    if (selectedActivity) {
      this.addActivityForm.patchValue({ netPrice: selectedActivity.netPrice });
    }
  }

  onSubmit() {
    if (this.addActivityForm.valid) {
      const formData = {
        day: this.addActivityForm.get('selectedDay')?.value,
        provider: this.addActivityForm.get('selectedProvider')?.value,
        type: this.addActivityForm.get('selectedType')?.value,
        activity: this.addActivityForm.get('selectedActivity')?.value,
        netPrice: this.addActivityForm.get('netPrice')?.value,
        prices: this.pricesFormArray.value
      };
      console.log('Form submitted:', formData);
      this.activityAdded.emit(formData);
    }
  }
}
