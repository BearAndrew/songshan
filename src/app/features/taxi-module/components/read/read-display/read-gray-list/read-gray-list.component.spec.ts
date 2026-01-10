import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadGrayListComponent } from './read-gray-list.component';

describe('ReadGrayListComponent', () => {
  let component: ReadGrayListComponent;
  let fixture: ComponentFixture<ReadGrayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadGrayListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadGrayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
