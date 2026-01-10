import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadTaxiInfoComponent } from './read-taxi-info.component';

describe('ReadTaxiInfoComponent', () => {
  let component: ReadTaxiInfoComponent;
  let fixture: ComponentFixture<ReadTaxiInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadTaxiInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadTaxiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
