import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceContactComponent } from './add-service-contact.component';

describe('AddServiceContactComponent', () => {
  let component: AddServiceContactComponent;
  let fixture: ComponentFixture<AddServiceContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServiceContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
