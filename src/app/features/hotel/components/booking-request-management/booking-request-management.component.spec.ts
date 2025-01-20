import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRequestManagementComponent } from './booking-request-management.component';

describe('BookingRequestManagementComponent', () => {
  let component: BookingRequestManagementComponent;
  let fixture: ComponentFixture<BookingRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingRequestManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
