import { ImportExcelService } from './../../../../services/importExcel/import-excel.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { SharedService } from 'src/app/services/shared.service';
import { TaggingService } from 'src/app/services/tagging.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { DatePipe } from '@angular/common';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-exception-reports',
  templateUrl: './exception-reports.component.html',
  styleUrls: ['./exception-reports.component.scss'],
})
export class ExceptionReportsComponent implements OnInit, OnChanges {
  exceptionData: any;
  totalInv: number;
  OcrInv: number;
  batchInv: number;
  ErpInv: number;

  tabName;
  totalTableData = [];
  columnsForTotal = [];
  totalColumnHeader = [];
  totalColumnField = [];
  ColumnLengthtotal: any;
  showPaginatortotal: boolean;

  OCRTableData = [];
  columnsForOCR = [];
  OCRColumnHeader = [];
  OCRColumnField = [];
  ColumnLengthOCR: any;
  showPaginatorOCR: boolean;

  batchTableData = [];
  columnsForbatch = [];
  batchColumnHeader = [];
  batchColumnField = [];
  ColumnLengthbatch: any;
  showPaginatorbatch: boolean;

  ERPTableData = [];
  columnsForERP = [];
  ERPColumnHeader = [];
  ERPColumnField = [];
  ColumnLengthERP: any;
  showPaginatorERP: boolean;

  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  filterDataTotal: any[];
  filterDataOCR: any[];
  filterDataBatch: any[];
  filterDataERP: any[];
  partyType: string;
  constructor(
    private dataService: DataService,
    private chartsService: ChartsService,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private ImportExcelService: ImportExcelService,
    private dateFilterService: DateFilterService,
    private datePipe: DatePipe,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.exceptionData &&  changes.exceptionData.currentValue && changes.exceptionData.currentValue.data) {
    //   this.readExceptionData(this.exceptionData);
    // }
  }

  ngOnInit(): void {
    // this.tagService.editedTabValue = 'invoice';
    // this.tagService.aprrovalPageTab = 'vendorInvoice';
    // this.tagService.batchProcessTab = 'normal';
    this.tabName = this.chartsService.exceptionVendorTab;
    if(this.dataService.ap_boolean){
      this.partyType = 'Vendor';
    } else {
      this.partyType = 'Customer';
    }
    this.dateRange();
    this.prepareColumns();
    this.readExceptionData('');

  }
  choosepageTab(value) {
    // this.filterByDate('');
    // delete this.rangeDates;
    this.tabName = value;
    this.chartsService.exceptionVendorTab = value;
    // this.totalTableData = this.filterDataTotal;
    // this.totalInv = this.totalTableData.length;
    // this.OCRTableData = this.filterDataOCR ;
    // this.OcrInv = this.OCRTableData.length;
    // this.batchTableData  = this.filterDataBatch;
    // this.batchInv = this.batchTableData.length;
    // this.ERPTableData = this.filterDataERP  ;
    // this.ErpInv = this.ERPTableData.length;
  }

  prepareColumns() {
    this.columnsForTotal = [
      { field: 'VendorName', header: `${this.partyType} Name`},
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'PODocumentID', header: 'PO Number' },
      { field: 'EntityName', header: 'Entity' },
      { field: 'documentDate', header: 'Invoice Date' },
      { field: 'totalAmount', header: 'Amount' },
      { field: 'sourcetype', header: 'source' },
    ];

    this.columnsForOCR = [
      { field: 'VendorName', header: `${this.partyType} Name` },
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'Account', header: `${this.partyType} Account` },
      { field: 'documentdescription', header: 'Description' },
      { field: 'documentDate', header: 'Invoice Date' },
      // { field: 'UpdatedOn', header: 'Last Modified' },
      { field: 'totalAmount', header: 'Amount' },
    ];

    this.columnsForbatch = [
      { field: 'VendorName', header: `${this.partyType} Name` },
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'PODocumentID', header: 'PO Number' },
      // { field: 'Name', header: 'Rule' },
      { field: 'status', header: 'Status' },
      { field: 'documentDate', header: 'Invoice Date' },
      { field: 'totalAmount', header: 'Amount' },
      // { field: 'Account', header: 'Actions' },
    ];

    this.columnsForERP = [
      { field: 'VendorName', header: `${this.partyType} Name` },
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'Account', header: `${this.partyType} Account` },
      // { field: 'Account', header: 'Approval Type' },
      { field: 'documentDate', header: 'Invoice Date' },
      // { field: 'UpdatedOn', header: 'Last Modified' },
      { field: 'totalAmount', header: 'Amount' },
    ];

    this.columnsForTotal.forEach((e) => {
      this.totalColumnHeader.push(e.header);
      this.totalColumnField.push(e.field);
    });

    this.columnsForOCR.forEach((e) => {
      this.OCRColumnHeader.push(e.header);
      this.OCRColumnField.push(e.field);
    });
    this.columnsForbatch.forEach((e) => {
      this.batchColumnHeader.push(e.header);
      this.batchColumnField.push(e.field);
    });
    this.columnsForERP.forEach((e) => {
      this.ERPColumnHeader.push(e.header);
      this.ERPColumnField.push(e.field);
    });

    this.ColumnLengthtotal = this.columnsForTotal.length;
    this.ColumnLengthOCR = this.columnsForOCR.length;
    this.ColumnLengthbatch = this.columnsForbatch.length;
    this.ColumnLengthERP = this.columnsForERP.length;
  }
  readExceptionData(query) {
    this.SpinnerService.show();
    this.chartsService.getvendorExceptionSummary(query).subscribe((data) => {
      console.log(data);
      this.exceptionData = data;
      // this.totalInv = data.data.total[0].count;
      // this.OcrInv = data.data.ocrqueue[0].count;
      // this.batchInv = data.data.batchqueue[0].count;
      // this.ErpInv = data.data.erpqueue[0].count;
      let mergedArray = [];
      this.totalTableData = [];
      this.OCRTableData = [];
      this.ERPTableData = [];
      this.batchTableData = [];
      data.data.documentdata.forEach(element => {
        let combineData = { ...element.Document, ...element.Vendor, ...element.VendorAccount, ...element.Entity,...element.DocumentSubStatus }
        mergedArray.push(combineData)
      });


      mergedArray.forEach((element) => {
        if (element.documentsubstatusID == 32 || element.documentsubstatusID == 40) {
          this.ERPTableData.push(element);
        } else if(element.documentsubstatusID == 29) {
          this.OCRTableData.push(element);
        } else {
            this.batchTableData.push(element);
          } 
      });
      // (element.documentsubstatusID == 7 )&& 
      // (element.documentsubstatusID == 8 )&& 
      // (element.documentsubstatusID == 9 )&& 
      // (element.documentsubstatusID == 14 )&& 
      // (element.documentsubstatusID == 15 )&& 
      // (element.documentsubstatusID == 16 )&& 
      // (element.documentsubstatusID == 17 )&& 
      // (element.documentsubstatusID == 19 )&& 
      // (element.documentsubstatusID == 20) && 
      // (element.documentsubstatusID == 21) && 
      // (element.documentsubstatusID == 22) && 
      // (element.documentsubstatusID == 27) && 
      // (element.documentsubstatusID == 28) && 
      // (element.documentsubstatusID == 33) && 
      // (element.documentsubstatusID == 34)  
      // if (element.documentStatusID == 4 && (element.documentsubstatusID != 4 && element.documentsubstatusID != 31 && element.documentsubstatusID != 35 && element.documentsubstatusID != 36 && element.documentsubstatusID != 38 && element.documentsubstatusID != 39))
      this.OcrInv = this.OCRTableData.length;
      if (this.OCRTableData.length > 10) {
        this.showPaginatorOCR = true;
      } else {
        this.showPaginatorOCR = false;
      }
      if (this.batchTableData.length > 10) {
        this.showPaginatorbatch = true;
      } else {
        this.showPaginatorbatch = false;
      }
      this.batchInv = this.batchTableData.length;
      this.ErpInv = this.ERPTableData.length;
      if (this.ERPTableData.length > 10) {
        this.showPaginatorERP = true;
      } else {
        this.showPaginatorERP = false;
      }
      // },(err)=>{
      //   this.SpinnerService.hide();
      // });
      this.totalTableData = this.OCRTableData.concat(this.batchTableData, this.ERPTableData);
      this.totalInv = this.totalTableData.length;
      if (this.totalInv > 10) {
        this.showPaginatortotal = true;
      } else {
        this.showPaginatortotal = false;
      }
      // this.filterDataTotal = this.totalTableData;
      // this.filterDataOCR = this.OCRTableData;
      // this.filterDataBatch = this.batchTableData;
      // this.filterDataERP = this.ERPTableData;
      this.SpinnerService.hide();
    }, (err) => {
      this.SpinnerService.hide();
    });
  }
  // readExceptionData(data) {
  //   // this.SpinnerService.show();
  //   // this.chartsService.getvendorExceptionSummary().subscribe((data) => {

  // }
  searchInvoiceDataV(evnt) {

  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  downloadReport() {
    if (this.tabName == 'Total') {
      this.ImportExcelService.exportExcel(this.totalTableData);
    } else if (this.tabName == 'OCR') {
      this.ImportExcelService.exportExcel(this.OCRTableData);
    } else if (this.tabName == 'Batch') {
      this.ImportExcelService.exportExcel(this.batchTableData);
    } else if (this.tabName == 'ERP') {
      this.ImportExcelService.exportExcel(this.ERPTableData);
    }
  }

  filterByDate(date) {
    // if(date != ''){


    let dateFilter = '';
    if (date != '') {
      console.log(date)
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      dateFilter = `?date=${frmDate}To${toDate}`;
    }
    this.readExceptionData(dateFilter);
    // this.readInvoicedData(dateFilter);
    // this.readTotalInvoiceData(dateFilter);
    // this.readUnderProcessData(dateFilter);
    // this.readCollectionsData(dateFilter);
    // this.readRejectedData(dateFilter);
    // this.filterData = [];
    // if (this.tabName == 'Total') {
    //   this.totalTableData = this.filterDataTotal;
    //   this.totalTableData = this.totalTableData.filter((element) => {
    //     const dateF = new Date(element.CreatedOn).toISOString().split('T');
    //     console.log(dateF[0],frmDate,toDate)
    //     return (dateF[0] >= frmDate && dateF[0] <= toDate)
    //   });
    //   this.totalInv = this.totalTableData.length;
    // } else if(this.tabName == 'OCR'){
    //   this.OCRTableData = this.filterDataOCR;
    //   this.OCRTableData = this.OCRTableData.filter((element) => {
    //     const dateF = new Date(element.CreatedOn).toISOString().split('T');

    //     return (dateF[0] >= frmDate && dateF[0] <= toDate)
    //   });
    //   this.OcrInv = this.OCRTableData.length;
    // } else if(this.tabName == 'Batch'){
    //   this.batchTableData = this.filterDataBatch;
    //   this.batchTableData = this.batchTableData.filter((element) => {
    //     const dateF = new Date(element.CreatedOn).toISOString().split('T');

    //     return (dateF[0] >= frmDate && dateF[0] <= toDate)
    //   });
    //   this.batchInv = this.batchTableData.length;
    // } else if(this.tabName == 'ERP'){
    //   this.ERPTableData = this.filterDataERP;
    //   this.ERPTableData = this.ERPTableData.filter((element) => {
    //     const dateF = new Date(element.CreatedOn).toISOString().split('T');

    //     return (dateF[0] >= frmDate && dateF[0] <= toDate)
    //   });
    //   this.ErpInv = this.ERPTableData.length;
    // }
    // } else {
    // console.log(this.totalTableData);
    //   this.totalTableData = this.filterDataTotal;
    //   this.totalInv = this.totalTableData.length;
    //   this.OCRTableData = this.filterDataOCR ;
    //   this.OcrInv = this.OCRTableData.length;
    //   this.batchTableData  = this.filterDataBatch;
    //   this.batchInv = this.batchTableData.length;
    //   this.ERPTableData = this.filterDataERP  ;
    //   this.ErpInv = this.ERPTableData.length;
    // }

  }

  clearDates() {
    this.filterByDate('');
  }
}
