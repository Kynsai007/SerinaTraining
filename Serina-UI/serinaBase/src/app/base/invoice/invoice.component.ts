import { DataService } from 'src/app/services/dataStore/data.service';
import { AlertService } from './../../services/alert/alert.service';
import { ImportExcelService } from './../../services/importExcel/import-excel.service';
import { DateFilterService } from './../../services/date/date-filter.service';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';

import { MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { MatSidenav } from '@angular/material/sidenav';

export interface UserData {
  invoiceId: number;
  poNumber: number;
  VenderId: string;
  Vendername: string;
  entity: string;
  uploaded: string;
  modified: string;
  status: string;
  amount: string;
  date: string;
}

export interface updateColumn {
  idtabColumn: number;
  ColumnPos: number;
  isActive: boolean;
}

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
  // encapsulation: ViewEncapsulation.Emulated
})
export class InvoiceComponent implements OnInit {
  displayInvoicePage: boolean = true;
  activeMenuName: string = 'invoice';
  users: UserData[];
  showPaginator: boolean;
  invoiceDispalyData = [];
  allInvoiceLength: number;
  showPaginatorAllInvoice: boolean;
  createInvoice: boolean;
  allSearchInvoiceString = [];
  visibleSidebar2: boolean;
  cols: any;
  invoiceColumns: any;
  poColumns: any;
  soColumns: any;
  archivedColumns: any;
  allColumns: any;
  columnstodisplayInvoice = [];
  columnstodisplayPO = [];
  columnstodisplaySO: any[];
  columnstodisplayArchived = [];

  updateColumns: updateColumn[] = [];
  poDispalyData: any[];
  poArrayLength: number;
  soDisplayData: any[];
  soArrayLength: number;
  GRNDispalyData: any[];
  GRNArrayLength: number;
  receiptDispalyData: any[];
  receiptArrayLength: number = 0;
  archivedDisplayData: any[] = [];
  archivedArrayLength: number;
  showPaginatorArchived: boolean;
  archivedLength: number;
  rejectedDisplayData: any[] = [];
  // rejectedArrayLength: number;
  showPaginatorRejected: boolean;
  rejectedLength: number;
  showPaginatorPOTable: boolean;
  showPaginatorSOTable: boolean;
  showPaginatorGRNTable: boolean;
  userDetails: any;
  usertypeBoolean: boolean;

  rangeDates: Date[];
  routeName: string;
  lastYear: number;
  displayYear: string;
  minDate: Date;
  maxDate: Date;
  columnstodisplayService = [];
  serviceColumns: any;
  showPaginatorServiceInvoice: boolean;
  serviceinvoiceDispalyData: any[];
  serviceInvoiceLength: any;
  allInColumnLength: any;
  allPOColumnLength: any;
  allSOColumnLength: any;
  allARCColumnLength: any;
  allSRVColumnLength: any;
  filterData: any[];
  filterDataService: any[];
  totalInvoicesData: any[];
  filterDataArchived: any;

  @ViewChild('sidenav') sidenav: MatSidenav;
  events: string[] = [];
  opened: boolean;
  portal_name: string;
  invoiceTab: any;
  POTab: any;
  SOTab: any;
  GRNTab: any;
  archivedTab: any;
  rejectedTab: any;
  serviceInvoiceTab: any;
  first: any;
  searchStr: string;

  // searchPOStr = '';
  // searchGRNStr = '';
  // searchArcStr = '';
  // searchRejStr = '';
  GRNExceptionTab: any;
  GRNExcpLength: number;
  GRNCreateBool: boolean;
  vendorInvoiceAccess: boolean;
  serviceInvoiceAccess: boolean;
  invoceDoctype = false;
  partyType: string;
  isDesktop: boolean;
  tableImportData: any;
  close(reason: string) {
    this.sidenav.close();
  }
  APIParams: string;
  // offsetCountPO :number;
  // pageCountVariablePO :number;
  // offsetCountGRN :number;
  // pageCountVariableGRN :number;
  // offsetCountArc :number;
  // pageCountVariableArc :number;
  // offsetCountRej:number;
  // pageCountVariableRej:number;

  GRNExcpDispalyData = [];
  GRNExcpColumns = [];
  showPaginatorGRNExcp: boolean;
  columnstodisplayGRNExcp = [];
  GRNExcpColumnLength: number;

  rejectedColumns: any = [];
  columnstodisplayrejected: any = [];
  rejectedColumnLength: number;

  GRNColumns: any = [];
  columnstodisplayGRN: any = [];
  GRNColumnLength: number;

  constructor(
    public route: Router,
    private AlertService: AlertService,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private dataService: DataService,
    private ImportExcelService: ImportExcelService,
    private dateFilterService: DateFilterService,
    private datePipe: DatePipe,
    private location : Location,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.authService.currentUserValue;
    this.GRNCreateBool = this.dataService.configData?.enableGRN;
    this.vendorInvoiceAccess = this.dataService?.configData?.vendorInvoices;
    this.serviceInvoiceAccess = this.dataService?.configData?.serviceInvoices;
    this.isDesktop = this.dataService.isDesktop;
    if (this.userDetails.user_type == 'customer_portal') {
      this.usertypeBoolean = true;
      this.portal_name = 'customer';
      if (!this.vendorInvoiceAccess) {
        if(this.dataService.doc_status_tab == undefined){
          this.route.navigate([`/${this.portal_name}/invoice/ServiceInvoices`])
        } else {
          this.route.navigate([`${this.dataService.doc_status_tab}`]);
        }
      }
    } else if (this.userDetails.user_type == 'vendor_portal') {
      this.usertypeBoolean = false;
      this.portal_name = 'vendorPortal';

    }
    if (this.vendorInvoiceAccess) {
      if (this.dataService.ap_boolean) {
        this.partyType = 'Vendor';
        this.invoceDoctype = true;
        if(!this.dataService.doc_status_tab){
          this.route.navigate([`/${this.portal_name}/invoice/allInvoices`]);
        } else {
          this.route.navigate([`${this.dataService.doc_status_tab}`]);
        }
        if(this.GRNCreateBool){
          this.readGRNExceptionData();
        }
        
      } else {
        if(!this.dataService.doc_status_tab){
          this.route.navigate([`/${this.portal_name}/invoice/PO`]);
        } else {
          this.route.navigate([`${this.dataService.doc_status_tab}`]);
        }
        this.partyType = 'Customer';
        
      }
    }
    if(this.serviceInvoiceAccess){
      // this.getServiceColumns();
      this.getDisplayServiceInvoicedata();
    }
    this.APIParams = `?offset=1&limit=50`;
    this.deviceColumns();
    this.routeForTabs();
    this.dateRange();
    this.findActiveRoute();
    this.restoreData();
    // this.getInvoiceData();
    // this.getDisplayPOData();
    // this.getDisplayGRNdata();
    // this.getDisplayReceiptdata();

  }

  deviceColumns() {
    if(this.dataService.isDesktop) {
      this.getPOColums();
      this.getArchivedColumns();
      this.prepareColumns();
      this.getInvoiceColumns();
      if(this.serviceInvoiceAccess){
        this.getServiceColumns();
      }
    } else {
      this.mob_columns();
      this.prepareColumnsArray_mobile();
    }
  }

  restoreData() {
    this.totalInvoicesData = this.dataService.invoiceLoadedData;
    // this.filterData = this.invoiceDispalyData;
    // this.allInvoiceLength = this.dataService.invoiceLoadedData.length;
    // if (this.allInvoiceLength > 10) {
    //   this.showPaginatorAllInvoice = true;
    // }
    this.filterForArchived();
    this.poDispalyData = this.dataService.poLoadedData;
    this.poArrayLength = this.dataService.POtableLength;
    if (this.poDispalyData.length > 10 && this.isDesktop) {
      this.showPaginatorPOTable = true;
    }
    this.soDisplayData = this.dataService.SODisplayData;
    this.soArrayLength = this.dataService.soArrayLength;
    if (this.soDisplayData.length > 10 && this.isDesktop) {
      this.showPaginatorSOTable = true;
    }
    this.GRNDispalyData = this.dataService.GRNLoadedData;
    this.GRNArrayLength = this.dataService.GRNTableLength;
    if (this.GRNDispalyData.length > 10 && this.isDesktop) {
      this.showPaginatorGRNTable = true;
    }
    this.archivedDisplayData = this.dataService.archivedDisplayData;
    this.archivedLength = this.dataService.ARCTableLength;
    if (this.archivedDisplayData.length > 10 && this.isDesktop) {
      this.showPaginatorArchived = true;
    }
    this.rejectedDisplayData = this.dataService.rejectedDisplayData;
    this.rejectedLength = this.dataService.rejectTableLength;
    if (this.rejectedDisplayData.length > 10 && this.isDesktop) {
      this.showPaginatorRejected = true;
    }
    this.receiptDispalyData = this.dataService.receiptLoadedData;
    this.receiptArrayLength = this.dataService.receiptLoadedData.length;
    this.visibleSidebar2 = this.sharedService.sidebarBoolean;
    if (this.dataService.invoiceLoadedData.length == 0 && this.invoceDoctype) {
      this.getInvoiceData();
    }
    if (this.dataService.poLoadedData.length == 0) {
      this.getDisplayPOData(this.APIParams);
    }
    if (this.dataService.GRNLoadedData.length == 0 && this.invoceDoctype) {
      this.getDisplayGRNdata(this.APIParams);
    }
    if (this.dataService.archivedDisplayData.length == 0) {
      this.getDisplayARCData(this.APIParams);
    }
    if (this.dataService.rejectedDisplayData.length == 0) {
      this.getDisplayRejectedData(this.APIParams);
    }
    if (this.dataService.SODisplayData.length == 0) {
      this.getDisplaySOData(this.APIParams);
    }
    if (this.dataService.receiptLoadedData.length == 0) {
      // this.getDisplayReceiptdata();
    }
  }

  routeForTabs() {
    this.invoiceTab = `/${this.portal_name}/invoice/allInvoices`;
    this.POTab = `/${this.portal_name}/invoice/PO`;
    this.SOTab = `/${this.portal_name}/invoice/SO`;
    this.GRNTab = `/${this.portal_name}/invoice/GRN`;
    this.archivedTab = `/${this.portal_name}/invoice/archived`;
    this.rejectedTab = `/${this.portal_name}/invoice/rejected`;
    this.GRNExceptionTab = `/${this.portal_name}/invoice/GRNExceptions`;
    this.serviceInvoiceTab = `/${this.portal_name}/invoice/ServiceInvoices`;
  }

  prepareColumns() {
    this.GRNExcpColumns = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      { dbColumnname: 'GRNNumber', columnName: 'GRN Number' },
      { dbColumnname: 'EntityName', columnName: 'Entity' },
      { dbColumnname: 'RejectDescription', columnName: 'Description' },
      { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
      // { dbColumnname: 'documentPaymentStatus', columnName: 'Status' },
    ];
    this.rejectedColumns = [
      // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      { dbColumnname: 'EntityName', columnName: 'Entity' },
      { dbColumnname: 'documentdescription', columnName: 'Description' },
      { dbColumnname: 'CreatedOn', columnName: 'Uploaded Date' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
      // { dbColumnname: 'documentPaymentStatus', columnName: 'Status' },
    ];

    this.GRNColumns = [
      { dbColumnname: 'EntityName', columnName: 'Entity Name' },
      { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      { dbColumnname: 'docheaderID', columnName: 'GRN Number' },
      { dbColumnname: 'InvoiceNumber', columnName: 'Invoice Number' },
      { dbColumnname: 'CreatedOn', columnName: 'Received Date' },
      { dbColumnname: 'firstName', columnName: 'Created By' },
      { dbColumnname: 'grn_type', columnName: 'Source' }
    ];

    if (this.portal_name == 'customer') {
      if(!this.partyType) {
        this.partyType = 'Service'
      }
      this.rejectedColumns.unshift({
        dbColumnname: 'VendorName',
        columnName: `${this.partyType} Name`,
      });
    }
    this.GRNExcpColumns.forEach((val) => {
      this.columnstodisplayGRNExcp.push(val.dbColumnname);
    });

    this.rejectedColumns.forEach((e) => {
      if(!this.dataService.ap_boolean && e.columnName == 'Invoice Number'){
        e.columnName = 'Document Number'
      }
      this.columnstodisplayrejected.push(e.dbColumnname);
    });

    this.GRNColumns.forEach((e) => {
      this.columnstodisplayGRN.push(e.dbColumnname);
    });

    this.GRNExcpColumnLength = this.GRNExcpColumns.length + 1;
    this.rejectedColumnLength = this.rejectedColumns.length + 1;
    this.GRNColumnLength = this.GRNColumns.length + 1;

  }
  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  findActiveRoute() {
    if (this.route.url == this.invoiceTab) {
      this.routeName = 'allInvoices';
    } else if (this.route.url == this.POTab) {
      this.routeName = 'PO';
      this.searchStr = this.dataService.searchPOStr;
    } else if (this.route.url == this.SOTab) {
      this.routeName = 'SO';
      this.searchStr = this.dataService.searchSOStr;
    }else if (this.route.url == this.archivedTab) {
      this.routeName = 'archived';
      this.searchStr = this.dataService.searchArcStr;
    } else if (this.route.url == this.rejectedTab) {
      this.routeName = 'rejected';
      this.searchStr = this.dataService.searchRejStr;
    } else if( this.route.url == this.GRNTab){
      this.routeName = 'GRN';
      this.searchStr = this.dataService.searchGRNStr;
    }
  }
  getInvoiceData() {
    this.SpinnerService.show();
    this.sharedService.getAllInvoice().subscribe(
      (data: any) => {
        const invoicePushedArray = [];
        if (data) {
          data.ok.Documentdata.forEach((element) => {
            let invoiceData = {
              ...element.Document,
              ...element.Entity,
              ...element.DocumentSubStatus,
              ...element.EntityBody,
              ...element.ServiceProvider,
              ...element.ServiceAccount,
              ...element.VendorAccount,
              ...element.Vendor,
            };
            // invoiceData.append('docStatus',element.docStatus)

            invoiceData['docstatus'] = element.docstatus;
            if (this.portal_name == 'vendorPortal') {
              if (invoiceData['docstatus'] == 'Need To Review') {
                invoiceData['docstatus'] = 'Under Review';
              } else if(invoiceData['docstatus'] == 'Set Approval'){
                invoiceData['docstatus'] = 'Approval Pending';
              }
            }
            invoicePushedArray.push(invoiceData);
          });
          this.totalInvoicesData = invoicePushedArray;
          this.filterForArchived();
          this.dataService.invoiceLoadedData = invoicePushedArray;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.AlertService.errorObject.detail = error.statusText;
        this.messageService.add(this.AlertService.errorObject);
        this.SpinnerService.hide();
      }
    );
  }

  filterForArchived() {
    const archived = [];
    const allInvoices = [];
    const rejected = [];
    this.totalInvoicesData.forEach((ele) => {
      allInvoices.push(ele);
    });
    setTimeout(() => {
      // this.archivedDisplayData = archived;
      this.filterDataArchived = this.archivedDisplayData;
      // this.archivedLength = this.archivedDisplayData.length;
      // if (this.archivedDisplayData.length > 10) {
      //   this.showPaginatorArchived = true;
      // }
      this.invoiceDispalyData = allInvoices;
      // this.rejectedDisplayData = rejected;
      // this.rejectedLength = this.rejectedDisplayData.length;
      // if (this.rejectedDisplayData.length > 10) {
      //   this.showPaginatorRejected = true;
      // }

      this.filterData = this.invoiceDispalyData;
      this.allInvoiceLength = this.invoiceDispalyData.length;
      if (this.invoiceDispalyData.length > 10 && this.isDesktop) {
        this.showPaginatorAllInvoice = true;
      }
    }, 500);
  }

  getDisplayPOData(data) {
    this.SpinnerService.show();
    this.sharedService.getPOData(data).subscribe(
      (data: any) => {
        const poPushedArray = [];
        if (data.ok) {
          data.ok.podata.forEach((element) => {
            let poData = {
              ...element.Document,
              ...element.Entity,
              ...element.EntityBody,
              ...element.ServiceProvider,
              ...element.ServiceAccount,
              ...element.VendorAccount,
              ...element.Vendor,
            };
            poData.docstatus = element.docstatus;
            poPushedArray.push(poData);
          });
        }
        this.poDispalyData =
          this.dataService.poLoadedData.concat(poPushedArray);
        this.dataService.poLoadedData = this.poDispalyData;
        this.poArrayLength = data.ok.total_po;
        this.dataService.POtableLength = data.ok.total_po;
        if (this.poDispalyData.length > 10 && this.isDesktop) {
          this.showPaginatorPOTable = true;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.AlertService.errorObject.detail = error.statusText;
        this.messageService.add(this.AlertService.errorObject);
        this.SpinnerService.hide();
      }
    );
  }

  getDisplayGRNdata(data) {
    this.SpinnerService.show();
    this.sharedService.getGRNdata(data).subscribe((data: any) => {
      let grnD = []
      data.grndata?.forEach(ele=>{
        let merg = {...ele.Document}
        merg.EntityName = ele.EntityName;
        merg.VendorName = ele.VendorName;
        merg.grn_type = ele.grn_type;
        merg.firstName = ele.firstName;
        merg.InvoiceNumber = ele.InvoiceNumber;
        grnD.push(merg)
      })
     
      this.GRNDispalyData = this.dataService.GRNLoadedData.concat(grnD);
      this.dataService.GRNLoadedData = this.GRNDispalyData;
      this.dataService.GRNTableLength = data.grn_total;
      this.GRNArrayLength = data.grn_total;
      if (this.GRNDispalyData.length > 10 && this.isDesktop) {
        this.showPaginatorGRNTable = true;
      }
      this.SpinnerService.hide();
    });
  }

  getDisplayARCData(data) {
    this.SpinnerService.show();
    this.sharedService.getARCdata(data).subscribe((data: any) => {
      const invoicePushedArray = [];
      data?.result?.ven?.ok?.Documentdata?.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.VendorAccount,
          ...element.Vendor,
          ...element.PaymentsInfo
        };
        
        // invoiceData.append('docStatus',element.docStatus)

        invoiceData['docstatus'] = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });

      data?.result?.ser?.ok?.Documentdata?.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.ServiceProvider,
          ...element.ServiceAccount,
          ...element.PaymentsInfo
        };
        invoiceData['docstatus'] = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });
      

      this.archivedDisplayData =
        this.dataService.archivedDisplayData.concat(invoicePushedArray);
      this.dataService.archivedDisplayData = this.archivedDisplayData;
      this.archivedDisplayData.forEach((ele1) => {
        for (let name in ele1) {
          if (name == 'ServiceProviderName') {
            ele1['VendorName'] = ele1['ServiceProviderName'];
          }
        }
      });
      if(this.dataService.posted_inv_type != 'ser'){
        this.dataService.ARCTableLength = data?.result?.ven?.ok?.total_arc;
        this.archivedLength = data?.result?.ven?.ok?.total_arc;
      } else {
        this.dataService.ARCTableLength = data?.result?.ser?.ok?.total_arc;
        this.archivedLength = data?.result?.ser?.ok?.total_arc;
      }
      if (this.archivedLength > 10 && this.isDesktop) {
        this.showPaginatorArchived = true;
      }
      this.SpinnerService.hide();
    });
  }

  getDisplayRejectedData(data) {
    this.SpinnerService.show();
    this.sharedService.getRejecteddata(data).subscribe((data: any) => {
      const invoicePushedArray = [];
      data?.result?.ven?.ok?.Documentdata?.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.DocumentHistoryLogs,
          ...element.VendorAccount,
          ...element.Vendor,
        };
        invoiceData['docstatus'] = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });

      data?.result?.ser?.ok?.Documentdata?.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.ServiceProvider,
          ...element.ServiceAccount
        };

        // invoiceData.append('docStatus',element.docStatus)

        invoiceData['docstatus'] = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });
      this.rejectedDisplayData.forEach((ele1) => {
        for (let name in ele1) {
          if (name == 'ServiceProviderName') {
            ele1['VendorName'] = ele1['ServiceProviderName'];
          }
        }
      });
      this.rejectedDisplayData =
        this.dataService.rejectedDisplayData.concat(invoicePushedArray);
      this.dataService.rejectedDisplayData = this.rejectedDisplayData;
      this.dataService.rejectTableLength = data?.result?.ven?.ok?.total_rejected;
      this.rejectedLength = data?.result?.ven?.ok?.total_rejected;
      if (this.rejectedDisplayData.length > 10 && this.isDesktop) {
        this.showPaginatorRejected = true;
      }
      this.SpinnerService.hide();
    });
  }

  getDisplaySOData(data) {
    this.SpinnerService.show();
    this.sharedService.getSOdata(data).subscribe((data: any) => {
      const invoicePushedArray = [];
      data?.ok?.podata?.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.VendorAccount,
          ...element.Vendor,
        };
        invoiceData['docstatus'] = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });
      
      this.soDisplayData =
        this.dataService.SODisplayData.concat(invoicePushedArray);
      this.dataService.SODisplayData = this.soDisplayData;
      this.dataService.soArrayLength = data?.ok?.total_po;
      this.soArrayLength = data?.ok?.total_po;
      if (this.soDisplayData.length > 10 && this.isDesktop) {
        this.showPaginatorSOTable = true;
      }
      this.SpinnerService.hide();
    });
  }

  readGRNExceptionData() {
    this.sharedService.getGRNExceptionData('').subscribe((data: any) => {
      const invoicePushedArray = [];
      data?.result?.ok?.Documentdata?.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.VendorAccount,
          ...element.Vendor,
          ...element.GrnReupload
        };
        invoiceData['docstatus'] = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });
      this.GRNExcpDispalyData =
        this.dataService.GRNExcpDispalyData.concat(invoicePushedArray);
      this.dataService.GRNExcpTableLength = this.GRNExcpDispalyData.length;
      this.GRNExcpLength = this.GRNExcpDispalyData.length;
      if (this.GRNExcpDispalyData.length > 10 && this.isDesktop) {
        this.showPaginatorGRNExcp = true;
      }
    })
  }

  getDisplayServiceInvoicedata() {
    this.SpinnerService.show();
    this.sharedService.getServiceInvoices().subscribe(
      (data: any) => {
        const invoicePushedArray = [];
        if (data) {
          data.ok.Documentdata.forEach((element) => {
            let invoiceData = {
              ...element.Document,
              ...element.Entity,
              ...element.EntityBody,
              ...element.ServiceProvider,
              ...element.ServiceAccount,
              ...element.DocumentSubStatus
            };
            // invoiceData.append('docStatus',element.docStatus)
            invoiceData['docstatus'] = element.docstatus;
            invoicePushedArray.push(invoiceData);
          });
          const allInvoicesService = [];
          invoicePushedArray.forEach((ele) => {
            if (ele.documentStatusID == 14) {
              this.archivedDisplayData.push(ele);
            } else {
              allInvoicesService.push(ele);
            }
          });
          // this.archivedDisplayData.forEach((ele1) => {
          //   for (let name in ele1) {
          //     if (name == 'ServiceProviderName') {
          //       ele1['VendorName'] = ele1['ServiceProviderName'];
          //     }
          //   }
          // });
          // this.filterForArchived();
          setTimeout(() => {
            this.serviceinvoiceDispalyData = allInvoicesService;
            this.filterDataService = this.serviceinvoiceDispalyData;
            this.dataService.serviceinvoiceLoadedData = allInvoicesService;
            this.serviceInvoiceLength = this.serviceinvoiceDispalyData.length;
            if (this.serviceinvoiceDispalyData.length > 10 && this.isDesktop) {
              this.showPaginatorServiceInvoice = true;
            }
            // this.filterDataArchived = this.archivedDisplayData;
            // this.archivedLength = this.archivedDisplayData.length;
            // if (this.archivedDisplayData.length > 10) {
            //   this.showPaginatorArchived = true;
            // }
          }, 500);
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.AlertService.errorObject.detail = error.statusText;
        this.messageService.add(this.AlertService.errorObject);
        this.SpinnerService.hide();
      }
    );
  }

  getColumnsData() { }

  getInvoiceColumns() {
    this.SpinnerService.show();
    this.updateColumns = [];
    this.sharedService.readColumnInvoice('INV').subscribe(
      (data: any) => {
        const pushedInvoiceColumnsArray = [];
        data.col_data.forEach((element) => {
          let arrayColumn = {
            ...element.DocumentColumnPos,
            ...element.ColumnPosDef,
          };
          pushedInvoiceColumnsArray.push(arrayColumn);
        });
        this.invoiceColumns = pushedInvoiceColumnsArray.filter((ele) => {
          return ele.isActive == 1;
        });
        const arrayOfColumnId = [];
        this.invoiceColumns.forEach((e) => {
          arrayOfColumnId.push(e.dbColumnname);
        });
        this.columnstodisplayInvoice = arrayOfColumnId;
        this.invoiceColumns = this.invoiceColumns.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.allInColumnLength = this.invoiceColumns.length + 1;
        this.allColumns = pushedInvoiceColumnsArray.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.allColumns.forEach((val) => {
          let activeBoolean;
          if (val.isActive == 1) {
            activeBoolean = true;
          } else {
            activeBoolean = false;
          }
          this.updateColumns.push({
            idtabColumn: val.idDocumentColumn,
            ColumnPos: val.documentColumnPos,
            isActive: activeBoolean,
          });
        });

        this.SpinnerService.hide();
        // this.invoiceColumns= pushedInvoiceColumnsArray;
      },
      (error) => {
        this.AlertService.errorObject.detail = error.statusText;
        this.messageService.add(this.AlertService.errorObject);
        this.SpinnerService.hide();
      }
    );
  }

  getPOColums() {
    this.updateColumns = [];
    this.sharedService.readColumnInvoice('PO').subscribe(
      (data: any) => {
        const pushedPOColumnsArray = [];
        data.col_data.forEach((element) => {
          let arrayColumn = {
            ...element.ColumnPosDef,
            ...element.DocumentColumnPos,
          };
          pushedPOColumnsArray.push(arrayColumn);
        });
        this.poColumns = pushedPOColumnsArray.filter((element) => {
          if(element.columnName == 'Vendor Name' && !this.dataService.ap_boolean){
            element.columnName = 'Customer Name'
          }
          return element.isActive == 1;
        });
        const arrayOfColumnIdPO = [];
        this.poColumns.forEach((e) => {
          arrayOfColumnIdPO.push(e.dbColumnname);
        });
        this.columnstodisplayPO = arrayOfColumnIdPO;
        this.poColumns = this.poColumns.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.allPOColumnLength = this.poColumns.length + 1;
        this.allColumns = pushedPOColumnsArray.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.allColumns.forEach((val) => {
          let activeBoolean;
          if (val.isActive == 1) {
            activeBoolean = true;
          } else {
            activeBoolean = false;
          }
          this.updateColumns.push({
            idtabColumn: val.idDocumentColumn,
            ColumnPos: val.documentColumnPos,
            isActive: activeBoolean,
          });
        });
      },
      (error) => {
        alert(error?.error?.detail[0]?.msg);
      }
    );
  }

  getArchivedColumns() {
    this.updateColumns = [];
    this.sharedService.readColumnInvoice('ARC').subscribe(
      (data: any) => {
        const pushedArchivedColumnsArray = [];
        data.col_data.forEach((element) => {
          let arrayColumn = {
            ...element.DocumentColumnPos,
            ...element.ColumnPosDef,
          };
          pushedArchivedColumnsArray.push(arrayColumn);
        });
        this.archivedColumns = pushedArchivedColumnsArray.filter((element) => {
          if(element.columnName == 'Vendor Name' && !this.dataService.ap_boolean){
            element.columnName = 'Customer Name'
          } 
          if(!this.dataService.ap_boolean && element.columnName == 'Invoice Number'){
            element.columnName = 'Document Number'
          }
          return element.isActive == 1;
        });
        const arrayOfColumnIdArchived = [];
        this.archivedColumns.forEach((e) => {
          arrayOfColumnIdArchived.push(e.dbColumnname);
        });
        this.columnstodisplayArchived = arrayOfColumnIdArchived;
        this.allColumns = pushedArchivedColumnsArray.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.archivedColumns = this.archivedColumns.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.allARCColumnLength = this.archivedColumns.length + 1;
        // this.allColumns = pushedPOColumnsArray
        this.allColumns.forEach((val) => {
          let activeBoolean;
          if (val.isActive == 1) {
            activeBoolean = true;
          } else {
            activeBoolean = false;
          }
          this.updateColumns.push({
            idtabColumn: val.idDocumentColumn,
            ColumnPos: val.documentColumnPos,
            isActive: activeBoolean,
          });
        });
      },
      (error) => {
        alert(error.statusText);
      }
    );
  }

  getServiceColumns() {
    this.SpinnerService.show();
    this.updateColumns = [];
    this.sharedService.readColumnInvoice('INVS').subscribe(
      (data: any) => {
        const pushedArchivedColumnsArray = [];
        data.col_data.forEach((element) => {
          let arrayColumn = {
            ...element.DocumentColumnPos,
            ...element.ColumnPosDef,
          };
          pushedArchivedColumnsArray.push(arrayColumn);
        });
        this.serviceColumns = pushedArchivedColumnsArray.filter((element) => {
          return element.isActive == 1;
        });
        const arrayOfColumnIdArchived = [];
        this.serviceColumns.forEach((e) => {
          arrayOfColumnIdArchived.push(e.dbColumnname);
        });
        this.columnstodisplayService = arrayOfColumnIdArchived;
        this.allColumns = pushedArchivedColumnsArray.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.serviceColumns = this.serviceColumns.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.allSRVColumnLength = this.serviceColumns.length + 1;
        // this.allColumns = pushedPOColumnsArray
        this.allColumns.forEach((val) => {
          let activeBoolean;
          if (val.isActive == 1) {
            activeBoolean = true;
          } else {
            activeBoolean = false;
          }
          this.updateColumns.push({
            idtabColumn: val.idDocumentColumn,
            ColumnPos: val.documentColumnPos,
            isActive: activeBoolean,
          });
          this.SpinnerService.hide();
        });
      },
      (error) => {
        this.AlertService.errorObject.detail = error.statusText;
        this.messageService.add(this.AlertService.errorObject);
        this.SpinnerService.hide();
      }
    );
  }

  menuChange(value) {
    this.updateColumns = [];
   
    this.activeMenuName = value;
    // this.getInvoiceData();
    this.dataService.allPaginationFirst = 0;
    this.dataService.allPaginationRowLength = 10;
    if (value == 'invoice') {
      this.route.navigate([this.invoiceTab]);
      this.dataService.doc_status_tab = this.invoiceTab;
      this.allSearchInvoiceString = [];
      // this.getInvoiceColumns();
    } else if (value == 'po') {
      // this.getPOColums();
      this.route.navigate([this.POTab]);
      this.dataService.doc_status_tab = this.POTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.dataService.searchPOStr;
    } else if (value == 'so') {
      // this.getPOColums();
      this.route.navigate([this.SOTab]);
      this.dataService.doc_status_tab = this.SOTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.dataService.searchSOStr;
    }else if (value == 'grn') {
      this.route.navigate([this.GRNTab]);
      this.dataService.doc_status_tab = this.GRNTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.dataService.searchGRNStr;
    } else if (value == 'ServiceInvoices') {
      this.route.navigate([this.serviceInvoiceTab]);
      this.dataService.doc_status_tab = this.serviceInvoiceTab;
      this.allSearchInvoiceString = [];
    } else if (value == 'archived') {
      this.route.navigate([this.archivedTab]);
      this.dataService.doc_status_tab = this.archivedTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.dataService.searchArcStr;
    } else if (value == 'rejected') {
      this.route.navigate([this.rejectedTab]);
      this.dataService.doc_status_tab = this.rejectedTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.dataService.searchRejStr;
    } else if (value == 'GRNException') {
      this.route.navigate([this.GRNExceptionTab]);
      this.dataService.doc_status_tab = this.GRNExceptionTab;
      this.allSearchInvoiceString = [];
    }
  }
  searchInvoiceDataV(value) {
    this.allSearchInvoiceString = [];
    this.allSearchInvoiceString = value.filteredValue;
  }
  showSidebar(value) {
    // this.visibleSidebar2 = value;
    this.sidenav.toggle();
    if (this.route.url == this.invoiceTab) {
      this.getInvoiceColumns();
    } else if (this.route.url == this.POTab) {
      this.getPOColums();
    } else if (this.route.url == this.archivedTab) {
      this.getArchivedColumns();
    } else if (this.route.url == this.rejectedTab) {
      this.getArchivedColumns();
    } else if (this.route.url == this.GRNExceptionTab) {
      this.getArchivedColumns();
    } else if (this.route.url == this.serviceInvoiceTab) {
      this.getServiceColumns();
    }
  }

  exportExcel() {
    let exportData = [];
    if(!this.tableImportData){
    if (this.route.url == this.invoiceTab) {
      exportData = this.invoiceDispalyData;
    } else if (this.route.url == this.POTab) {
      exportData = this.poDispalyData;
    } else if (this.route.url == this.GRNTab) {
      exportData = this.GRNDispalyData;
    } else if (this.route.url == this.archivedTab) {
      exportData = this.archivedDisplayData;
    } else if (this.route.url == this.rejectedTab) {
      exportData = this.rejectedDisplayData;
    } else if (this.route.url == this.GRNExceptionTab) {
      exportData = this.rejectedDisplayData;
    } else if (this.route.url == this.serviceInvoiceTab) {
      exportData = this.serviceinvoiceDispalyData;
    }
  } else {
    exportData = this.tableImportData;
  }
    if (this.allSearchInvoiceString && this.allSearchInvoiceString.length > 0) {
      this.ImportExcelService.exportExcel(this.allSearchInvoiceString);
    } else if (exportData && exportData.length > 0) {
      this.ImportExcelService.exportExcel(exportData);
    } else {
      alert('No Data to import');
    }
  }
  onOptionDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.allColumns, event.previousIndex, event.currentIndex);
    // if (this.route.url == '/customer/invoice/allInvoices') {
    this.allColumns.forEach((e, index) => {
      this.updateColumns.forEach((val) => {
        if (val.idtabColumn === e.idDocumentColumn) {
          val.ColumnPos = index + 1;
        }
      });
    });
  }
  order(v) { }
  activeColumn(e, value) {
    // if (this.route.url == '/customer/invoice/allInvoices') {
    this.updateColumns.forEach((val) => {
      if (val.idtabColumn == value.idDocumentColumn) {
        val.isActive = e.target.checked;
      }
    });
  }

  updateColumnPosition() {
    if (this.route.url == this.invoiceTab) {
      this.sharedService.updateColumnPOs(this.updateColumns, 'INV').subscribe(
        (data: any) => {
          this.getInvoiceColumns();
          this.AlertService.updateObject.detail =
            'Columns updated successfully';
          this.messageService.add(this.AlertService.updateObject);
        },
        (error) => {
          this.AlertService.errorObject.detail = error.statusText;
          this.messageService.add(this.AlertService.errorObject);
        }
      );
    } else if (this.route.url == this.POTab) {
      this.sharedService.updateColumnPOs(this.updateColumns, 'PO').subscribe(
        (data: any) => {
          this.getPOColums();
          this.AlertService.updateObject.detail =
            'Columns updated successfully';
          this.messageService.add(this.AlertService.updateObject);
        },
        (error) => {
          this.AlertService.errorObject.detail = error.statusText;
          this.messageService.add(this.AlertService.errorObject);
        }
      );
    } else if (
      this.route.url == this.archivedTab ||
      this.route.url == this.rejectedTab
    ) {
      this.sharedService.updateColumnPOs(this.updateColumns, 'ARC').subscribe(
        (data: any) => {
          this.getArchivedColumns();
          this.AlertService.updateObject.detail =
            'Columns updated successfully';
          this.messageService.add(this.AlertService.updateObject);
        },
        (error) => {
          this.AlertService.errorObject.detail = error.statusText;
          this.messageService.add(this.AlertService.errorObject);
        }
      );
    } else if (this.route.url == this.serviceInvoiceTab) {
      this.sharedService.updateColumnPOs(this.updateColumns, 'INVS').subscribe(
        (data: any) => {
          this.getServiceColumns();
          this.AlertService.updateObject.detail =
            'Columns updated successfully';
          this.messageService.add(this.AlertService.updateObject);
        },
        (error) => {
          this.AlertService.errorObject.detail = error.statusText;
          this.messageService.add(this.AlertService.errorObject);
        }
      );
    }
    this.sidenav.close();
  }

  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      // this.filterData = [];
      if (this.route.url == this.invoiceTab) {
        this.invoiceDispalyData = this.filterData;
        this.invoiceDispalyData = this.invoiceDispalyData.filter((element) => {
          const dateF = new Date(element.documentDate).toISOString().split('T');

          return dateF[0] >= frmDate && dateF[0] <= toDate;
        });
        this.allInvoiceLength = this.invoiceDispalyData.length;
      } else if (this.route.url == this.serviceInvoiceTab) {
        this.serviceinvoiceDispalyData = this.filterDataService;
        this.serviceinvoiceDispalyData = this.serviceinvoiceDispalyData.filter(
          (element) => {
            const dateF = new Date(element.documentDate)
              .toISOString()
              .split('T');

            return dateF[0] >= frmDate && dateF[0] <= toDate;
          }
        );
        this.serviceInvoiceLength = this.serviceinvoiceDispalyData.length;
      } else if (this.route.url == this.archivedTab) {
        this.archivedDisplayData = this.filterDataArchived;
        this.archivedDisplayData = this.archivedDisplayData.filter(
          (element) => {
            const dateF = new Date(element.documentDate)
              .toISOString()
              .split('T');

            return dateF[0] >= frmDate && dateF[0] <= toDate;
          }
        );
        this.archivedLength = this.archivedDisplayData.length;
      }
    } else {
      this.invoiceDispalyData = this.filterData;
      this.allInvoiceLength = this.invoiceDispalyData.length;
    }
  }
  clearDates() {
    this.filterByDate('');
  }

  paginate(event) {
    this.first = event.first;
    if (this.route.url == this.invoiceTab) {
      this.dataService.allPaginationFirst = this.first;
      this.dataService.allPaginationRowLength = event.rows;
    } else if (this.route.url == this.POTab) {
      this.dataService.poPaginationFisrt = this.first;
      this.dataService.poPaginationRowLength = event.rows;
      if (this.first >= this.dataService.pageCountVariablePO) {
        this.dataService.pageCountVariablePO = event.first;
        if (this.dataService.searchPOStr == '') {
          this.dataService.offsetCountPO++;
          this.APIParams = `?offset=${this.dataService.offsetCountPO}&limit=50`;
          this.getDisplayPOData(this.APIParams);
        } else {
          this.dataService.offsetCountPO++;
          this.APIParams = `?offset=${this.dataService.offsetCountPO}&limit=50&uni_search=${this.dataService.searchPOStr}`;
          this.getDisplayPOData(this.APIParams);
        }
      }
    } else if (this.route.url == this.GRNTab) {
      this.dataService.GRNPaginationFisrt = this.first;
      this.dataService.GRNPaginationRowLength = event.rows;
      if (this.first >= this.dataService.pageCountVariableGRN) {
        this.dataService.pageCountVariableGRN = event.first;
        if (this.dataService.searchGRNStr == '') {
          this.dataService.offsetCountGRN++;
          this.APIParams = `?offset=${this.dataService.offsetCountGRN}&limit=50`;
          this.getDisplayGRNdata(this.APIParams);
        } else {
          this.dataService.offsetCountGRN++;
          this.APIParams = `?offset=${this.dataService.offsetCountGRN}&limit=50&uni_search=${this.dataService.searchGRNStr}`;
          this.getDisplayGRNdata(this.APIParams);
        }
      }
    } else if (this.route.url == this.archivedTab) {
      this.dataService.archivedPaginationFisrt = this.first;
      this.dataService.archivedPaginationRowLength = event.rows;
      if (this.first >= this.dataService.pageCountVariableArc) {
        this.dataService.pageCountVariableArc = event.first;
        if (this.dataService.searchArcStr == '' && this.dataService.posted_inv_type == '') {
          this.dataService.offsetCountArc++;
          this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50`;
          this.getDisplayARCData(this.APIParams);
        } else if (this.dataService.searchArcStr == '' && this.dataService.posted_inv_type != '') {
          this.dataService.offsetCountArc++;
          this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50&inv_type=${this.dataService.posted_inv_type}`;
          this.getDisplayARCData(this.APIParams);
        } else if (this.dataService.searchArcStr != '' && this.dataService.posted_inv_type != '') {
          this.dataService.offsetCountArc++;
          this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50&uni_search=${this.dataService.searchArcStr}&inv_type=${this.dataService.posted_inv_type}`;
          this.getDisplayARCData(this.APIParams);
        }else {
          this.dataService.offsetCountArc++;
          this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50&uni_search=${this.dataService.searchArcStr}`;
          this.getDisplayARCData(this.APIParams);
        }
      }
    } else if (this.route.url == this.rejectedTab) {
      this.dataService.rejectedPaginationFisrt = this.first;
      this.dataService.rejectedPaginationRowLength = event.rows;
      if (this.first >= this.dataService.pageCountVariableRej) {
        this.dataService.pageCountVariableRej = event.first;
        if (this.dataService.searchRejStr == '') {
          this.dataService.offsetCountRej++;
          this.APIParams = `?offset=${this.dataService.offsetCountRej}&limit=50`;
          this.getDisplayRejectedData(this.APIParams);
        } else {
          this.dataService.offsetCountRej++;
          this.APIParams = `?offset=${this.dataService.offsetCountRej}&limit=50&uni_search=${this.dataService.searchRejStr}`;
          this.getDisplayRejectedData(this.APIParams);
        }
      }
    } else if (this.route.url == this.SOTab) {
      this.dataService.SOPaginationFisrt = this.first;
      this.dataService.SOPaginationRowLength = event.rows;
      if (this.first >= this.dataService.pageCountVariableSO) {
        this.dataService.pageCountVariableSO = event.first;
        if (this.dataService.searchSOStr == '') {
          this.dataService.offsetCountSO++;
          this.APIParams = `?offset=${this.dataService.offsetCountSO}&limit=50`;
          this.getDisplaySOData(this.APIParams);
        } else {
          this.dataService.offsetCountSO++;
          this.APIParams = `?offset=${this.dataService.offsetCountSO}&limit=50&uni_search=${this.dataService.searchSOStr}`;
          this.getDisplaySOData(this.APIParams);
        }
      }
    }else if (this.route.url == this.GRNExceptionTab) {
      this.dataService.GRNExceptionPaginationFisrt = this.first;
      this.dataService.GRNExceptionPaginationRowLength = event.rows;
    } else if (this.route.url == this.serviceInvoiceTab) {
      this.dataService.servicePaginationFisrt = this.first;
      this.dataService.servicePaginationRowLength = event.rows;
    }
  }

  keySearch(str) {
    if (str == '') {
      this.APIParams = `?offset=1&limit=50`
      if (this.route.url == this.invoiceTab) {
      } else if (this.route.url == this.POTab) {
        this.dataService.poLoadedData = [];
        this.getDisplayPOData(this.APIParams);
      } else if (this.route.url == this.GRNTab) {
        this.dataService.GRNLoadedData = [];
        this.getDisplayGRNdata(this.APIParams);
      } else if (this.route.url == this.archivedTab) {
        this.dataService.archivedDisplayData = [];
        this.getDisplayARCData(this.APIParams);
      } else if (this.route.url == this.rejectedTab) {
        this.dataService.rejectedDisplayData = [];
        this.getDisplayRejectedData(this.APIParams);
      } else if (this.route.url == this.SOTab) {
        this.dataService.SODisplayData = [];
        this.getDisplaySOData(this.APIParams);
      }  else if (this.route.url == this.serviceInvoiceTab) {
      }
    }
  }

  filterString(event) {
    if (this.route.url == this.invoiceTab) {
      // this.dataService.allPaginationFirst = 0;
    } else if (this.route.url == this.POTab) {
      this.dataService.poPaginationFisrt = 0;
      this.dataService.offsetCountPO = 1;
      this.dataService.poLoadedData = [];
      this.dataService.searchPOStr = event;
      if (this.dataService.searchPOStr == '') {
        this.APIParams = `?offset=${this.dataService.offsetCountPO}&limit=50`;
        this.getDisplayPOData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.dataService.offsetCountPO}&limit=50&uni_search=${this.dataService.searchPOStr}`;
        this.getDisplayPOData(this.APIParams);
      }
      // this.dataService.poPaginationFisrt = 1;
    } else if (this.route.url == this.GRNTab) {
      this.dataService.GRNPaginationFisrt = 0;
      this.dataService.offsetCountGRN = 1;
      this.dataService.GRNLoadedData = [];
      this.dataService.searchGRNStr = event;
      if (this.dataService.searchGRNStr == '') {
        this.APIParams = `?offset=${this.dataService.offsetCountGRN}&limit=50`;
        this.getDisplayGRNdata(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.dataService.offsetCountGRN}&limit=50&uni_search=${this.dataService.searchGRNStr}`;
        this.getDisplayGRNdata(this.APIParams);
      }
      // this.dataService.GRNPaginationFisrt = 1;
    } else if (this.route.url == this.archivedTab) {
      this.dataService.archivedPaginationFisrt = 0;
      this.dataService.offsetCountArc = 1;
      this.dataService.archivedDisplayData = [];
      this.dataService.searchArcStr = event;
      if (this.dataService.searchArcStr == '' && this.dataService.posted_inv_type == '') {
        this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50`;
        this.getDisplayARCData(this.APIParams);
      } else if (this.dataService.searchArcStr == '' && this.dataService.posted_inv_type != '') {
        this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50&inv_type=${this.dataService.posted_inv_type}`;
        this.getDisplayARCData(this.APIParams);
      } else if (this.dataService.searchArcStr != '' && this.dataService.posted_inv_type != '') {
        this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50&uni_search=${this.dataService.searchArcStr}&inv_type=${this.dataService.posted_inv_type}`;
        this.getDisplayARCData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.dataService.offsetCountArc}&limit=50&uni_search=${this.dataService.searchArcStr}`;
        this.getDisplayARCData(this.APIParams);
      }
      // this.dataService.archivedPaginationFisrt = 1;
    } else if (this.route.url == this.rejectedTab) {
      this.dataService.rejectedPaginationFisrt = 0;
      this.dataService.offsetCountRej = 1;
      this.dataService.rejectedDisplayData = [];
      this.dataService.searchRejStr = event;
      if (this.dataService.searchRejStr == '') {
        this.APIParams = `?offset=${this.dataService.offsetCountRej}&limit=50`;
        this.getDisplayRejectedData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.dataService.offsetCountRej}&limit=50&uni_search=${this.dataService.searchRejStr}`;
        this.getDisplayRejectedData(this.APIParams);
      }
      // this.dataService.rejectedPaginationFisrt = 1;
    } else if (this.route.url == this.SOTab) {
      this.dataService.SOPaginationFisrt = 0;
      this.dataService.offsetCountSO= 1;
      this.dataService.SODisplayData = [];
      this.dataService.searchSOStr = event;
      if (this.dataService.searchSOStr == '') {
        this.APIParams = `?offset=${this.dataService.offsetCountSO}&limit=50`;
        this.getDisplaySOData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.dataService.offsetCountSO}&limit=50&uni_search=${this.dataService.searchSOStr}`;
        this.getDisplaySOData(this.APIParams);
      }
      // this.dataService.rejectedPaginationFisrt = 1;
    }else if (this.route.url == this.serviceInvoiceTab) {
    }
  }
  selectinvType(val){
    this.dataService.archivedDisplayData = [];
    this.dataService.posted_inv_type = val;
    this.getDisplayARCData(`?offset=${this.dataService.offsetCountArc}&limit=50&inv_type=${val}`);
  }

  filterEmit(event){
    this.tableImportData = event;
  }

  mob_columns(){
    this.invoiceColumns = [
      { columnName : 'Invoice Number', dbColumnname:'docheaderID'},
      { columnName : 'Vendor Name', dbColumnname:'VendorName'},
      { columnName : 'Entity', dbColumnname:'EntityName'},
      { columnName : 'PO Number', dbColumnname:'PODocumentID'}
    ];
    this.poColumns = [
      { columnName : 'Vendor Name', dbColumnname:'VendorName'},
      { columnName : 'Entity', dbColumnname:'EntityName'},
      { columnName : 'PO Number', dbColumnname:'docheaderID'},
      { columnName : 'Status', dbColumnname:'docstatus'}
    ];
    this.GRNColumns = [
      { columnName : 'GRN Number', dbColumnname:'docheaderID'},
      { columnName : 'Vendor Name', dbColumnname:'VendorName'},
      // { columnName : 'Entity', dbColumnname:'EntityName'},
      { columnName : 'PO Number', dbColumnname:'PODocumentID'},
    ];
    this.archivedColumns = [
      { columnName : 'Invoice Number', dbColumnname:'docheaderID'},
      { columnName : 'Vendor Name', dbColumnname:'VendorName'},
      { columnName : 'PO Number', dbColumnname:'PODocumentID'},
      { columnName : 'Payment status', dbColumnname:'PaymentStatus'},
    ];
    this.rejectedColumns = this.invoiceColumns;
    this.serviceColumns = [
      { columnName : 'Invoice Number', dbColumnname:'docheaderID'},
      { columnName : 'Service Provider', dbColumnname:'ServiceProviderName'},
      { columnName : 'Entity', dbColumnname:'EntityName'},
      { columnName : 'Service Account', dbColumnname:'Account'}
    ];
  }

    // to prepare display columns array
    prepareColumnsArray_mobile() {
      this.invoiceColumns.filter((element) => {
        this.columnstodisplayInvoice.push(element.dbColumnname);
      });
      this.poColumns.filter((element) => {
        this.columnstodisplayPO.push(element.dbColumnname);
      });
      this.GRNColumns.filter((element) => {
        this.columnstodisplayGRN.push(element.dbColumnname);
      });
      this.archivedColumns.filter((element) => {
        this.columnstodisplayArchived.push(element.dbColumnname);
      });
      this.rejectedColumns.filter((element) => {
        this.columnstodisplayrejected.push(element.dbColumnname);
      });
      this.serviceColumns.filter((element) => {
        this.columnstodisplayService.push(element.dbColumnname);
      });
  
      this.allInColumnLength = this.invoiceColumns.length + 1;
      this.allPOColumnLength = this.poColumns.length + 1;
      this.GRNColumnLength = this.GRNColumns.length + 1;
      this.allARCColumnLength = this.archivedColumns.length + 1;
      this.rejectedColumnLength = this.rejectedColumns.length + 1;
      this.allSRVColumnLength = this.serviceColumns.length + 1;
    }
}
