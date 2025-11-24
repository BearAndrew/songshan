import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssBarChartComponent } from './css-bar-chart.component';

describe('CssBarChartComponent', () => {
  let component: CssBarChartComponent;
  let fixture: ComponentFixture<CssBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CssBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CssBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
