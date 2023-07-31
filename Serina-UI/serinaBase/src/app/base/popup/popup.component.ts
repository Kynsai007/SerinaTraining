import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  uploadBool: boolean = false;
  GRNData = [];
  po_num:string;
  approveBool : boolean = false;
  entityList = [];
  approverList:any;
  rejectionComments:string;
  approversSendData: any;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private ES: ExceptionsService,
    private alert: AlertService,
    private message : MessageService,
    private spin: NgxSpinnerService,
    private mat_dlg: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    this.rejectionComments = this.data.rejectTxt
    this.po_num = this.data?.po_num
    let grn = this.data?.grnLine;
    if (grn) {
      grn?.forEach(el => {
        let obj = { LineNumber: el.POLineNumber, grnpackagingid: el.PackingSlip };
        this.GRNData.push(obj);
      })
    }
    if (this.type == 'flip') {
      this.component = 'normal';
    } else if (this.type == 'flip line') {
      this.component = 'mapping';
    } else if (this.type == 'editApprover'){
      this.approveBool = true;
      this.flipApproverlist();
    }
    if (this.data.comp == 'upload') {
      this.uploadBool = true;
    }
    this.POLineData = this.data.resp;
    this.POLineData.forEach(val => {
      val.isSelected = false;
    })
  }
  onSubmit(value) {
    this.spin.show();
    this.ES.flip_po(JSON.stringify(this.selectedPOLines)).subscribe((data: any) => {
      if (data?.result) {
        if(data.Flippo_Approval){
          this.flipApproverlist();
          this.alert.addObject.detail = "PO flip is successful, Please set the approvers."
          this.message.add(this.alert.addObject);
          this.approveBool = true;
        } else {
          this.ES.popupmsg.next(this.component);
          this.alert.addObject.detail = "PO flip is successful"
          this.message.add(this.alert.addObject);
          this.dialogRef.close();
        }


        // this.mat_dlg.open(FlipApprovalComponent, {
        //   width: '60%',
        //   height: '70vh',
        //   hasBackdrop: false
        // });
      } else {
        this.alert.errorObject.detail = data?.error
        this.message.add(this.alert.errorObject)
      }
      this.spin.hide();
    }, err => {
      this.alert.errorObject.detail = "Server error"
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
  onSelectAll(bool) {
    if (bool) {
      this.POLineData.forEach(val => {
        val.isSelected = true;
        let id = val.LineNumber;
        val.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
      })
      this.selectedPOLines = this.POLineData
    } else {
      this.selectedPOLines = [];
      this.POLineData.forEach(val => {
        val.isSelected = false;
      })
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
    this.dialogRef.close(this.rejectionComments);
  }

  validateFlip() {
    this.spin.show();
    let obj = {
      Podata: this.selectedPOLines,
      GRNdata: this.GRNData
    }
    this.ES.validateFlipPO(JSON.stringify(obj),this.po_num).subscribe((data:string) => {
      if (data == 'success') {
        this.ES.popupmsg.next(this.component);
        this.alert.addObject.detail = "PO flip is successful";
        this.message.add(this.alert.addObject);
        this.dialogRef.close(this.selectedPOLines);
      } else {
        this.alert.errorObject.detail = data;
        this.message.add(this.alert.errorObject);
      }
      this.spin.hide();
    }, err => {
      this.alert.errorObject.detail = "Server error"
      this.message.add(this.alert.errorObject)
      this.spin.hide();
    });

  }

  flipApproverlist(){
    this.ES.getFlipApprovers().subscribe((data:any)=>{
      let resultData = data?.result;
      this.approverList= data?.result
      let array = [];
      let list = [];
      let count = 0;
      for (const item in resultData) {
        count = count + 1;
        // list = resultData[item].sort((a, b) => a.priority - b.priority);
        // console.log(item)
        // this.approverList[`${item}`] = list;
        // console.log(item)
        array.push(resultData[item][0]);
      }
      this.approversSendData = array;
    })
  }
  onSelectApprovers(val,i){

  }

  setApprover(){
    this.ES.setFlipApproval(JSON.stringify(this.approversSendData)).subscribe((data)=>{
      this.alert.addObject.detail = "Successfully sent for Approvals"
      this.message.add(this.alert.addObject);
      this.dialogRef.close('success');
    })
  }

}
