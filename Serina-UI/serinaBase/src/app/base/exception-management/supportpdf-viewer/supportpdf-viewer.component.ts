import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-supportpdf-viewer',
  templateUrl: './supportpdf-viewer.component.html',
  styleUrls: ['./supportpdf-viewer.component.scss']
})
export class SupportpdfViewerComponent implements OnInit {
  srcFile:any;
  isImgBoolean:boolean;
  constructor(
    private d_ref :MatDialogRef<SupportpdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.srcFile = this.data.file;
  }

}
