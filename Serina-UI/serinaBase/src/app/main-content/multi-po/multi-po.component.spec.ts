import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPOComponent } from './multi-po.component';

describe('MultiPOComponent', () => {
  let component: MultiPOComponent;
  let fixture: ComponentFixture<MultiPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiPOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
