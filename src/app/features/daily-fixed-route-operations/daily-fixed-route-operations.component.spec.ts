import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFixedRouteOperationsComponent } from './daily-fixed-route-operations.component';

describe('DailyFixedRouteOperationsComponent', () => {
  let component: DailyFixedRouteOperationsComponent;
  let fixture: ComponentFixture<DailyFixedRouteOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFixedRouteOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFixedRouteOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
