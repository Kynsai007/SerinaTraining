import { DataService } from './../../../services/dataStore/data.service';
import { ImportExcelService } from './../../../services/importExcel/import-excel.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { SharedService } from 'src/app/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { DateFilterService } from 'src/app/services/date/date-filter.service';

@Component({
  selector: 'app-vendor-based-charts',
  templateUrl: './vendor-based-charts.component.html',
  styleUrls: ['./vendor-based-charts.component.scss'],
})
export class VendorBasedChartsComponent implements OnInit {
  vendorsData: any;
  viewType ;
  exceptionData: any;

  exceptionTableData = [];
  columnsForException = [];
  exceptionColumnHeader = [];
  exceptionColumnField = [];
  ColumnLengthException: any;
  showPaginatorException: boolean;

  onboardTableData = [];
  columnsForonboard = [];
  onboardColumnHeader = [];
  onboardColumnField = [];
  ColumnLengthonboard: any;
  showPaginatoronboard: boolean;

  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  filterDataTotal: any[];

  selectedMonth = 'Current Month'
  months: string[];
  selectDate: Date;
  displayYear;
  lastYear: number;

  constructor(
    private chartsService: ChartsService,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private dataStoreService : DataService,
    private ImportExcelService: ImportExcelService,
    private router : Router,
    private datePipe : DatePipe,
    private dateFilterService: DateFilterService,
  ) {}

  ngOnInit(): void {
    if(this.dataStoreService.configData?.vendorInvoices){
      this.viewType = this.chartsService.vendorTabs;
      // this.readExceptionData();
      this.prepareColumns();
      this.readEmailExceptionData('');
      this.readOnboardedData('');
      this.dateRange();
      if (this.router.url == '/customer/home/vendorBasedReports/processReports') {
        this.viewType = 'Process';
      } else if(this.router.url == '/customer/home/vendorBasedReports/exceptionReports'){
        this.viewType = 'Exception';
      } else if(this.router.url == '/customer/home/vendorBasedReports/emailExceptionReports'){
        this.viewType = 'emailException';
      }else {
        this.viewType = 'onboarded';
        this.getDate();
      }
    } else {
      history.back();
    }

  }

  choosepageTab(value) {
    this.viewType = value;
    this.chartsService.vendorTabs = value;
    if (value == 'Process') {
      this.router.navigate(['/customer/home/vendorBasedReports/processReports']);
    } else if(value == 'Exception') {
      this.router.navigate(['/customer/home/vendorBasedReports/exceptionReports']);
    } else if(value == 'emailException') {
      this.router.navigate(['/customer/home/vendorBasedReports/emailExceptionReports']);
    } else if(value == 'onboarded') {
      this.router.navigate(['/customer/home/vendorBasedReports/onboardedReports']);
    }
  }

  prepareColumns() {
    this.columnsForException = [
      { field: 'Filename', header: 'File Name' },
      { field: 'EmailSender', header: 'Sender' },
      { field: 'Exception', header: 'Exception Type' },
      // { field: 'EntityName', header: 'Entity' },
      { field: 'UploadedDate', header: 'Upload Date' },
    ];

    this.columnsForonboard = [
      { field: 'VendorName', header: 'Vendor Name' },
      { field: 'EntityName', header: 'Entity' },
      { field: 'CreatedOn', header: 'Onboarded Date' },
      { field: 'UpdatedOn', header: 'Last updated' },
    ];

    this.columnsForException.forEach((e) => {
      this.exceptionColumnHeader.push(e.header);
      this.exceptionColumnField.push(e.field);
    });

    this.columnsForonboard.forEach((e) => {
      this.onboardColumnHeader.push(e.header);
      this.onboardColumnField.push(e.field);
    });

    this.ColumnLengthException = this.columnsForException.length;
    this.ColumnLengthonboard = this.columnsForonboard.length;
  }

  // readExceptionData() {
  //   this.SpinnerService.show();
  //   this.chartsService.getvendorExceptionSummary().subscribe((data) => {
  //     console.log(data);
  //     this.exceptionData = data;
  //     this.SpinnerService.hide();
  //   },(err)=>{
  //     this.SpinnerService.hide();
  //   });
  // }

  readEmailExceptionData(filter){
    this.chartsService.getEmailExceptionSummary(filter).subscribe((data:any)=>{
      this.exceptionTableData = data.data;
      this.filterDataTotal = this.exceptionTableData;
      if(this.exceptionTableData.length >10){
        this.showPaginatorException = true;
      }
    })
  }

  readOnboardedData(filter){
    this.chartsService.getOnbordedData(filter).subscribe((data:any)=>{
      this.onboardTableData = data.data;
      if(this.onboardTableData.length >10){
        this.showPaginatoronboard = true;
      }
    })
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  filterByDate(date) {
    // if(date != ''){
    //   let frmDate:any = this.datePipe.transform(date[0], "yyyy-MM-dd");
    //   let toDate:any = this.datePipe.transform(date[1], "yyyy-MM-dd");
    //   this.exceptionTableData = this.filterDataTotal;
    //   this.exceptionTableData = this.exceptionTableData.filter((element) => {
    //     const dateF = new Date(element.UploadedDate).toISOString().split('T');
    //     console.log(dateF[0],frmDate,toDate)
    //     return (dateF[0] >= frmDate && dateF[0] <= toDate)
    //   });
    //   if(this.exceptionTableData.length >10){
    //     this.showPaginatorException = true;
    //   }
    //  } else {
    //   this.exceptionTableData = this.filterDataTotal;
    //  }

    let dateFilter = '';
    if(date != ""){
      let frmDate:any = this.datePipe.transform(date[0], "yyyy-MM-dd");
      let toDate:any = this.datePipe.transform(date[1], "yyyy-MM-dd");
      dateFilter = `?date=${frmDate}To${toDate}`;
    }
    if(this.viewType == 'emailException'){
      this.readEmailExceptionData(dateFilter);
    } else if (this.viewType == 'onboarded'){
      // this.readOnboardedData(dateFilter);
    }
  }
  clearDates(){
    this.filterByDate('')
  }
  getDate() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let today = new Date();
    let month = today.getMonth();
    this.selectedMonth = this.months[month];
    let year = today.getFullYear();
    this.lastYear = year - 5;
    this.displayYear = `${this.lastYear}:${year}`;
    let prevYear = year - 5;

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(prevYear);

    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear(year);
  }
  applyMonthfilter(month){
    let monthIndex = month.getMonth()+1;
    let dateFilter = `?month=${monthIndex}`;
    this.readOnboardedData(dateFilter);

  }

  downloadReport(){
    if(this.viewType == 'onboarded') {
      this.ImportExcelService.exportExcel(this.onboardTableData);
    }
  }
}
