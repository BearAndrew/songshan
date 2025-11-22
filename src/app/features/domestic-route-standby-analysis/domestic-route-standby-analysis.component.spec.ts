import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticRouteStandbyAnalysisComponent } from './domestic-route-standby-analysis.component';

describe('DomesticRouteStandbyAnalysisComponent', () => {
  let component: DomesticRouteStandbyAnalysisComponent;
  let fixture: ComponentFixture<DomesticRouteStandbyAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticRouteStandbyAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomesticRouteStandbyAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
