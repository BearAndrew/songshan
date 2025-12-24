import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimePassengerVehicleBaggageComponent } from './realtime-passenger-vehicle-baggage.component';

describe('RealtimePassengerVehicleBaggageComponent', () => {
  let component: RealtimePassengerVehicleBaggageComponent;
  let fixture: ComponentFixture<RealtimePassengerVehicleBaggageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimePassengerVehicleBaggageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimePassengerVehicleBaggageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
