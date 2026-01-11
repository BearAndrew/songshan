import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlCheckinCounterAdminTableComponent } from './intl-checkin-counter-admin-table.component';

describe('IntlCheckinCounterAdminTableComponent', () => {
  let component: IntlCheckinCounterAdminTableComponent;
  let fixture: ComponentFixture<IntlCheckinCounterAdminTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntlCheckinCounterAdminTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntlCheckinCounterAdminTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
