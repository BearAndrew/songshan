import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlCheckinCounterUserTableComponent } from './intl-checkin-counter-user-table.component';

describe('IntlCheckinCounterUserTableComponent', () => {
  let component: IntlCheckinCounterUserTableComponent;
  let fixture: ComponentFixture<IntlCheckinCounterUserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntlCheckinCounterUserTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntlCheckinCounterUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
