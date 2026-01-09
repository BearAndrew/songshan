import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadDisplayComponent } from './read-display.component';

describe('ReadDisplayComponent', () => {
  let component: ReadDisplayComponent;
  let fixture: ComponentFixture<ReadDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
