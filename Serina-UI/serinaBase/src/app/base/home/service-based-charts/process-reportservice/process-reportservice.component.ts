import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/dataStore/data.service';
import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { ServiceInvoiceService } from 'src/app/services/serviceBased/service-invoice.service';
import { SharedService } from 'src/app/services/shared.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';

@Component({
  selector: 'app-process-reportservice',
  templateUrl: './process-reportservice.component.html',
  styleUrls: ['./process-reportservice.component.scss','./../../vendor-based-charts/process-reports/process-reports.component.scss'],
})
export class ProcessReportserviceComponent implements OnInit {
  serviceData: any;
  invoiceBysourceChartdata: any;
  totalProcessedvalueChart: any;
  pendingInvoiceChartData: any;
  stackedChartData = [];
  entity: any;
  entitySubscription : Subscription;

  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];

  noDataPendingboolean: boolean;
  noDataOverallboolean: boolean;
  noDataProcessboolean: boolean;
  noDataCountboolean: boolean;
  totolDownloadCount: number;
  totalProcessCount: number;
  totalPendingCount: number;
  system_check : number;

  selectedEntityValue = 'ALL';
  selectedDateValue = '';
  selectedServiceValue = 'ALL';
  datequery: string;
  invoiceByEntityChartdata = [];
  noDataSourceEntityboolean: boolean;
  pagesByEntityChartdata:any;
  noDataSourcePagesEntityboolean: boolean;

  totalTableData = [];
  columnsForTotal = [];
  totalColumnHeader = [];
  totalColumnField = [];
  ColumnLengthtotal: any;
  showPaginatortotal: boolean;

  constructor(
    private sharedService: SharedService,
    private chartsService: ChartsService,
    private dataStoreService: DataService,
    private dateFilterService: DateFilterService,
    private SpinnerService: NgxSpinnerService,
    private datePipe : DatePipe,
    private ImportExcelService : ImportExcelService
  ) {}

  ngOnInit(): void {
    this.readService();
    this.chartsData();
    this.dateRange();
    this.getEntitySummary();
    this.readInvCountByEntity(this.datequery)
    this.readProcessVsDownloadData(this.datequery);
    this.readProcessAmtData(this.datequery);
    this.readPendingAmountData(this.datequery);
    this.readOverallChartData(this.datequery);
    this.prepareColumns();
    setTimeout(() => {
      this.setContainers();
    }, 2000);
  }

  setContainers(){
    if(this.totalProcessedvalueChart.length > 1){
      this.noDataProcessboolean = false;
      this.chartsService.drawColumnChart(
        'column_chart',
        '#A3B8C5',
        'Total Processed Value',
        this.totalProcessedvalueChart
      );
    } else {
      this.noDataProcessboolean = true;
    }

    if(this.stackedChartData.length>1){
      this.noDataCountboolean = false;
      this.chartsService.drawStackedChart('stack_chart',this.stackedChartData);
    } else {
      this.noDataCountboolean = true;
    }

    if(this.pendingInvoiceChartData.length>1){
      this.noDataPendingboolean = false;
      this.chartsService.drawColumnChart_dual(
        'column_chart1',
        '#DCCAA6',
        'Pending Invoices by Amount',
        this.pendingInvoiceChartData
      );
    } else {
      this.noDataPendingboolean = true;
    }

    // this.chartsService.drawColumnChart('column_chart');
    // this.chartsService.drawColumnChartPending('column_chart1');
    if(this.invoiceBysourceChartdata.length>1){
      this.noDataOverallboolean = false;
      this.chartsService.drawPieChart(
        'pie_chart',
        'Overall Invoice Processed vs Downloaded',
        this.invoiceBysourceChartdata
      );
    } else {
      this.noDataOverallboolean = true;
    }

    // if (this.invoiceByEntityChartdata.length > 1) {
    //   this.noDataSourceEntityboolean = false;
    //     this.chartsService.drawColumnChart(
    //       'column_chart_entity',
    //       '#CEE5D0',
    //       'Invoice Count by Entity',
    //       this.invoiceByEntityChartdata
    //     );
    //   } else {
    //     this.noDataSourceEntityboolean = true;
    //   }
  
      if (this.pagesByEntityChartdata.length > 1) {
        this.noDataSourcePagesEntityboolean = false;
          this.chartsService.drawColumnChart(
            'column_chart_entity_pages',
            '#ECB390',
            'Invoice page Count by Entity',
            this.pagesByEntityChartdata
          );
        } else {
          this.noDataSourcePagesEntityboolean = true;
        }

  }
  prepareColumns(){
    this.columnsForTotal = [
      { field: 'EntityName', header: 'Entity' },
      { field: 'count', header:'Invoice Count'},
      { field: 'pagecount', header:'Pages Count'}
    ];

    this.columnsForTotal.forEach((e) => {
      this.totalColumnHeader.push(e.header);
      this.totalColumnField.push(e.field);
    });

    this.ColumnLengthtotal = this.columnsForTotal.length;
  }
  readService() {
    this.sharedService.readserviceprovider().subscribe((data: any) => {
      let mergerdArray = [];
      data.forEach(element => {
        let spData = {...element.Entity,...element.ServiceProvider};
        mergerdArray.push(spData);
      });
      const uniqueArray = mergerdArray.filter((v,i,a)=>{
        return a.findIndex(t=>(t.ServiceProviderName===v.ServiceProviderName))===i ;
      });
      this.serviceData = uniqueArray;
    });
  }

  chartsData() {
    this.invoiceBysourceChartdata = [
      ['Type', 'count']
    ];
    this.totalProcessedvalueChart = [
      ['Service Provider', 'Amount',{type: 'string', role: 'annotation'}],

    ];
    this.pendingInvoiceChartData = [
      ['Service Provider', 'Pending Invoices']
    ];
    this.stackedChartData = [
      ['Service Provider', 'Processed',{type: 'string', role: 'annotation'}, 'Downloaded',{type: 'string', role: 'annotation'}],
    ]
    this.pagesByEntityChartdata = [
      ['Entity', 'Count']
    ]
  }
  readInvCountByEntity(filter) {
    this.SpinnerService.show();
    this.chartsService.getInvoiceCountByEntity(filter).subscribe(
      (data: any) => {
        this.invoiceByEntityChartdata = data.data?.ServiceBased;
        this.SpinnerService.hide();
      },
      (err) => {
        this.SpinnerService.hide();
      }
    );
  }
  // readPageCountByEntity(filter) {
  //   this.SpinnerService.show();
  //   this.chartsService.getPagesCountByEntity(filter).subscribe(
  //     (data: any) => {
  //       data.data?.ServiceBased.forEach((element) => {
  //         this.pagesByEntityChartdata[0] = ['Entity', 'Count'];
  //         this.pagesByEntityChartdata.push([element.EntityName, element.count]);
  //       });
  //       this.SpinnerService.hide();
  //     },
  //     (err) => {
  //       this.SpinnerService.hide();
  //     }
  //   );
  // }
  readProcessVsDownloadData(filter){
    this.SpinnerService.show();
    this.chartsService.getProcessVsTotalSP(filter).subscribe((data:any)=>{
      data?.data?.processed.forEach((ele)=>{
        if(ele.ServiceProviderName == 'Emirates Integrated Telecommunication Co'){
          ele.ServiceProviderName = 'DU'
        }
        this.stackedChartData.push([ele.ServiceProviderName, ele.count,ele.count]);
      })
      data.data.downloaded.forEach((ele1)=>{
        this.stackedChartData.forEach((val,index)=>{
          if(ele1.ServiceProviderName == 'Emirates Integrated Telecommunication Co'){
            ele1.ServiceProviderName = 'DU'
          }
          if(ele1.ServiceProviderName == val[0]){
            this.stackedChartData[index].splice(3,0,ele1.count,ele1.count);
          }
        });
      })
      this.SpinnerService.hide();
    },err=>{
      this.SpinnerService.hide();
    })
  }

  readProcessAmtData(filter){
    this.SpinnerService.show();
    this.chartsService.getProcessByAmountSP(filter).subscribe((data:any)=>{
      data.data.forEach(ele=>{
        if(ele.ServiceProviderName == 'Emirates Integrated Telecommunication Co'){
        ele.ServiceProviderName = 'DU'
      }
      let amount = this.convertToKM(ele.amount)
        this.totalProcessedvalueChart.push([ele.ServiceProviderName,ele.amount,amount])
      });
      this.SpinnerService.hide();
    },err=>{
      this.SpinnerService.hide();
    })
  }

  readPendingAmountData(filter){
    this.SpinnerService.show();
    this.chartsService.getPendingInvByAmountSP(filter).subscribe((data:any)=>{
      data.data.forEach(ele=>{
        if(ele.ServiceProviderName == 'Emirates Integrated Telecommunication Co'){
          ele.ServiceProviderName = 'DU'
        }
        let amount = this.convertToKM(ele.amount)
        this.pendingInvoiceChartData.push([ele.ServiceProviderName,ele.amount])
      });
      this.SpinnerService.hide();
    },err=>{
      this.SpinnerService.hide();
    })
  }

  readOverallChartData(filter){
    this.SpinnerService.show();
    this.chartsService.getProcessVsTotal_OverallSP(filter).subscribe((data:any)=>{
      this.invoiceBysourceChartdata[1] = [`Processed - ${data.data.processed}`,data.data.processed];
      // this.invoiceBysourceChartdata[2] = ['Downloaded',data.data.downloaded];
      this.invoiceBysourceChartdata[2] = [`Exceptions - ${data.data.exceptions}`,data.data.exceptions];
      this.invoiceBysourceChartdata[3] = [`System check - ${data.data.systemcheck}`,data.data.systemcheck];
      this.invoiceBysourceChartdata[4] = [`Downloaded - ${data.data.downloaded}`,data.data.downloaded]
      this.totolDownloadCount = data.data.downloaded;
      this.totalProcessCount = data.data.processed;
      this.totalPendingCount = data.data.exceptions;
      this.system_check = data.data.systemcheck;
      this.SpinnerService.hide();
    },err=>{
      this.SpinnerService.hide();
    })
  }
  getEntitySummary() {
    this.entitySubscription = this.dataStoreService.entityData.subscribe((data: any) => {
      this.entity = data;
    });
  }

  selectEntityFilter(e) {
    this.selectedEntityValue = e;
  }

  selectedService(e){
    this.selectedServiceValue = e ;
  }
  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
    let date = this.datePipe.transform(this.maxDate, 'yyyy-MM-dd');
    let monthArr = date.split('-')
    let month = monthArr[1];
    let year = monthArr[0];
    let day = monthArr[2];
    let date1 = `${year}-${month}-01`
    let date2 = `${year}-${month}-${day}`
    let date3 = this.dateFilterService.satrtDate;
    this.datequery = `?date=${date1}To${date2}`;
    this.rangeDates = [date3,this.maxDate];
  }

  filterByDate(date) {
    this.selectedDateValue = '';
    let query = '';
    let date1: any;
    let date2: any
    if (date != '' && date != undefined) {
      date1 = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      date2 = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      this.selectedDateValue = date
    }
    if (
      this.selectedServiceValue != 'ALL' &&
      this.selectedEntityValue == 'ALL' &&
      this.selectedDateValue == ''
    ) {
      let encodeString = encodeURIComponent(this.selectedServiceValue);
      query = `?serviceprovider=${encodeString}`;
    } else if (
      this.selectedServiceValue == 'ALL' &&
      this.selectedEntityValue != 'ALL' &&
      this.selectedDateValue == ''
    ) {
      query = `?entity=${this.selectedEntityValue}`;
    } else if (
      this.selectedServiceValue == 'ALL' &&
      this.selectedEntityValue == 'ALL' &&
      this.selectedDateValue != ''
    ) {
      query = `?date=${date1}To${date2}`;
    } else if (
      this.selectedServiceValue != 'ALL' &&
      this.selectedEntityValue != 'ALL' &&
      this.selectedDateValue == ''
    ) {
      let encodeString = encodeURIComponent(this.selectedServiceValue);
      query = `?serviceprovider=${encodeString}&entity=${this.selectedEntityValue}`;
    } else if (
      this.selectedServiceValue != 'ALL' &&
      this.selectedEntityValue == 'ALL' &&
      this.selectedDateValue != ''
    ) {
      let encodeString = encodeURIComponent(this.selectedServiceValue);
      query = `?serviceprovider=${encodeString}&date=${date1}To${date2}`;
    } else if (
      this.selectedServiceValue != 'ALL' &&
      this.selectedEntityValue != 'ALL' &&
      this.selectedDateValue != ''
    ) {
      let encodeString = encodeURIComponent(this.selectedServiceValue);
      query = `?serviceprovider=${encodeString}&entity=${this.selectedEntityValue}&date=${date1}To${date2}`;
    } else if (
      this.selectedServiceValue == 'ALL' &&
      this.selectedEntityValue != 'ALL' &&
      this.selectedDateValue != ''
    ) {
      query = `?entity=${this.selectedEntityValue}&date=${date1}To${date2}`;
    }

    this.chartsData();
    this.readProcessVsDownloadData(query);
    this.readInvCountByEntity(query);
    // this.readPageCountByEntity(query);
    this.readProcessAmtData(query);
    this.readPendingAmountData(query);
    this.readOverallChartData(query);
    setTimeout(() => {
      this.setContainers();
    },2000);

  }
  clearDates(){
    this.selectedDateValue = '';
  }
  convertToKM(value: number): string {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return (value / 1000000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "M";
    } else if (absValue >= 1000) {
      return (value / 1000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "k";
    } else {
      return value.toLocaleString();
    }
  }
  downloadReport(){
    this.ImportExcelService.exportExcel(this.invoiceByEntityChartdata);
}
}
