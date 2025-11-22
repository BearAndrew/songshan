import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficComparisonChartComponent } from './traffic-comparison-chart.component';

describe('TrafficComparisonChartComponent', () => {
  let component: TrafficComparisonChartComponent;
  let fixture: ComponentFixture<TrafficComparisonChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficComparisonChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficComparisonChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
