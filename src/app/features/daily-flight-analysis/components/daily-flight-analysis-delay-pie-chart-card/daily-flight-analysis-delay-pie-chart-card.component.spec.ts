import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFlightAnalysisDelayPieChartCardComponent } from './daily-flight-analysis-delay-pie-chart-card.component';

describe('DailyFlightAnalysisDelayPieChartCardComponent', () => {
  let component: DailyFlightAnalysisDelayPieChartCardComponent;
  let fixture: ComponentFixture<DailyFlightAnalysisDelayPieChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFlightAnalysisDelayPieChartCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFlightAnalysisDelayPieChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
