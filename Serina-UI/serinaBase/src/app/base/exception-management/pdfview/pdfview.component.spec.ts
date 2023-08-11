import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PDFviewComponent } from './pdfview.component';

describe('PDFviewComponent', () => {
  let component: PDFviewComponent;
  let fixture: ComponentFixture<PDFviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PDFviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PDFviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
