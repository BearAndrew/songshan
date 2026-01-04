import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticRouteStandbyAnalysisDetailComponent } from './domestic-route-standby-analysis.component';

describe('DomesticRouteStandbyAnalysisDetailComponent', () => {
  let component: DomesticRouteStandbyAnalysisDetailComponent;
  let fixture: ComponentFixture<DomesticRouteStandbyAnalysisDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticRouteStandbyAnalysisDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomesticRouteStandbyAnalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
