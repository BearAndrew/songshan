import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiExceptionDialogComponent } from './taxi-exception-dialog.component';

describe('TaxiExceptionDialogComponent', () => {
  let component: TaxiExceptionDialogComponent;
  let fixture: ComponentFixture<TaxiExceptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiExceptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxiExceptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
