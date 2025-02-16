import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServiceProvidedComponent } from './add-service-provided.component';

describe('AddServiceProvidedComponent', () => {
  let component: AddServiceProvidedComponent;
  let fixture: ComponentFixture<AddServiceProvidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServiceProvidedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServiceProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
