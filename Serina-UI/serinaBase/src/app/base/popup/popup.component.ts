import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  POLineData = [];
  selectedPOLines = [];
  type:string;
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    this.POLineData = this.data.resp;
    console.log(this.POLineData)
  }
  onSubmit(value){
    console.log(value)
  }
  onSelect(bool,id){
    if(bool){
      const i = this.selectedPOLines.indexOf(id);
      console.log(i)
      if(i == -1){
        this.selectedPOLines.push(id);
      }
    }else {
      const ind = this.selectedPOLines.indexOf(id);
      if(ind != -1){
        this.selectedPOLines.splice(ind,1)
      }
    }
    console.log(this.selectedPOLines)

  }
  onSubmitRequest(val){
    console.log(val)
  }

}
