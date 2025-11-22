import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimePassengerVehicleDomesticComponent } from './realtime-passenger-vehicle-domestic.component';

describe('RealtimePassengerVehicleDomesticComponent', () => {
  let component: RealtimePassengerVehicleDomesticComponent;
  let fixture: ComponentFixture<RealtimePassengerVehicleDomesticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimePassengerVehicleDomesticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimePassengerVehicleDomesticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
