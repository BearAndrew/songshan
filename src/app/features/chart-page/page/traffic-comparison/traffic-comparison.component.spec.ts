import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficComparisonComponent } from './traffic-comparison.component';

describe('TrafficComparisonComponent', () => {
  let component: TrafficComparisonComponent;
  let fixture: ComponentFixture<TrafficComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
