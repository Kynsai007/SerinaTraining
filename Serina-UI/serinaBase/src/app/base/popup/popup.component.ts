import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss','../invoice/view-invoice/view-invoice.component.scss']
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
  lineTable = [ 'Description','Unit','Price','Quantity'];
  orderHistoryData: any;
  masterData: any;
  orderData: any;
  textlngth: any;
  updateSOObj: any;
  line_num:number;
  v_a_id: any;
  so_id: any;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private ES: ExceptionsService,
    private alert: AlertService,
    private message : MessageService,
    private spin: NgxSpinnerService,
    private ds : DataService,
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
      this.flipPOFun();
    } else if (this.type == 'flip line') {
      this.component = 'mapping';
      this.flipPOFun();
    } else if (this.type == 'editApprover'){
      this.approveBool = true;
      this.flipApproverlist();
    } else if(this.type == 'poMaster'){
      this.v_a_id = this.data.resp.v_a_id;
      this.line_num = this.data.resp.itemCode;
      this.so_id = this.data.resp.so_id;
      if(!this.ds.arenaMasterData){
        this.getPOMasterData(this.v_a_id);
      } else {
        this.orderHistoryData = this.ds.arenaMasterData;
      }
    }
    if (this.data.comp == 'upload') {
      this.uploadBool = true;
    }

  }

  flipPOFun(){
    console.log(this.data.resp)
    this.POLineData = this.data.resp;
    this.POLineData.forEach(val => {
      val.isSelected = false;
    })
    console.log(this.POLineData);
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

  getPOMasterData(v_id){
    this.ES.readMasterData(v_id).subscribe((data:any)=>{
      console.log(data);
      this.ds.arenaMasterData = data;
      this.orderHistoryData = data;
      this.orderData = data.order_history;
      this.masterData = data.master_data;
    })
  }

  onSelectMaster(des) {
    this.updateSOObj = {
      "so_line_number": this.line_num,
      "Value": des
    }
  }

  onSearch(val,tab){
    let dataArray ;
    let dataField:string ;
    let field:string;
    if(tab == 'order') {
      dataArray = this.orderData;
      dataField = "order_history";
      field = 'Description';
    } else if(tab == 'master') {
      dataArray = this.masterData;
      dataField = "master_data";
      field = 'description';
    }
    if(val != ''){
      if(val.length < this.textlngth){
        this.orderHistoryData[dataField] = dataArray;
      }
      this.textlngth = val.length;
      this.orderHistoryData[dataField] = this.orderHistoryData[dataField].filter((el)=>{
        return el[field].toLowerCase().includes(val.toLowerCase());
      })
    } else {
      this.orderHistoryData[dataField] = dataArray;
    }
  }

  updateMapping() {
    console.log(this.so_id,this.v_a_id,this.updateSOObj);
    this.ES.updateSOmap(this.so_id,this.v_a_id,this.updateSOObj).subscribe((data)=>{
      this.alert.addObject.detail = "SO Line is mapped successfully";
      this.message.add(this.alert.addObject);
      this.dialogRef.close('Mapped');
    })
  }
}
