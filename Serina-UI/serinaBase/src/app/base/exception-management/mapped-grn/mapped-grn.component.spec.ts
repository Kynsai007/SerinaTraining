import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedGRNComponent } from './mapped-grn.component';

describe('MappedGRNComponent', () => {
  let component: MappedGRNComponent;
  let fixture: ComponentFixture<MappedGRNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappedGRNComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedGRNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
