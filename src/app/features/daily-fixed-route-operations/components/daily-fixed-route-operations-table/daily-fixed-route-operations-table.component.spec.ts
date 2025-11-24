import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFixedRouteOperationsTableComponent } from './daily-fixed-route-operations-table.component';

describe('DailyFixedRouteOperationsTableComponent', () => {
  let component: DailyFixedRouteOperationsTableComponent;
  let fixture: ComponentFixture<DailyFixedRouteOperationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFixedRouteOperationsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFixedRouteOperationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
