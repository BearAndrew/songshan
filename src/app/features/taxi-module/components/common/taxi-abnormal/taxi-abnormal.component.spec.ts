import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiAbnormalComponent } from './taxi-abnormal.component';

describe('TaxiAbnormalComponent', () => {
  let component: TaxiAbnormalComponent;
  let fixture: ComponentFixture<TaxiAbnormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiAbnormalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiAbnormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
