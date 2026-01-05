import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownSecondaryComponent } from './dropdown-secondary.component';

describe('DropdownSecondaryComponent', () => {
  let component: DropdownSecondaryComponent;
  let fixture: ComponentFixture<DropdownSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSecondaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
