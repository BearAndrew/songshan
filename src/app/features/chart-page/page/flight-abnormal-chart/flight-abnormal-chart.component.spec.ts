import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAbnormalChartComponent } from './flight-abnormal-chart.component';

describe('FlightAbnormalChartComponent', () => {
  let component: FlightAbnormalChartComponent;
  let fixture: ComponentFixture<FlightAbnormalChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightAbnormalChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightAbnormalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
