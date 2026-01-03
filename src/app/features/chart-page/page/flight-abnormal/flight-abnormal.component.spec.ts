import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightAbnormalComponent } from './flight-abnormal.component';

describe('FlightAbnormalComponent', () => {
  let component: FlightAbnormalComponent;
  let fixture: ComponentFixture<FlightAbnormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightAbnormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightAbnormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
