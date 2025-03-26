import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-transportation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-transportation.component.html',
  styleUrls: ['./add-transportation.component.css']
})
export class AddTransportationComponent implements AfterViewInit {
  @Input() days: number[] = [1, 2, 3, 4, 5];
  @Input() tourId: number = 0;
  @Output() transportationAdded = new EventEmitter<any>();
  serviceId: number | null = null;
  @Input() pricesRange: string[] = [];

  modal: Modal | null = null;
  addTransportationForm!: FormGroup;

  types: string[] = ['Xe ô tô', 'Xe ô to', 'Xe ô'];
  
  transportationsByType: Record<string, { name: string, netPrice: number }[]> = {
    'Xe ô tô': [
      { name: 'Muong Thanh Grand Da Nang Transportation', netPrice: 1450000 },
      { name: 'Vinpearl Condotel Riverfront Da Nang', netPrice: 2000000 }
    ],
    'Xe ô to': [
      { name: 'Imperial Transportation Hue', netPrice: 1600000 },
      { name: 'Huong Giang Transportation Resort & Spa', netPrice: 1400000 }
    ],
    'Xe ô': [
      { name: 'La Siesta Hoi An Resort & Spa', netPrice: 1700000 },
      { name: 'Anantara Hoi An Resort', netPrice: 1800000 }
    ]
  };

  transportations: { name: string, netPrice: number }[] = [];

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
    this.updateTransportations(); // Gọi cập nhật danh sách khách sạn theo địa điểm ban đầu
  }

  initializeForm() {
    this.addTransportationForm = this.fb.group({
      selectedDay: [1], 
      selectedType: ['Xe ô tô'], 
      selectedTransportation: [''],
      netPrice: [0],
      prices: this.fb.array(this.prices.map(price => this.fb.group({
        guests: [price.guests],
        sellingPrice: [price.sellingPrice]
      })))
    });
  }

  get pricesFormArray() {
    return this.addTransportationForm.get('prices') as FormArray;
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('addTransportationModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  updateTransportations() {
    const selectedType = this.addTransportationForm.get('selectedType')?.value;
    this.transportations = this.transportationsByType[selectedType] || [];

    if (this.transportations.length > 0) {
      this.addTransportationForm.patchValue({
        selectedTransportation: this.transportations[0].name,
        netPrice: this.transportations[0].netPrice
      });
    } else {
      this.addTransportationForm.patchValue({
        selectedTransportation: '',
        netPrice: 0
      });
    }
  }

  onTypeChange() {
    console.log('Type changed:', this.addTransportationForm.get('selectedType')?.value);
    this.updateTransportations();
  }

  onTransportationChange() {
    const selectedTransportationName = this.addTransportationForm.get('selectedTransportation')?.value;
    const selectedTransportation = this.transportations.find(h => h.name === selectedTransportationName);
    if (selectedTransportation) {
      this.addTransportationForm.patchValue({ netPrice: selectedTransportation.netPrice });
    }
  }

  onSubmit() {
    if (this.addTransportationForm.valid) {
      const formData = {
        day: this.addTransportationForm.get('selectedDay')?.value,
        type: this.addTransportationForm.get('selectedType')?.value,
        transportation: this.addTransportationForm.get('selectedTransportation')?.value,
        netPrice: this.addTransportationForm.get('netPrice')?.value,
        prices: this.pricesFormArray.value
      };
      console.log('Form submitted:', formData);
      this.transportationAdded.emit(formData);
    }
  }
}
