import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnTimePerformanceComponent } from './on-time-performance.component';

describe('OnTimePerformanceComponent', () => {
  let component: OnTimePerformanceComponent;
  let fixture: ComponentFixture<OnTimePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnTimePerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnTimePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
