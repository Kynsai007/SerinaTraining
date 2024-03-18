import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { DataService } from 'src/app/services/dataStore/data.service';
@Component({
  selector: 'app-service-based-charts',
  templateUrl: './service-based-charts.component.html',
  styleUrls: ['./service-based-charts.component.scss','../vendor-based-charts/vendor-based-charts.component.scss'],
})
export class ServiceBasedChartsComponent implements OnInit {
  invoiceBysourceChartdata: any;
  viewType = 'Process';
  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];

  constructor(private DataService: DataService,
    private dateFilterService : DateFilterService) {}

  ngOnInit(): void {
    if(!this.DataService.configData.serviceInvoices){
      history.back();
    }
  }

  choosepageTab(value) {
    this.viewType = value;
    // this.tagService.aprrovalPageTab = value;
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  filterByDate(date) {
    // if(date != ''){
      
    //   const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
    //   const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
    //   // this.filterData = [];
    //   if (this.router.url == '/customer/invoice/allInvoices') {
    //     this.invoiceDispalyData = this.filterData;
    //     this.invoiceDispalyData = this.invoiceDispalyData.filter((element) => {
    //       const dateF = new Date(element.documentDate).toISOString().split('T');
  
    //       return (dateF[0] > frmDate && dateF[0] < toDate)
    //     });
    //     this.allInvoiceLength = this.invoiceDispalyData.length;
    //   }
    // } else {
    //   this.invoiceDispalyData = this.filterData;
    //   this.allInvoiceLength = this.invoiceDispalyData.length;
    // }

  }
  clearDates(){
    this.filterByDate('')
  }
}
