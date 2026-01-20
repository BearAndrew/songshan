import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSearchBarComponent } from './chart-search-bar.component';

describe('ChartSearchBarComponent', () => {
  let component: ChartSearchBarComponent;
  let fixture: ComponentFixture<ChartSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartSearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
