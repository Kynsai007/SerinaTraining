import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { ServiceInvoiceService } from 'src/app/services/serviceBased/service-invoice.service';

@Component({
  selector: 'app-service-summary',
  templateUrl: './service-summary.component.html',
  styleUrls: ['./service-summary.component.scss','../../vendor-based-charts/process-reports/process-reports.component.scss']
})
export class ServiceSummaryComponent implements OnInit {

  summaryData: any;
  showPaginator: boolean;
  selectDate: Date;
  stringDate = '';
  spTemplateData: any;
  selectedEntity;
  pendingCount: Array<{}> = [];
  stringdate1: string;
  displayEntityName = 'ALL';
  displayEntityNameDummy: any;
  displayYear;
  minDate: Date;
  maxDate: Date;
  lastYear: number;
  entity = [
    'ADDC', 'GICC', 'FEWA'
  ];
  selectedSp ="Filter ServiceProvider"
  serviceProviderNames: any;
  selectedMonth = 'Current Month'
  months: string[];
  cardsArr = [
    { title: 'Total Success' , count:0, image:'total_success' },
    { title: 'Total failed' , count:0, image:'total_fail' },
    { title: 'Total active accounts' , count:0, image:'total_active' },
    { title: 'Total Pending' , count:0, image:'total_pending' },
    { title: 'Total Invoice downloads' , count:0, image:'total_download' }
  ]
  cardCount: number;
  isTableView: boolean;
  maxSize = 7;
  pageNumber: number = 1;

  constructor(private serviceProviderService : ServiceInvoiceService,
    private SpinnerService: NgxSpinnerService,
    private alertService : AlertService,
    private datePipe : DatePipe,
    private ds: DataService) {
    this.ds.isTableView.subscribe(bool=> {
      this.isTableView = bool;
      this.ngOnInit();
    });
     }

  ngOnInit(): void {
    this.calculateCardCountPerPage();
    this.getDate();
    this.getSummary(this.stringDate);
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
  applyDatefilter() {
    const format = 'yyyy-MM';
    const locale = 'en-US';
    try {
      const month = this.selectDate.getMonth();
      this.selectedMonth = this.months[month];
      // this.stringdate1 = formatDate(this.selectDate.toLocaleDateString(), format, locale);
      this.stringdate1 = this.datePipe.transform(this.selectDate, format);
      this.stringDate = '?ftdate=' + this.stringdate1;
      this.getSummary(this.stringDate);
    } catch (error) {
      this.stringDate = '';
      this.stringdate1 = '';
      this.getSummary(this.stringDate);
    }
    this.displayEntityName = this.displayEntityNameDummy;
    if (this.selectedEntity == '') {
          this.displayEntityName = 'ALL';
          this.selectedEntity = 'ALL';
        }
    this.selectedEntity = 'ALL';
    this.closeDialog();
  }

  getSummary(stringDate: any) {
    this.SpinnerService.show();
    this.serviceProviderService.getSummaryData(stringDate).subscribe((data: any) => {
      this.summaryData = data.result.drill_down_data;
      this.cardsArr[0].count = data.result.total_processed;
      this.cardsArr[1].count = data.result.total_failed;
      this.cardsArr[4].count = data.result.total_downloaded;
      this.cardsArr[3].count = data.result.total_pending;
      this.cardsArr[2].count = data.result.active_accounts;
      if (this.summaryData.length > 10) {
        this.showPaginator = true;
      }
      if (this.summaryData) {
        this.serviceProviderService.entityIdSummary = '';
        this.serviceProviderService.serviceIdSummary = '';
        this.displayEntityNameDummy = '';
      }
      this.SpinnerService.hide();
    },error=>{
      this.alertService.error_alert("Server error")
      this.SpinnerService.hide();
    });

  }
  openFilterDialog(event){
    let top = event.clientY + 10 + "px";
    let left;
    if(this.ds.isDesktop){
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
  calculateCardCountPerPage() {
    let cardWidth: number = 300;
    let cardHeight: number = 200;

    // Get the viewport dimensions
    const screenWidth: number = window.innerWidth;
    const screenHeight: number = window.innerHeight;

    // Calculate card count per row
    const cardsPerRow = Math.floor(screenWidth / cardWidth);

    // Calculate card count per column
    const cardsPerColumn = Math.floor(screenHeight / cardHeight);

    // Calculate total card count per page
    this.cardCount = cardsPerRow * cardsPerColumn;
  }
  onPageChange(number: number) {
    this.pageNumber = number;
  }
}
