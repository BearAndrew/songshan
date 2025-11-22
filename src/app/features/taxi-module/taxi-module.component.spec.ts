import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiModuleComponent } from './taxi-module.component';

describe('TaxiModuleComponent', () => {
  let component: TaxiModuleComponent;
  let fixture: ComponentFixture<TaxiModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
