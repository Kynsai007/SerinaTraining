import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderMappingComponent } from './sales-order-mapping.component';

describe('SalesOrderMappingComponent', () => {
  let component: SalesOrderMappingComponent;
  let fixture: ComponentFixture<SalesOrderMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
