import { DataService } from './../../../services/dataStore/data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DateFilterService } from 'src/app/services/date/date-filter.service';

@Component({
  selector: 'app-business-charts',
  templateUrl: './business-charts.component.html',
  styleUrls: ['./business-charts.component.scss'],
})
export class BusinessChartsComponent implements OnInit {
  viewType;
  vendorsData: any;
  serviceData: any;
  minDate: Date;
  maxDate: Date;
  rangeDates: Date[];
  vendorInvoicesAccess: boolean;
  serviceInvoicesAccess: boolean;
  partyType:string;
  constructor(
    private DataService: DataService,
    private router: Router,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.vendorInvoicesAccess = this.DataService.configData?.vendorInvoices;
    this.serviceInvoicesAccess = this.DataService.configData?.serviceInvoices;
    if(this.DataService.ap_boolean){
      this.partyType = 'Vendor';
    } else {
      this.partyType = 'Customer';
    }
    if(this.vendorInvoicesAccess){
      this.viewType = 'vendor';
      this.router.navigate(['/customer/home/vendorBasedReports']);
    } else {
      this.viewType = 'service';
      this.router.navigate(['/customer/home/serviceBasedReports']);
    }
    this.dateRange();
    setTimeout(() => {
      if (this.router.url.includes('vendorBasedReports')) {
        this.viewType = 'vendor';
      } else {
        this.viewType = 'service';
      }
    }, 100);
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  choosepageTab(value) {
    this.viewType = value;
    if (value == 'vendor') {
      this.router.navigate(['/customer/home/vendorBasedReports']);
    } else {
      this.router.navigate(['/customer/home/serviceBasedReports']);
    }
  }


}
