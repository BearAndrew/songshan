import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFlightAnalysisFlightCardComponent } from './daily-flight-analysis-flight-card.component';

describe('DailyFlightAnalysisFlightCardComponent', () => {
  let component: DailyFlightAnalysisFlightCardComponent;
  let fixture: ComponentFixture<DailyFlightAnalysisFlightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFlightAnalysisFlightCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFlightAnalysisFlightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
