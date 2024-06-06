import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DPAComponent } from './dpa.component';

describe('DPAComponent', () => {
  let component: DPAComponent;
  let fixture: ComponentFixture<DPAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DPAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DPAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
