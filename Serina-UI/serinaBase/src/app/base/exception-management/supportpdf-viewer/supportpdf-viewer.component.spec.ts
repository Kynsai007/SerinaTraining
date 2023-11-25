import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportpdfViewerComponent } from './supportpdf-viewer.component';

describe('SupportpdfViewerComponent', () => {
  let component: SupportpdfViewerComponent;
  let fixture: ComponentFixture<SupportpdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportpdfViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportpdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
