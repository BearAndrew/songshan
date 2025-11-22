import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedRouteTrafficAnalysisChartComponent } from './fixed-route-traffic-analysis-chart.component';

describe('FixedRouteTrafficAnalysisChartComponent', () => {
  let component: FixedRouteTrafficAnalysisChartComponent;
  let fixture: ComponentFixture<FixedRouteTrafficAnalysisChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedRouteTrafficAnalysisChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedRouteTrafficAnalysisChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
