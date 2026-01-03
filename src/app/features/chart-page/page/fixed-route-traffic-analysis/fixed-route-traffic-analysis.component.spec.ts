import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedRouteTrafficAnalysisComponent } from './fixed-route-traffic-analysis.component';

describe('FixedRouteTrafficAnalysisComponent', () => {
  let component: FixedRouteTrafficAnalysisComponent;
  let fixture: ComponentFixture<FixedRouteTrafficAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedRouteTrafficAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedRouteTrafficAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
