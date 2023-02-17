import { DataService } from 'src/app/services/dataStore/data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styleUrls: ['./invoice-status.component.scss'],
})
export class InvoiceStatusComponent implements OnInit {
  public counts = [];
  orderStatus;
  invoiceNumber: any;
  statusData: any;
  routeIdCapture: Subscription;
  constructor(
    private sharedService: SharedService,
    private _location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService : AlertService,
    private messageService : MessageService,
    private spin : NgxSpinnerService,
    public ds:DataService
  ) {}

  ngOnInit(): void {
    this.getHistorylogs();
    this.routeIdCapture = this.activatedRoute.params.subscribe((params) => {
      this.sharedService.invoiceID = params['id'];
    });
  }

  getHistorylogs() {
    this.spin.show();
    this.sharedService.getInvoiceLogs().subscribe(
      (data: any) => {
        this.counts = [];
        data.forEach((element) => {
          this.invoiceNumber = element.docheaderID;
          this.counts.push(element.dochistorystatus);
        });
        this.statusData = data;
        this.orderStatus = data[data.length - 1].dochistorystatus;
        this.spin.hide();
      },
      (error) => {
        this.spin.hide();
        this.router.navigate(['/customer/invoice/allInvoices']);
      }
    );
  }

  backToInvoice() {
    this._location.back();
  }

  download(){
    this.sharedService.downloadDoc().subscribe((response:any)=>{
      let blob: any = new Blob([response], { type: 'application/pdf; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      //window.location.href = response.url;
      fileSaver.saveAs(blob, `Invoice#${this.invoiceNumber}JourneyMap`);;
      this.alertService.addObject.summary="Success";
      this.alertService.addObject.detail = "Document Downloaded successfully";
      this.messageService.add(this.alertService.addObject);
    }
      ,err=>{
        this.alertService.errorObject.detail = "Server error";
        this.messageService.add(this.alertService.errorObject);
      })
  }
  downloadJSON(){
    this.sharedService.downloadJSON().subscribe((response:any)=>{
      // let blob: any = new Blob([response], { type: 'txt/JSON; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      // window.open(url);
      //window.location.href = response.url;
      fileSaver.saveAs(response, `Invoice#${this.invoiceNumber}_JSON`);
      this.alertService.addObject.summary="Success";
      this.alertService.addObject.detail = "Document Downloaded successfully";
      this.messageService.add(this.alertService.addObject);
    }
      ,err=>{
        this.alertService.errorObject.detail = "Server error";
        this.messageService.add(this.alertService.errorObject);
      })
  }
}
