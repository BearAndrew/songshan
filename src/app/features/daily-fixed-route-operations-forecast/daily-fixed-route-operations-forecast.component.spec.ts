import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFixedRouteOperationsForecastComponent } from './daily-fixed-route-operations-forecast.component';

describe('DailyFixedRouteOperationsForecastComponent', () => {
  let component: DailyFixedRouteOperationsForecastComponent;
  let fixture: ComponentFixture<DailyFixedRouteOperationsForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFixedRouteOperationsForecastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFixedRouteOperationsForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
