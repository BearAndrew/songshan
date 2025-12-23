import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficForecastTableComponent } from './traffic-forecast-table.component';

describe('TrafficForecastTableComponent', () => {
  let component: TrafficForecastTableComponent;
  let fixture: ComponentFixture<TrafficForecastTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficForecastTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficForecastTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
