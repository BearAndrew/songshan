import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDomesticStandbyAnalysisComponent } from './daily-domestic-standby-analysis.component';

describe('DailyDomesticStandbyAnalysisComponent', () => {
  let component: DailyDomesticStandbyAnalysisComponent;
  let fixture: ComponentFixture<DailyDomesticStandbyAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyDomesticStandbyAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDomesticStandbyAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
