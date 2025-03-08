import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-tourguide',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-tour-guide.component.html',
  styleUrls: ['./add-tour-guide.component.css']
})
export class AddTourGuideComponent implements AfterViewInit {
  @Input() days: number[] = [1, 2, 3, 4, 5];
  @Input() numGuests: number = 0;
  @Output() tourguideAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addTourGuideForm!: FormGroup;

  providers: string[] = ['DA nag', 'HN', 'Hà Nội'];
  
  tourguidesByProviders: Record<string, { name: string, netPrice: number }[]> = {
    'Hà Nội': [
      { name: 'Nguyen Van B', netPrice: 1450000 },
      { name: 'Nguyen Van A', netPrice: 2000000 }
    ],
    'DA na': [
      { name: 'Nguyen Van A', netPrice: 1600000 },
      { name: 'Nguyen Van B', netPrice: 1400000 }
    ],
    'HN': [
      { name: 'Nguyen Van A', netPrice: 1700000 },
      { name: 'Nguyen Van B', netPrice: 1800000 }
    ]
  };

  tourguides: { name: string, netPrice: number }[] = [];

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
    this.updateTourGuides(); // Gọi cập nhật danh sách khách sạn theo địa điểm ban đầu
  }

  initializeForm() {
    this.addTourGuideForm = this.fb.group({
      selectedDay: [1], 
      selectedProvider: ['Hà Nội'],
      selectedTourGuide: [''],
      netPrice: [0],
      prices: this.fb.array(this.prices.map(price => this.fb.group({
        guests: [price.guests],
        sellingPrice: [price.sellingPrice]
      })))
    });
  }

  get pricesFormArray() {
    return this.addTourGuideForm.get('prices') as FormArray;
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('addTourGuideModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  updateTourGuides() {
    const selectedProvider = this.addTourGuideForm.get('selectedProvider')?.value;
    this.tourguides = this.tourguidesByProviders[selectedProvider] || [];

    if (this.tourguides.length > 0) {
      this.addTourGuideForm.patchValue({
        selectedTourGuide: this.tourguides[0].name,
        netPrice: this.tourguides[0].netPrice
      });
    } else {
      this.addTourGuideForm.patchValue({
        selectedTourGuide: '',
        netPrice: 0
      });
    }
  }

  onProviderChange() {
    console.log('Provider changed:', this.addTourGuideForm.get('selectedProvider')?.value);
    this.updateTourGuides();
  }

  onTourGuideChange() {
    const selectedTourGuideName = this.addTourGuideForm.get('selectedTourGuide')?.value;
    const selectedTourGuide = this.tourguides.find(h => h.name === selectedTourGuideName);
    if (selectedTourGuide) {
      this.addTourGuideForm.patchValue({ netPrice: selectedTourGuide.netPrice });
    }
  }

  onSubmit() {
    if (this.addTourGuideForm.valid) {
      const formData = {
        day: this.addTourGuideForm.get('selectedDay')?.value,
        provider: this.addTourGuideForm.get('selectedProvider')?.value,
        tourguide: this.addTourGuideForm.get('selectedTourGuide')?.value,
        netPrice: this.addTourGuideForm.get('netPrice')?.value,
        prices: this.pricesFormArray.value
      };
      console.log('Form submitted:', formData);
      this.tourguideAdded.emit(formData);
    }
  }
}
