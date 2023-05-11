import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  POLineData = [];
  selectedPOLines = [];
  type: string;
  component: string;
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private ES: ExceptionsService,
    private alert: AlertService,
    private message : MessageService,
    private spin: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    if (this.type == 'flip') {
      this.component = 'normal';
    } else if (this.type == 'flip line') {
      this.component = 'mapping';
    }
    this.POLineData = this.data.resp;
  }
  onSubmit(value) {
    this.spin.show();
    this.ES.flip_po(JSON.stringify(this.selectedPOLines)).subscribe((data: any) => {
      if (data?.result) {
        this.dialogRef.close();
        this.ES.popupmsg.next(this.component);
        this.alert.addObject.detail= "PO flip is successful"
        this.message.add(this.alert.addObject)
      } else {
        this.alert.errorObject.detail= data?.error
        this.message.add(this.alert.errorObject)
      }
      this.spin.hide();
    },err=>{
      this.alert.errorObject.detail= "Server error"
      this.message.add(this.alert.errorObject)
      this.spin.hide();
    })
  }
  onSelect(bool, data) {
    let id = data.LineNumber;
    data.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
    if (bool) {
      let boolean = this.selectedPOLines?.findIndex(el => el.LineNumber == data.LineNumber);
      if (boolean) {
        this.selectedPOLines.push(data);
      }
    } else {
      const ind = this.selectedPOLines?.findIndex(el => el.LineNumber == data.LineNumber);
      if (ind != -1) {
        this.selectedPOLines.splice(ind, 1)
      }
    }
  }
  changeQty(qty, lineid) {
    this.selectedPOLines.forEach(el => {
      if (el.LineNumber == lineid) {
        el.Quantity = qty;
      }
    })
  }
  onSubmitRequest(val) {
    console.log(val)
  }

}
