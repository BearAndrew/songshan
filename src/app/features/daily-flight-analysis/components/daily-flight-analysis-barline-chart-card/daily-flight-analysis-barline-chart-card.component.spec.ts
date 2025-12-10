import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFlightAnalysisBarlineChartCardComponent } from './daily-flight-analysis-barline-chart-card.component';

describe('DailyFlightAnalysisBarlineChartCardComponent', () => {
  let component: DailyFlightAnalysisBarlineChartCardComponent;
  let fixture: ComponentFixture<DailyFlightAnalysisBarlineChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFlightAnalysisBarlineChartCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFlightAnalysisBarlineChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
