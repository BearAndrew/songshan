import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadDailyTaxiComponent } from './read-daily-taxi.component';

describe('ReadDailyTaxiComponent', () => {
  let component: ReadDailyTaxiComponent;
  let fixture: ComponentFixture<ReadDailyTaxiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadDailyTaxiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadDailyTaxiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
