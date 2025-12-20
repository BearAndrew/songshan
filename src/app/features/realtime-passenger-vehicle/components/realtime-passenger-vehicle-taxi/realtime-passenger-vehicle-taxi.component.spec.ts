import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimePassengerVehicleTaxiComponent } from './realtime-passenger-vehicle-taxi.component';

describe('RealtimePassengerVehicleTaxiComponent', () => {
  let component: RealtimePassengerVehicleTaxiComponent;
  let fixture: ComponentFixture<RealtimePassengerVehicleTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimePassengerVehicleTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimePassengerVehicleTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
