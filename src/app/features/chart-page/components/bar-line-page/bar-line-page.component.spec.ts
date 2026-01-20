import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarLinePageComponent } from './bar-line-page.component';

describe('BarLinePageComponent', () => {
  let component: BarLinePageComponent;
  let fixture: ComponentFixture<BarLinePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarLinePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarLinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
