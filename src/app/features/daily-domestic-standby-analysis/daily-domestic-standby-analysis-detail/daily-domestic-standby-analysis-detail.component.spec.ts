import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDomesticStandbyAnalysisDetailComponent } from './daily-domestic-standby-analysis-detail.component';

describe('DailyDomesticStandbyAnalysisDetailComponent', () => {
  let component: DailyDomesticStandbyAnalysisDetailComponent;
  let fixture: ComponentFixture<DailyDomesticStandbyAnalysisDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyDomesticStandbyAnalysisDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDomesticStandbyAnalysisDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
