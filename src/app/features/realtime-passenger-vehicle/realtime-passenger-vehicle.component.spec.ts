import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimePassengerVehicleComponent } from './realtime-passenger-vehicle.component';

describe('RealtimePassengerVehicleComponent', () => {
  let component: RealtimePassengerVehicleComponent;
  let fixture: ComponentFixture<RealtimePassengerVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimePassengerVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimePassengerVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
