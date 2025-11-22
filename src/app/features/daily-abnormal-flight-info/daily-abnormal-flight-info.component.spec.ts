import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAbnormalFlightInfoComponent } from './daily-abnormal-flight-info.component';

describe('DailyAbnormalFlightInfoComponent', () => {
  let component: DailyAbnormalFlightInfoComponent;
  let fixture: ComponentFixture<DailyAbnormalFlightInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyAbnormalFlightInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyAbnormalFlightInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
