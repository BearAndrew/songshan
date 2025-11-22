import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlCheckinCounterComponent } from './intl-checkin-counter.component';

describe('IntlCheckinCounterComponent', () => {
  let component: IntlCheckinCounterComponent;
  let fixture: ComponentFixture<IntlCheckinCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntlCheckinCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntlCheckinCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
