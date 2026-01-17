import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiDuplicateComponent } from './taxi-duplicate.component';

describe('TaxiDuplicateComponent', () => {
  let component: TaxiDuplicateComponent;
  let fixture: ComponentFixture<TaxiDuplicateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiDuplicateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
