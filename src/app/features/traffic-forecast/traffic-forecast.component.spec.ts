import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficForecastComponent } from './traffic-forecast.component';

describe('TrafficForecastComponent', () => {
  let component: TrafficForecastComponent;
  let fixture: ComponentFixture<TrafficForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficForecastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
