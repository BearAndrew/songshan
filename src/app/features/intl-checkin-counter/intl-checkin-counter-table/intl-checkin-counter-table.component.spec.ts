import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlCheckinCounterTableComponent } from './intl-checkin-counter-table.component';

describe('IntlCheckinCounterTableComponent', () => {
  let component: IntlCheckinCounterTableComponent;
  let fixture: ComponentFixture<IntlCheckinCounterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntlCheckinCounterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntlCheckinCounterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
