import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';
@Component({
  selector: 'process-metrics',
  templateUrl: './process-metrics.component.html',
  styleUrls: ['./process-metrics.component.scss']
})
export class ProcessMetricsComponent implements OnInit {
  @Input() exceptionData:any;
  totalInv: number;
  UnderProcessInv: number;
  PostedInv: number;
  CollectionsInv: number;
  RejectedInv: number;

  tabName;
  totalTableData = [];
  columnsForTotal = [];
  totalColumnHeader = [];
  totalColumnField = [];
  ColumnLengthtotal: any;
  showPaginatortotal: boolean;

  UnderProcessTableData = [];
  columnsForUnderProcess = [];
  UnderProcessColumnHeader = [];
  UnderProcessColumnField = [];
  ColumnLengthUnderProcess: any;
  showPaginatorUnderProcess: boolean;

  PostedTableData = [];
  columnsForPosted = [];
  PostedColumnHeader = [];
  PostedColumnField = [];
  ColumnLengthPosted: any;
  showPaginatorPosted: boolean;

  CollectionsTableData = [];
  columnsForCollections = [];
  CollectionsColumnHeader = [];
  CollectionsColumnField = [];
  ColumnLengthCollections: any;
  showPaginatorCollections: boolean;

  RejectedTableData = [];
  columnsForRejected = [];
  RejectedColumnHeader = [];
  RejectedColumnField = [];
  ColumnLengthRejected: any;
  showPaginatorRejected: boolean;

  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  filterDataTotal: any[];
  filterDataUnderProcess: any[];
  filterDataPosted: any[];
  filterDataCollections: any[];
  filterDataRejected: any[];
  cardsArr = [
    { title: 'Total Invoices' , count:0, image:'vendor_up',name:'Total' },
    { title: 'Invoice Under Process' , count:0, image:'vendor_rm' ,name:'UnderProcess'},
    { title: 'Invoiced' , count:0, image:'vendor_pr',name:'Posted' },
    { title: 'Collections' , count:0, image:'vendor_pr',name:'Collections' },
    { title: 'Rejected' , count:0, image:'vendor_rej',name:'Rejected' }]
  constructor(
    private chartsService: ChartsService,
    private SpinnerService: NgxSpinnerService,
    private ImportExcelService: ImportExcelService,
    private dateFilterService: DateFilterService,
    private datePipe: DatePipe,
  ) {}
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.exceptionData &&  changes.exceptionData.currentValue && changes.exceptionData.currentValue.data) {
  //     this.readExceptionData(this.exceptionData);
  //   }
  // }

  ngOnInit(): void {
    // this.tagService.editedTabValue = 'invoice';
    // this.tagService.aprrovalPageTab = 'vendorInvoice';
    // this.tagService.PostedProcessTab = 'normal';
    this.tabName = this.chartsService.exceptionVendorTab;
    this.dateRange();
    this.prepareColumns();
    this.readInvoicedData('');
    this.readTotalInvoiceData('');
    this.readUnderProcessData('');
    this.readCollectionsData('');
    this.readRejectedData('');

  }
  choosepageTab(value) {
    // this.filterByDate('');
    // delete this.rangeDates;
    this.tabName = value;
    console.log(value)
    this.chartsService.exceptionVendorTab = value;
        // this.totalTableData = this.filterDataTotal;
        // this.totalInv = this.totalTableData.length;
        // this.UnderProcessTableData = this.filterDataUnderProcess ;
        // this.UnderProcessInv = this.UnderProcessTableData.length;
        // this.PostedTableData  = this.filterDataPosted;
        // this.PostedInv = this.PostedTableData.length;
        // this.CollectionsTableData = this.filterDataCollections ;
        // this.CollectionsInv = this.CollectionsTableData.length;
        // this.RejectedTableData = this.filterDataRejected ;
        // this.RejectedInv = this.RejectedTableData.length;
  }

  prepareColumns() {
    this.columnsForTotal = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      { dbColumnname: 'EntityName', columnName: 'Entity' },
      { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
      // { dbColumnname: 'sourcetype', columnName: 'source' },
    ];

    this.columnsForUnderProcess = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      // { dbColumnname: 'Account', columnName: 'Vendor Account' },
      { dbColumnname: 'documentdescription', columnName: 'Description' },
      { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
      { dbColumnname: 'docStatus', columnName: 'Status' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
    ];

    this.columnsForPosted = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      // { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      // { dbColumnname: 'Name', columnName: 'Rule' },
      { dbColumnname: 'docStatus', columnName: 'Status' },
      { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
      { dbColumnname: 'documentDate', columnName: 'Posted Date' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
      // { dbColumnname: 'Account', columnName: 'Actions' },
    ];

    this.columnsForCollections = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      // { dbColumnname: 'Account', columnName: 'Vendor Account' },
      // { dbColumnname: 'Account', columnName: 'Approval Type' },
      { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
      { dbColumnname: 'documentDate', columnName: 'Posted Date' },
      { dbColumnname: 'documentDate', columnName: 'Payment Date' },
      // { dbColumnname: 'UpdatedOn', columnName: 'Last Modified' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
    ];

    this.columnsForRejected = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      { dbColumnname: 'EntityName', columnName: 'Entity' },
      { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
      { dbColumnname: 'documentdescription', columnName: 'Description' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
    ];
    this.columnsForTotal.forEach((e) => {
      this.totalColumnHeader.push(e.columnName);
      this.totalColumnField.push(e.dbColumnname);
    });

    this.columnsForUnderProcess.forEach((e) => {
      this.UnderProcessColumnHeader.push(e.columnName);
      this.UnderProcessColumnField.push(e.dbColumnname);
    });
    this.columnsForPosted.forEach((e) => {
      this.PostedColumnHeader.push(e.columnName);
      this.PostedColumnField.push(e.dbColumnname);
    });
    this.columnsForCollections.forEach((e) => {
      this.CollectionsColumnHeader.push(e.columnName);
      this.CollectionsColumnField.push(e.dbColumnname);
    });
    this.columnsForRejected.forEach((e) => {
      this.RejectedColumnHeader.push(e.columnName);
      this.RejectedColumnField.push(e.dbColumnname);
    });

    this.ColumnLengthtotal = this.columnsForTotal.length;
    this.ColumnLengthUnderProcess = this.columnsForUnderProcess.length;
    this.ColumnLengthPosted = this.columnsForPosted.length;
    this.ColumnLengthCollections = this.columnsForCollections.length;
    this.ColumnLengthRejected = this.columnsForRejected.length;
  }

  readTotalInvoiceData(filter){
    this.chartsService.getTotalInvoiceData(filter).subscribe((data:any)=>{
      this.totalTableData = data.data;
      this.cardsArr[0].count = this.totalTableData.length;
      if(this.totalTableData.length>10){
        this.showPaginatortotal = true;
      }
    })
  }
  readUnderProcessData(filter){
    this.chartsService.getUnderprocessInvoiceData(filter).subscribe((data:any)=>{
      this.UnderProcessTableData = data.data;
      this.cardsArr[1].count  = this.UnderProcessTableData.length;
      if(this.cardsArr[1].count>10){
        this.showPaginatorUnderProcess = true;
      }
    })
  }
  readInvoicedData(filter){
    this.chartsService.getInvoicedData(filter).subscribe((data:any)=>{
      this.PostedTableData = data.data;
      this.cardsArr[2].count = this.PostedTableData.length;
      if(this.cardsArr[2].count>10){
        this.showPaginatorPosted = true;
      }
    })
  }
  readCollectionsData(filter){
    this.chartsService.getCollectionData(filter).subscribe((data:any)=>{
      this.CollectionsTableData = data.data;
      this.cardsArr[3].count = this.CollectionsTableData.length;
      if(this.cardsArr[3].count>10){
        this.showPaginatorCollections = true;
      }
    })
  }
  readRejectedData(filter){
    this.chartsService.getRejectedData(filter).subscribe((data:any)=>{
      this.RejectedTableData = data.data;
      this.cardsArr[4].count = this.RejectedTableData.length;
      if(this.cardsArr[4].count>10){
        this.showPaginatorCollections = true;
      }
    })
  }
  searchInvoiceDataV(evnt){

  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  downloadReport(){
    if(this.tabName == 'Total') {
      this.ImportExcelService.exportExcel(this.totalTableData);
    } else if(this.tabName == 'UnderProcess'){
      this.ImportExcelService.exportExcel(this.UnderProcessTableData);
    } else if(this.tabName == 'Posted'){
      this.ImportExcelService.exportExcel(this.PostedTableData);
    } else if(this.tabName == 'Collections'){
      this.ImportExcelService.exportExcel(this.CollectionsTableData);
    } else if(this.tabName == 'Rejected'){
      this.ImportExcelService.exportExcel(this.RejectedTableData);
    }
  }

  filterByDate(date) {
    let date1: any = this.datePipe.transform(date[0], 'yyyy-MM-dd');
    let date2: any = this.datePipe.transform(date[1], 'yyyy-MM-dd');
    console.log(date1, date2);

    let dateFilter = '';
    if (date != '') {
      dateFilter = `?date=${date1}To${date2}`;
    }
    this.readInvoicedData(dateFilter);
    this.readTotalInvoiceData(dateFilter);
    this.readUnderProcessData(dateFilter);
    this.readCollectionsData(dateFilter);
    this.readRejectedData(dateFilter);
    this.closeDialog();
  }

  clearDates(){
    this.filterByDate('');
  }
  openFilterDialog(event){
    let top = event.clientY + 10 + "px";
    let left = "calc(55% + 100px)";
    const dialog = document.querySelector('dialog');
    dialog.style.top = top;
    dialog.style.left = left;
    if(dialog){
      dialog.showModal();
    }
  }

  closeDialog(){
    const dialog = document.querySelector('dialog');
    if(dialog){
      dialog.close();
    }
  }
}
