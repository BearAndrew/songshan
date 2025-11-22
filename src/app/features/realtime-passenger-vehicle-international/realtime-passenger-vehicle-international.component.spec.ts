import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimePassengerVehicleInternationalComponent } from './realtime-passenger-vehicle-international.component';

describe('RealtimePassengerVehicleInternationalComponent', () => {
  let component: RealtimePassengerVehicleInternationalComponent;
  let fixture: ComponentFixture<RealtimePassengerVehicleInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimePassengerVehicleInternationalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimePassengerVehicleInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
