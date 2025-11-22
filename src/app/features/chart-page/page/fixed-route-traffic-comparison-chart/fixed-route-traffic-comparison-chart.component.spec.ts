import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedRouteTrafficComparisonChartComponent } from './fixed-route-traffic-comparison-chart.component';

describe('FixedRouteTrafficComparisonChartComponent', () => {
  let component: FixedRouteTrafficComparisonChartComponent;
  let fixture: ComponentFixture<FixedRouteTrafficComparisonChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedRouteTrafficComparisonChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedRouteTrafficComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
