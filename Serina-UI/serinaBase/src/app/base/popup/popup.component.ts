import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/dataStore/data.service';
import { DatePipe } from '@angular/common';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { Calendar } from 'primeng/calendar';

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
  isQuantityChanged: boolean;
  linesTotal: number = 0;
  inv_total:number;
  select_all_bool:boolean;
  approversSendData: any;
  lineTable = [
    { name: 'Description', data:[]},
    { name: 'PO Quantity', data:[]},
    { name: 'Balance Qty', data:[]}
  ];
  orderHistoryData: any;
  masterData: any;
  orderData: any;
  textlngth: any;
  updateSOObj: any;
  line_num:number;
  v_a_id: any;
  so_id: any;
  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  @ViewChild('datePicker') datePicker: Calendar;
  manPowerData = [];
  grnLineCount:any
  timeSheet: any[];


  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private ES: ExceptionsService,
    private alert: AlertService,
    private spin: NgxSpinnerService,
    private ds : DataService,
    private mat_dlg: MatDialog,
    private datePipe: DatePipe,
    private dateFilterService :DateFilterService,
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
    if (this.type == 'flip' || this.type == 'flip returns') {
      this.component = 'normal';
      this.flipPOFun();
    } else if (this.type == 'flip line') {
      this.component = 'mapping';
      this.flipPOFun();
    } else if (this.type == 'editApprover'){
      this.approveBool = true;
      this.flipApproverlist();
    } else if(this.type == 'manpower'){
      this.dateRange()
    }
    if (this.data.comp == 'upload') {
      this.uploadBool = true;
    }
    this.POLineData = this.data?.resp?.podata;
    this.inv_total = this.data?.resp?.sub_total;
    this.manPowerData = JSON.parse(JSON.stringify(this.data?.resp?.grnData_po));
    this.manPowerData = this.manPowerData.filter(el=>{
    return el.TagName == 'Description' || el.TagName == 'PO Qty' || el.TagName == 'Actions' 
    })
    this.grnLineCount = this.manPowerData[0].linedata;
    this.POLineData?.forEach(val => {
      val.isSelected = false;
      val.Quantity = val.PurchQty;
    })

  }

  flipPOFun(){
    this.POLineData = this.data?.resp?.podata;
    this.POLineData.forEach(val => {
      val.isSelected = false;
    })
  }
  onSubmit(value) {
    this.spin.show();
    this.ES.flip_po(this.selectedPOLines).subscribe((data: any) => {
      if (data?.result) {
        if(data.Flippo_Approval){
          this.flipApproverlist();
          this.success("PO flip is successful")
          this.approveBool = true;
        } else {
          this.ES.popupmsg.next(this.component);
          this.success("PO flip is successful")
          this.dialogRef.close();
        }


        // this.mat_dlg.open(FlipApprovalComponent, {
        //   width: '60%',
        //   height: '70vh',
        //   hasBackdrop: false
        // });
      } else {
        this.error(data?.error)
      }
      this.spin.hide();
    }, err => {
      this.error("Server error");
      this.spin.hide();
    })
  }
  onSelect(bool, data,field) {
    let id = data[field];
    data.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
    if (bool) {
      let boolean = this.selectedPOLines?.findIndex(el => el[field] == data[field]);
      if (boolean) {
        this.selectedPOLines.push(data);
        this.linesTotal = Number(this.linesTotal) + Number((data?.Quantity * data?.UnitPrice).toFixed(2))
      }
    } else {
      const ind = this.selectedPOLines?.findIndex(el => el[field] == data[field]);
      if (ind != -1) {
        this.selectedPOLines.splice(ind, 1)
        this.linesTotal = Number(this.linesTotal) - Number((data?.Quantity * data?.UnitPrice).toFixed(2))
      }
    }
    if(this.selectedPOLines.length == this.POLineData.length){
      this.select_all_bool = true;
    } else {
      this.select_all_bool = false;
    }
  }
  onSelectAll(bool,field) {
    if (bool) {
      this.POLineData.forEach(val => {
        val.isSelected = true;
        let id = val[field];
        val.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
        this.linesTotal = Number(this.linesTotal) + Number((val?.Quantity * val?.UnitPrice).toFixed(2))
      })
      const allData = [...this.POLineData]
      this.selectedPOLines = allData;
      this.select_all_bool = true;
    } else {
      this.select_all_bool = false;
      this.selectedPOLines = [];
      this.linesTotal = 0;
      this.POLineData.forEach(val => {
        val.isSelected = false;
      })
    }
  }
  changeQty(qty, lineid,field) {
    let el_flied = 'Quantity';
    this.isQuantityChanged = true;
    this.linesTotal = 0;
    if(this.type == 'flip returns'){
      el_flied = 'rtn_qty'
    }
    this.selectedPOLines.forEach(el => {
      if (el[field] == lineid) {
        el[el_flied] = qty;
      }
      this.linesTotal = Number(this.linesTotal) + Number((el?.Quantity * el?.UnitPrice).toFixed(2))
    });
    // this.linesTotal = 0;
    this.POLineData.forEach(el => {
      if (el.LineNumber == lineid) {
        el.Quantity = qty;
      }
      // this.linesTotal = Number(this.linesTotal) + Number((el.PurchQty * el.UnitPrice).toFixed(2))

    })
  }
  onSubmitRequest(val) {
    this.dialogRef.close(this.rejectionComments);
  }

  validateFlip() {
    this.spin.show();
    if( this.type != 'flip returns'){
      let obj = {
        Podata: this.selectedPOLines,
        GRNdata: this.GRNData
      }
      this.ES.validateFlipPO(obj,this.po_num).subscribe((data:string) => {
        if (data == 'success') {
          this.ES.popupmsg.next(this.component);
          this.success("PO flip is successful")
          this.dialogRef.close(this.selectedPOLines);
        } else {
          this.error(data)
        }
        this.spin.hide();
      }, err => {
        this.error("Server error");
        this.spin.hide();
      });
    } else {
      let APIdata = [];
      this.selectedPOLines.forEach(el=>{
        APIdata.push({
            "description": el.Description,
            "rtn_qty": el.rtn_qty|| el.Quantity,
            "item_code": el.itemCode,
            "po_line_number":el.itemCode,
            "inv_qty": el.Quantity
        })
      })
      this.ES.validateReturns(APIdata).subscribe((data:any)=>{
        if(data.result == 'Success') {
          this.success("Successful")
          this.dialogRef.close(APIdata);
        } else {
          this.error(data.result)
        }
        this.spin.hide();
      }, err => {
        this.error("Server error");
        this.spin.hide();
      });
    }

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
    this.ES.setFlipApproval(this.approversSendData).subscribe((data)=>{
      this.success("Successfully sent for Approvals")
      this.dialogRef.close('success');
    },err=>{
      this.error("Server error");
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
    this.ES.updateSOmap(this.so_id,this.v_a_id,this.updateSOObj).subscribe((data)=>{
      // this.alert.addObject.detail = "SO Line is mapped successfully";
      // this.message.add(this.alert.addObject);
      this.dialogRef.close('Mapped');
    })
  }
  success(msg) {
    this.alert.success_alert(msg);
  }
  error(msg) {
   this.alert.error_alert(msg);
  }
  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }
  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'MMM d, y');
      const toDate = this.datePipe.transform(date[1], 'MMM d, y');
      if(frmDate && toDate){
        if (this.datePicker.overlayVisible) {
          this.datePicker.hideOverlay();
        }
        let month = frmDate?.split(',')[0]?.split(' ')[0]
        let date:any = frmDate?.split(',')[0]?.split(' ')[1]
        let date1:any = toDate?.split(',')[0]?.split(' ')[1]
        this.timeSheet = []
        this.grnLineCount.forEach((el,index)=>{
          this.timeSheet.push({
                      Value : '',
                      tagName: `timeSheet${index}`,
                      ErrorDesc: '',
                      idDocumentLineItems: null,
                      is_mapped:'',
                      old_value:'',
          })
        })
        this.manPowerData.splice(2,0,{ TagName:`Shift`,linedata: this.timeSheet})
        let index = 3
        for(let i = Number(date); i<= Number(date1); i++){
          let data =  []
          let sheet = JSON.parse(JSON.stringify(this.timeSheet))
          sheet.forEach((el,index)=>{
            el.tagName = `${month}-${i}-${index}`
            data.push(el)
          })
          this.manPowerData.splice(index,0,{ TagName:`${month} ${i}`,linedata: data})
          index++
        }
      }
    }
  }
  clearDates() {
    this.filterByDate('');
  }
  addNewShift(str,index){
    this.manPowerData.forEach(el=>{
      el.linedata.splice(index+1,0,JSON.parse(JSON.stringify(el.linedata[index])))
    })
    this.manPowerData.forEach(el=>{
      el.linedata.forEach((v,i)=>{
        if( index+1 == i && el.TagName != 'Description' && el.TagName != "PO Qty"){
          
          v.tagName = `shift${index+1}-${el.TagName}`
          console.log(v.tagName)
        }
      })
    })
    console.log(this.manPowerData)
  }
}
