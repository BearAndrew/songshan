import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFlightAnalysisDelayCardComponent } from './daily-flight-analysis-delay-card.component';

describe('DailyFlightAnalysisDelayCardComponent', () => {
  let component: DailyFlightAnalysisDelayCardComponent;
  let fixture: ComponentFixture<DailyFlightAnalysisDelayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFlightAnalysisDelayCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFlightAnalysisDelayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
