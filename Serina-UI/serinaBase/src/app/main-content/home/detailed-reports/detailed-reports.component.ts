import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/dataStore/data.service';
@Component({
  selector: 'detailed-reports',
  templateUrl: './detailed-reports.component.html',
  styleUrls: ['./detailed-reports.component.scss','../process-metrics/process-metrics.component.scss']
})
export class DetailedReportsComponent implements OnInit {
  noDataSourceboolean: boolean;
  invoiceAgechartData: any;
  noDataAgeboolean: boolean;
  mostOrderItemArray: any;
  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  constructor(private chartsService : ChartsService,
    private dateFilterService: DateFilterService,
    private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService,
  private dataService: DataService) { }

  ngOnInit(): void {
    this.chartsData();
    this.getAgingReportData('');
    this.getMostOrderedData('');
    this.dateRange();

    setTimeout(()=>{
      this.setConatinerForCharts();
    },1500)
  }

  setConatinerForCharts() {
    // if (this.invoiceAmountData.length > 1) {
    //   this.noDataPAboolean = false;
    //   this.chartsService.drawColumnChart(
    //     'vendor_clm_chart',
    //     '#7E7E7E',
    //     'Invoice Pending by Amount',
    //     this.invoiceAmountData
    //   );
    // } else {
    //   this.noDataPAboolean = true;
    // }
    // if (this.invCountByvendor.length > 1) {
    //   this.noDataVndrCountboolean = false;
    //   this.chartsService.drawBarChartVendor('bar_chart', this.invCountByvendor);
    // } else {
    //   this.noDataVndrCountboolean = true;
    // }
    if (this.invoiceAgechartData.length > 1) {
      this.noDataAgeboolean = false;
      this.chartsService.drawColumnChart(
        'vendor_clm_chart1_v',
        '#8F98B1',
        'Ageing Report',
        this.invoiceAgechartData
      );
    } else {
      this.noDataAgeboolean = true;
    }
    if (this.mostOrderItemArray.length > 1) {
      this.noDataSourceboolean = false;
      this.chartsService.drawColumnChart(
        'col_chart_v',
        '#7E7E7E',
        'Most ordered items',
        this.mostOrderItemArray
      );
    } else {
      this.noDataSourceboolean = true;
    }
    // if (this.invoiceByEntityChartdata.length > 1) {
      // this.noDataSourceEntityboolean = false;
    //   this.chartsService.drawPieChart(
    //     'pie_chart_entity',
    //     'Invoice Count by Entity',
    //     this.invoiceByEntityChartdata
    //   );
    // } else {
    //   this.noDataSourceEntityboolean = true;
    // }
  }
  chartsData() {
    // this.invoiceAmountData = [
    //   ['Vendor', 'Amount'],
    //   // ['Mehtab', 8000],
    //   // ['Alpha Data', 10000],
    //   // ['First Choice', 1900],
    //   // ['Metscon', 21000],
    // ];
    this.invoiceAgechartData = [
      ['age', 'InvoiceCount'],
      // ['0-10', 80],
      // ['11-20', 10],
      // ['21-30', 19],
      // ['>31', 21],
    ];

    this.mostOrderItemArray = [
      ['Item', 'Count'],
      // ['item 1', 110],
      // ['item 2 ', 80],
      // ['item 3', 60],
      // ['item 4', 50],
      // ['item 5', 30],
    ];
    // this.invoiceByEntityChartdata = [
    //   ['Source', 'Count'],
    //   ['AGI', 110],
    //   ['AG Masonry ', 50],
    //   ['AG Nasco', 50],
    // ]
    // this.invCountByvendor = [
    //   ['Vendor', 'Invoices'],
    //   // ['Mehtab', 80],
    //   // ['Alpha Data', 10],
    //   // ['First Choice', 19],
    //   // ['Metscon', 210],
    // ];
  }

  getAgingReportData(filter){
    this.SpinnerService.show();
    this.chartsService.readAgingReportVendor(filter).subscribe((data:any)=>{
      this.invoiceAgechartData[0]=['age', 'InvoiceCount']
      for (const count in data.data) {
        this.invoiceAgechartData.push([count, parseInt(data.data[count])]);
      }
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    });
  }

  getMostOrderedData(filter){
    this.SpinnerService.show();
    this.chartsService.readMostOrderedReport(filter).subscribe((data:any)=>{
      data.data.forEach(ele=>{
        this.mostOrderItemArray[0]=['Item', 'Count'];
        this.mostOrderItemArray.push([ele.item, ele.count]);
      })
      this.SpinnerService.hide();
    }, err=>{
      this.SpinnerService.hide();
    })
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }
  filterByDate(date) {
    this.mostOrderItemArray = [];
    this.invoiceAgechartData = [];
    let date1: any = this.datePipe.transform(date[0], 'yyyy-MM-dd');
    let date2: any = this.datePipe.transform(date[1], 'yyyy-MM-dd');
    console.log(date1, date2);

    let dateFilter = '';
    if (date != '') {
      dateFilter = `?date=${date1}To${date2}`;
    }
    this.getAgingReportData(dateFilter);
    this.getMostOrderedData(dateFilter);
    this.closeDialog();
    setTimeout(() => {
      this.setConatinerForCharts();
    }, 500);
  }

  clearDates(){
    this.filterByDate('');
  }
  openFilterDialog(event){
    let top = event.clientY + 10 + "px";
    let left;
    if(this.dataService.isDesktop){
      left = "calc(55% + 100px)";
    } else {
      // left = "calc(55% + 100px)";
    }
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
