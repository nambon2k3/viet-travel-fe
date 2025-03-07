import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTourGuideComponent } from './add-tour-guide.component';

describe('AddTourGuideComponent', () => {
  let component: AddTourGuideComponent;
  let fixture: ComponentFixture<AddTourGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTourGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTourGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
