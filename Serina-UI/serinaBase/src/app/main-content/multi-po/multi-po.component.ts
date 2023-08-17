import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { SharedService } from 'src/app/services/shared.service';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-multi-po',
  templateUrl: './multi-po.component.html',
  styleUrls: ['./multi-po.component.scss','../upload-section/upload-section.component.scss']
})
export class MultiPOComponent implements OnInit {
  selectedPONumber: any;
  PO_desc_line: any;
  GRN_number: any;
  GRN_desc_line: any;
  PO_amount_line: any;
  GRN_amount_line: any;
  GRN_qty: any;
  mutliplePOTableData = [];
  GRNLineData: any;
  GRNData: any;
  filteredGRN: any[];
  UniqueGRN: any;
  PO_qty: any;
  slectedPOLineDetails: any;
  selectedPOlinevalue: any;
  filteredPOLines: any[];
  poLineData: any;
  PO_GRN_Number_line: any;
  po_grn_line_list: any;
  po_grn_list: any;
  poNumbersList: any;
  selectedEntityId: any;
  selectedVendorID: any;
  s_date: string;
  e_date: string;
  rangeDates: Date[];
  minDate: Date;
  maxDate: Date;

  @ViewChild('multiPO') multiPO: NgForm;
  filteredPO_GRN: any[];
  filteredPO: any[];
  uploadExcelValue: any;
  summaryColumnField = [];
  summaryColumnHeader = [];
  customerSummary: any;
  showPaginatorSummary: boolean;
  totalSuccessPages: any;
  totalInvoices: any;

  summaryColumn = [
    { field: 'PONumber', header: 'PO Number' },
    { field: 'POLineDescription', header: 'PO Description' },
    { field: 'POLineNumber', header: 'PO LineNumber' },
    { field: 'GRNNumber', header: 'GRN Number' },
    { field: 'GRNLineDescription', header: 'GRN Description' },
    { field: 'POLineAmount', header: 'PO Line Amount' },
    { field: 'ConsumedPOQty', header: 'PO Qty' },
    { field: 'GRNLineAmount', header: 'GRN Line Amount' },
    { field: 'GRNQty', header: 'GRN Qty' },

  ];
  ColumnLengthVendor: number;

  constructor(    private spinnerService: NgxSpinnerService,
    private dateFilterService: DateFilterService,
    private alertService: AlertService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private datepipe: DatePipe,
    private dataService : DataService,
    public dialogRef: MatDialogRef<MultiPOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.selectedEntityId = this.dataService.entityID;
    this.selectedVendorID = this.dataService.vendorId;
    this.mutliplePOTableData = this.data.lines;
    this.dateRange();
  }

    // Set date range
    dateRange() {
      let today = new Date();
      let day = today.getDate()
      let month = today.getMonth() + 1;
      let year = today.getFullYear();
  
      this.s_date = `${year}-${month}-01`;
      this.e_date = `${year}-${month}-${day}`;
  
      this.dateFilterService.dateRange();
      this.minDate = this.dateFilterService.minDate;
      this.maxDate = this.dateFilterService.maxDate;
      this.readPONumbers(this.s_date, this.e_date);
    }
      // display columns
  findColumns() {
    this.summaryColumn.forEach((e) => {
      this.summaryColumnHeader.push(e.header);
      this.summaryColumnField.push(e.field);
    });

    this.ColumnLengthVendor = this.summaryColumn.length;
  }
    clearDates() { }
    filterData(val) {
      let s_date = this.datepipe.transform(val[0], "yyyy-MM-dd");
      let e_date = this.datepipe.transform(val[1], "yyyy-MM-dd");
      this.readPONumbers(s_date, e_date);
    }
    filterPOnumber(event) {
      // if(this.filterBool){
      let filtered: any[] = [];
      let query = event.query;
  
      if (this.poNumbersList?.length > 0) {
        for (let i = 0; i < this.poNumbersList?.length; i++) {
          let PO: any = this.poNumbersList[i];
          if (PO.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(PO);
          }
        }
      }
      this.filteredPO = filtered;
    }
  
    selectedPO(event) {
      // if (this.mutliPODailog) {
        this.readPOLines(event.PODocumentID);
      // }
      this.selectedPONumber = event.PODocumentID;
    }
    filterPO_GRNnumber(event){
      let filtered: any[] = [];
      let query = event.query;
  
      if (this.po_grn_list?.length > 0) {
        for (let i = 0; i < this.po_grn_list?.length; i++) {
          let PO: any = this.po_grn_list[i];
          if (PO.GRNField.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(PO);
          }
        }
      }
      this.filteredPO_GRN = filtered;
    }
  readPONumbers(s_d, e_d) {
    this.spinnerService.show();
    this.sharedService.readPOnumbers(this.selectedEntityId, this.selectedVendorID, s_d, e_d).subscribe((data: any) => {
      this.poNumbersList = data;
      this.spinnerService.hide();
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
      this.spinnerService.hide();
    })
  }

  readPOLines(po_num) {
    this.sharedService.readPOLines(po_num).subscribe((data: any) => {
      this.poLineData = data.PODATA;
      this.UniqueGRN = data?.GRNDATA?.filter((val1,i,a)=> a.findIndex(val2=>val2.PackingSlip == val1.PackingSlip) === i);
      this.GRNData = data?.GRNDATA
      // let jsonObj = data?.GRNDATA?.map(JSON.stringify);
      // let uniqeSet = new Set(jsonObj);
      // let unique = Array?.from(uniqeSet)?.map(JSON.parse);
      
      this.po_grn_list = data?.GRNDATA.filter((val1,index,arr)=> arr.findIndex(v2=>['PackingSlip'].every(k=>v2[k] ===val1[k])) === index);
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
    })
  }
  addGrnLine(val){
    this.po_grn_line_list = [];
    val?.value?.forEach(ele=>{
      this.GRNData.filter(el=>{
        if(ele.PackingSlip == el.PackingSlip){
          this.po_grn_line_list.push(el)
        }
      });
    })
    let arr = [];
    this.po_grn_line_list?.forEach(val=>{
        let ele = `${val.PackingSlip}-${val.POLineNumber}-${val.Name}`;
        arr.push({PackingSlip:val.PackingSlip,POLineNumber:val.POLineNumber,GRNField:ele});
      })
      this.po_grn_line_list = arr.filter((val1,index,arr)=> arr.findIndex(v2=>['PackingSlip','POLineNumber'].every(k=>v2[k] ===val1[k])) === index);
    this.PO_GRN_Number_line = this.po_grn_line_list;
  }
  filterPOLine(event) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.poLineData?.length > 0) {
      for (let i = 0; i < this.poLineData?.length; i++) {
        let PO: any = this.poLineData[i];
        if (PO.Name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(PO);
        }
      }
    }
    this.filteredPOLines = filtered;
  }

  selectedPOLine(event) {
    this.selectedPOlinevalue = event.Name;
    this.slectedPOLineDetails = event;
    // let obj = {
    //   PODocumentID : this.selectedPONumber,
    //   Name : event.Name,
    //   PO_line_amount : event.UnitPrice * event.PurchQty,
    //   PurchQty : event.PurchQty
    // }
    // this.multiPO.control.patchValue(obj);
    this.PO_desc_line = event.Name;
    this.PO_amount_line = event.UnitPrice;
    this.PO_qty = event.PurchQty;
  }

  filterGRNnumber(event, name) {
    let filtered: any[] = [];
    let query = event.query;

    if (name == 'grn_num') {
      for (let i = 0; i < this.UniqueGRN?.length; i++) {
        let PO: any = this.UniqueGRN[i];
        if (PO?.PackingSlip?.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(PO);
        }
      }

    } else {
      for (let i = 0; i < this.GRNLineData?.length; i++) {
        let PO: any = this.GRNLineData[i];
        if (PO.Name.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(PO);
        }
      }

    }

    this.filteredGRN = filtered;
    
  }
  selectedGRN(event, name) {
    if (name == 'grn_num') {
      this.GRN_number = event.PackingSlip;
      this.GRNLineData = this.GRNData.filter(ele => (ele.PackingSlip === event.PackingSlip) &&(ele.POLineNumber == this.slectedPOLineDetails.LineNumber) );
    } else {
      this.GRN_desc_line = event.Name;
      this.GRN_amount_line = event.Price * event.Qty;
      this.GRN_qty = event.Qty;
    }
    // let obj = {
    //   GRN_Name : event.Name,
    //   GRN_line_amount : event.UnitPrice * event.Qty,
    //   Qty : event.Qty
    // }
    // this.multiPO.control.patchValue(obj);

  }

  addMultiPOLines(value) {
    let obj = {
      "PONumber": this.selectedPONumber,
      "POLineNumber": value.Name.LineNumber,
      "POLineDescription": this.PO_desc_line,
      "GRNNumber": this.GRN_number,
      "GRNLineDescription": this.GRN_desc_line,
      "POLineAmount": this.PO_amount_line,
      "ConsumedPOQty": value.ConsumedPOQty,
      "POremainingQty": value.Name.RemainPurchFinancial,
      "GRNLineAmount": this.GRN_amount_line,
      "GRNQty": this.GRN_qty
    }
    this.mutliplePOTableData.push(obj);
    this.multiPO.resetForm();
  }

  onChange(evt) {
    const formData = new FormData();
    formData.append("file", evt.target.files[0]);
    let data, data1, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      data = XLSX.utils.sheet_to_json(ws);
    };

    reader.readAsBinaryString(target.files[0]);

    reader.onloadend = (e) => {
      this.uploadExcel_multiPO(formData, data)
    }

  }

  uploadExcel_multiPO(file, json_data) {
    this.spinnerService.show();
    this.sharedService.uploadMultiPO(file).subscribe((data: any) => {
      if (data.Result.excelCheck == 1) {
        json_data.forEach(ele => {
          this.mutliplePOTableData.push(ele);
        });
        this.alertService.addObject.detail = data.Result.status_msg;
        this.messageService.add(this.alertService.addObject);
      } else {
        this.alertService.errorObject.detail = data.Result.status_msg;
        this.messageService.add(this.alertService.errorObject);
      }
      // this.mutliPODailog = false;
      // this.poTypeBoolean = true;
      this.spinnerService.hide();
    }, err => {
      this.alertService.errorObject.detail = "Server error"
      this.messageService.add(this.alertService.errorObject);
    })
    // delete this.uploadExcelValue;
  }

  downloadTemplate() {
    this.sharedService.downloadTemplate('').subscribe((data: any) => {
      this.excelDownload(data, 'Multiple PO upload template');
    })
  }
  excelDownload(data, type) {
    let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    let d = new Date();
    let datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    fileSaver.saveAs(blob, `${type}-(${datestring})`);
  }

  closeDlg(){
    this.dialogRef.close();
  }
  deleteMultiPO(index, data){
    if (confirm('Are you sure you want to delete?')) {
      this.mutliplePOTableData.splice(index,1);
    }
  }
  updateMultiPO(){
    this.dialogRef.close(this.mutliplePOTableData);
  }
}
