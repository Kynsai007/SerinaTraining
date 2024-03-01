import { DataService } from 'src/app/services/dataStore/data.service';
import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';
import { AlertService } from './../../services/alert/alert.service';

import { ServiceInvoiceService } from './../../services/serviceBased/service-invoice.service';
import { DateFilterService } from './../../services/date/date-filter.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-summary',
  templateUrl: './customer-summary.component.html',
  styleUrls: [
    './customer-summary.component.scss',
    '../invoice/all-invoices/all-invoices.component.scss',
  ],
})
export class CustomerSummaryComponent implements OnInit {
  @ViewChild('approve') approve: Table;
  rangeDates: Date[];
  summaryColumn = [
    { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
    { dbColumnname: 'EntityName', columnName: 'Entity Name' },
    // { dbColumnname: 'status', columnName: 'Status' },
    { dbColumnname: 'TotalPages', columnName: 'Total Pages' },
    { dbColumnname: 'TotalInvoices', columnName: 'Total Invoices' },
  ];
  summaryColumnSP = [
    { dbColumnname: 'ServiceProviderName', columnName: 'Service Provider Name' },
    { dbColumnname: 'EntityName', columnName: 'Entity Name' },
    // { dbColumnname: 'status', columnName: 'Status' },
    { dbColumnname: 'TotalPages', columnName: 'Total Pages' },
    { dbColumnname: 'TotalInvoices', columnName: 'Total Invoices' },
  ];
  minDate: Date;
  maxDate: Date;
  summaryColumnField = [];
  summaryColumnHeader = [];
  customerSummary: any;
  showPaginatorSummary: boolean;
  totalSuccessPages: any;
  totalInvoices: any;

  summaryColumnFieldSP = [];
  summaryColumnHeaderSP = [];
  customerSummarySP: any;
  showPaginatorSummarySP: boolean;
  totalSuccessPagesSP: any;
  totalInvoicesSP: any;

  rowsPerPage = 10;
  ColumnLengthVendor: number;
  ColumnLengthSP: number;
  entity: any;
  selectedEntityValue = 'ALL';
  selectedDateValue: string;
  vendorInvoiceAccess: boolean;
  serviceInvoiceAccess: boolean;
  partyType:string;
  searchText:string;
  search_placeholder = 'Ex : By Vendor. By Entity, Select Date range from the Calendar icon';
  tabName = 'vendor';

  constructor(
    private dateFilterService: DateFilterService,
    private ServiceInvoiceService: ServiceInvoiceService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private SpinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private ImportExcelService: ImportExcelService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    if(this.dataService.ap_boolean){
      this.partyType = 'Vendor'
    } else {
      this.partyType = 'Customer'
    }
    this.dateRange();
    this.readSummary('');
    this.findColumns();
    this.getEntitySummary();
    this.vendorInvoiceAccess = this.dataService.configData.vendorInvoices;
    this.serviceInvoiceAccess = this.dataService.configData.serviceInvoices;
  }

  // display columns
  findColumns() {
    this.summaryColumn.forEach((e) => {
      if(!this.dataService.ap_boolean && e.columnName == 'Vendor Name'){
        e.columnName = 'Customer Name'
      }
      this.summaryColumnHeader.push(e.columnName);
      this.summaryColumnField.push(e.dbColumnname);
    });
    this.summaryColumnSP.forEach((e) => {
      this.summaryColumnHeaderSP.push(e.columnName);
      this.summaryColumnFieldSP.push(e.dbColumnname);
    });

    this.ColumnLengthVendor = this.summaryColumn.length;
    this.ColumnLengthSP = this.summaryColumnSP.length;
  }

  // Set date range
  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  // API to get summary page data
  readSummary(val) {
    this.SpinnerService.show();
    this.ServiceInvoiceService.getCutomerSummary(val).subscribe(
      (data: any) => {
        this.customerSummary = data.vendor_data.data;
        this.totalSuccessPages = data.vendor_data.summary.TotalPages;
        this.totalInvoices = data.vendor_data.summary.TotalInvoices;

        this.customerSummarySP = data.supplier_data.data;
        this.totalSuccessPagesSP = data.supplier_data.summary.TotalPages;
        this.totalInvoicesSP = data.supplier_data.summary.TotalInvoices;
        if (this.customerSummary) {
          if (this.customerSummary.length > 10) {
            this.showPaginatorSummary = true;
          }
        }
        if (this.customerSummarySP) {
          if (this.customerSummarySP.length > 10) {
            this.showPaginatorSummarySP = true;
          }
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.alertService.errorObject.detail = "Server error";
        this.messageService.add(this.alertService.errorObject);
        this.SpinnerService.hide();
      }
    );
  }

  // to filter the summary data
  filterData(date) {
    this.selectedDateValue = '';
    let query = '';
    let date1: any;
    let date2: any
    if (date != '' && date != undefined) {
      date1 = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      date2 = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      this.selectedDateValue = date;
      this.search_placeholder = `From "${date1}" to "${date2}"`;
    }
    if (
      this.selectedEntityValue != 'ALL' &&
      this.selectedDateValue == ''
    ) {
      query = `?entity=${this.selectedEntityValue}`;
    } else if (
      this.selectedEntityValue == 'ALL' &&
      this.selectedDateValue != ''
    ) {
      query = `?ftdate=${date1}&endate=${date2}`;
    } else if (
      this.selectedEntityValue != 'ALL' &&
      this.selectedDateValue != ''
    ) {
      query = `?ftdate=${date1}&endate=${date2}&entity=${this.selectedEntityValue}`;
    }
    // if (this.rangeDates) {
    //   const fromDate = this.datePipe.transform(
    //     this.rangeDates[0],
    //     'yyyy-MM-dd'
    //   );
    //   const endDate = this.datePipe.transform(this.rangeDates[1], 'yyyy-MM-dd');

    //   const format = `?ftdate=${fromDate}&endate=${endDate}`;
    // }
    this.readSummary(query);

  }

  // clearing the dates
  clearDates() {
    this.filterData('');
    this.search_placeholder = 'Ex : By Vendor. By Entity, Select Date range from the Calendar icon';
  }

  getEntitySummary() {
    this.ServiceInvoiceService.getSummaryEntity().subscribe((data: any) => {
      this.entity = data.result;
    });
  }
  selectEntityFilter(e) {
    this.selectedEntityValue = e;
  }

  downloadReport(){
    let combine = this.customerSummary.concat(this.customerSummarySP);
    this.ImportExcelService.exportExcel(combine);
  }
  onTabChange(tabName){
    this.tabName = tabName
  }
}
