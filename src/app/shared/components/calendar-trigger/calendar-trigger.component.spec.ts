import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTriggerComponent } from './calendar-trigger.component';

describe('CalendarTriggerComponent', () => {
  let component: CalendarTriggerComponent;
  let fixture: ComponentFixture<CalendarTriggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTriggerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarTriggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
