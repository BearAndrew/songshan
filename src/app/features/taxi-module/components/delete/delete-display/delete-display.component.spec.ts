import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDisplayComponent } from './delete-display.component';

describe('DeleteDisplayComponent', () => {
  let component: DeleteDisplayComponent;
  let fixture: ComponentFixture<DeleteDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
