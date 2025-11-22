import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFlightAnalysisComponent } from './daily-flight-analysis.component';

describe('DailyFlightAnalysisComponent', () => {
  let component: DailyFlightAnalysisComponent;
  let fixture: ComponentFixture<DailyFlightAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFlightAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFlightAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
