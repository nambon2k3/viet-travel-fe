import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceContactComponent } from './update-service-contact.component';

describe('UpdateServiceContactComponent', () => {
  let component: UpdateServiceContactComponent;
  let fixture: ComponentFixture<UpdateServiceContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateServiceContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateServiceContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
