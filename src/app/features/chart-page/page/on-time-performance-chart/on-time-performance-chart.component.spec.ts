import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnTimePerformanceChartComponent } from './on-time-performance-chart.component';

describe('OnTimePerformanceChartComponent', () => {
  let component: OnTimePerformanceChartComponent;
  let fixture: ComponentFixture<OnTimePerformanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnTimePerformanceChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnTimePerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
