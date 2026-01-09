import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadFormComponent } from './read-form.component';

describe('ReadFormComponent', () => {
  let component: ReadFormComponent;
  let fixture: ComponentFixture<ReadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
