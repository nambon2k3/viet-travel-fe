import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAdvancePaymentComponent } from './post-advance-payment.component';

describe('PostAdvancePaymentComponent', () => {
  let component: PostAdvancePaymentComponent;
  let fixture: ComponentFixture<PostAdvancePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostAdvancePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAdvancePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
