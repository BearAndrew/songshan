import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficAnalysisComponent } from './traffic-analysis.component';

describe('TrafficAnalysisComponent', () => {
  let component: TrafficAnalysisComponent;
  let fixture: ComponentFixture<TrafficAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
