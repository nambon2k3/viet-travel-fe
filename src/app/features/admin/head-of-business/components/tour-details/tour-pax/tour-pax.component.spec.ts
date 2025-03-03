import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPaxComponent } from './tour-pax.component';

describe('TourPaxComponent', () => {
  let component: TourPaxComponent;
  let fixture: ComponentFixture<TourPaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourPaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourPaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
