import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadTop6Component } from './read-top6.component';

describe('ReadTop6Component', () => {
  let component: ReadTop6Component;
  let fixture: ComponentFixture<ReadTop6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadTop6Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadTop6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
