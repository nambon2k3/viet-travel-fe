import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceContactComponent } from './service-contact.component';

describe('ServiceContactComponent', () => {
  let component: ServiceContactComponent;
  let fixture: ComponentFixture<ServiceContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
