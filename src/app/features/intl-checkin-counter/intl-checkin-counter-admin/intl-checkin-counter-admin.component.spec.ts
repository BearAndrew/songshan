import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlCheckinCounterAdminComponent } from './intl-checkin-counter-admin.component';

describe('IntlCheckinCounterAdminComponent', () => {
  let component: IntlCheckinCounterAdminComponent;
  let fixture: ComponentFixture<IntlCheckinCounterAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntlCheckinCounterAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntlCheckinCounterAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
