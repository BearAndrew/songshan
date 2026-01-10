import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBlackListComponent } from './read-black-list.component';

describe('ReadBlackListComponent', () => {
  let component: ReadBlackListComponent;
  let fixture: ComponentFixture<ReadBlackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadBlackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadBlackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
