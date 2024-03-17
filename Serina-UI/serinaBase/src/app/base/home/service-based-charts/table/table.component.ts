import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ServiceInvoiceService } from 'src/app/services/serviceBased/service-invoice.service';
import * as fileSaver from 'file-saver';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() tableData;
  @Input() invoiceColumns;
  @Input() columnsToFilter;
  @Input() showPaginator;
  @Input() columnLength;

  rows = 10;
  first = 0;
  dashboardViewBoolean: boolean;
  downloadBoolean: boolean;
  etisalatBoolean: boolean;
  itemMasterBoolean: boolean;
  constructor(
    private router: Router,
    private serviceProviderService: ServiceInvoiceService,
    private alertService: AlertService,
    private sharedService: SharedService,
    private messageService: MessageService,
    private ds: DataService
  ) { }

  ngOnInit(): void {
    this.findRutesForDownloadOption();
    if (this.router.url.includes('home')) {
      this.dashboardViewBoolean = true;
    } else {
      this.dashboardViewBoolean = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.ds.isDesktop) {
      this.showPaginator = false;
    }
  }

  paginateVendor(event) { }

  downloadFile(data) {
    if (this.etisalatBoolean == true) {
      this.downloadCostFile(data);
    } else if (this.itemMasterBoolean == true) {
      this.downloadItemFile(data);
    }
  }

  downloadCostFile(data) {
    this.serviceProviderService.downloadFileAllocation(data.filename).subscribe(
      (response: any) => {
        let blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8',
        });

        fileSaver.saveAs(blob, data.filename);
        this.alertService.addObject.detail = 'File is Downloaded Successfully';
        this.messageService.add(this.alertService.addObject);
      },
      (err) => {
        this.alertService.errorObject.detail = 'Server error';
        this.messageService.add(this.alertService.errorObject);
      }
    );
  }

  downloadItemFile(data) {
    console.log(data)
    this.sharedService.downloadErrFile(data.iditemmappinguploadhistory).subscribe(
      (response: any) => {
        let blob: any = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8',
        });

        fileSaver.saveAs(blob, data.error_file);
        this.alertService.addObject.detail = 'File is Downloaded Successfully';
        this.messageService.add(this.alertService.addObject);
      },
      (err) => {
        this.alertService.errorObject.detail = 'Server error';
        this.messageService.add(this.alertService.errorObject);
      }
    );
  }
  findRutesForDownloadOption() {
    if (this.router.url.includes('EtisalatCostAllocation')) {
      this.downloadBoolean = true;
      this.etisalatBoolean = true;
    } else if (this.router.url.includes('item_master')) {
      this.downloadBoolean = true;
      this.itemMasterBoolean = true;
    } else {
      this.downloadBoolean = false;
    }
  }

  routeToDocpage(v_name) {
    if (this.router.url.includes('vendorBasedReports/processReports')) {
      // this.ds.invoiceGlobe = v_name;
      let value: any = {
        "first": 0,
        "rows": 10,
        "filters": {
          "global": {
            "value": v_name,
            "matchMode": "contains"
          }
        }
      };
      
      setTimeout(() => {
        sessionStorage?.setItem('allInvoices', JSON.stringify(value));
        this.router.navigate([`${this.ds.portalName}/invoice/allInvoices`]);
      }, 1000);
    }
  }
}
