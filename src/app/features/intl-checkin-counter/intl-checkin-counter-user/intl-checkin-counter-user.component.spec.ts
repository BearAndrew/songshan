import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlCheckinCounterUserComponent } from './intl-checkin-counter-user.component';

describe('IntlCheckinCounterUserComponent', () => {
  let component: IntlCheckinCounterUserComponent;
  let fixture: ComponentFixture<IntlCheckinCounterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntlCheckinCounterUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntlCheckinCounterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
