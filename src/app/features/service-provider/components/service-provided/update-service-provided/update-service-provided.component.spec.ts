import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateServiceProvidedComponent } from './update-service-provided.component';

describe('UpdateServiceProvidedComponent', () => {
  let component: UpdateServiceProvidedComponent;
  let fixture: ComponentFixture<UpdateServiceProvidedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateServiceProvidedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateServiceProvidedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
