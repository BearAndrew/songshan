import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHomeComponent } from './home.component';

describe('CreateHomeComponent', () => {
  let component: CreateHomeComponent;
  let fixture: ComponentFixture<CreateHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
