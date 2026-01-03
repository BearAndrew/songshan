import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedRouteTrafficComparisonComponent } from './fixed-route-traffic-comparison.component';

describe('FixedRouteTrafficComparisonComponent', () => {
  let component: FixedRouteTrafficComparisonComponent;
  let fixture: ComponentFixture<FixedRouteTrafficComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedRouteTrafficComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedRouteTrafficComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
