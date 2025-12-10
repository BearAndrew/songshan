import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFlightAnalysisAbnormalCardComponent } from './daily-flight-analysis-abnormal-card.component';

describe('DailyFlightAnalysisAbnormalCardComponent', () => {
  let component: DailyFlightAnalysisAbnormalCardComponent;
  let fixture: ComponentFixture<DailyFlightAnalysisAbnormalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFlightAnalysisAbnormalCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFlightAnalysisAbnormalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
