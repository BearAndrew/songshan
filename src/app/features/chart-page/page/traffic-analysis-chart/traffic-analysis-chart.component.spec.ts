import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficAnalysisChartComponent } from './traffic-analysis-chart.component';

describe('TrafficAnalysisChartComponent', () => {
  let component: TrafficAnalysisChartComponent;
  let fixture: ComponentFixture<TrafficAnalysisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficAnalysisChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficAnalysisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
