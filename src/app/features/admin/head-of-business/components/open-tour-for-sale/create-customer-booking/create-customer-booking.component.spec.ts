import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerBookingComponent } from './create-customer-booking.component';

describe('CreateCustomerBookingComponent', () => {
  let component: CreateCustomerBookingComponent;
  let fixture: ComponentFixture<CreateCustomerBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCustomerBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCustomerBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
