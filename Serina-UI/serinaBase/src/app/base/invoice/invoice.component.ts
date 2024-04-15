import { DataService } from 'src/app/services/dataStore/data.service';
import { AlertService } from './../../services/alert/alert.service';
import { ImportExcelService } from './../../services/importExcel/import-excel.service';
import { DateFilterService } from './../../services/date/date-filter.service';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Calendar } from 'primeng/calendar';

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
  showPaginator: boolean;
  invoiceDisplayData = [];
  allInvoiceLength: number;
  showPaginatorAllInvoice: boolean;
  createInvoice: boolean;
  allSearchInvoiceString = [];
  visibleSidebar2: boolean;
  cols: any;
  invoiceColumns: any;
  poColumns: any;
  archivedColumns: any;
  allColumns: any;
  columnstodisplayInvoice = [];
  columnstodisplayPO = [];
  columnstodisplayArchived=[];

  updateColumns: updateColumn[] = [];
  poDispalyData: any[];
  poArrayLength: number;
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
  showPaginatorGRNTable: boolean;
  userDetails: any;
  usertypeBoolean: boolean;

  rangeDates: Date[];
  rangeDatesinv: Date[];
  rangeDates_soa: Date[];
  routeName: string;
  lastYear: number;
  displayYear: string;
  minDate: Date;
  maxDate: Date;
  columnstodisplayService = [];
  serviceColumns: any;
  showPaginatorServiceInvoice: boolean;
  serviceinvoiceDispalyData = [];
  serviceInvoiceLength: any;
  allInColumnLength: any;
  allPOColumnLength: any;
  allARCColumnLength: any;
  allSRVColumnLength: any;
  filterData: any[];
  filterds: any[];
  filterDataService: any[];
  totalInvoicesData: any[];
  filterDataArchived: any;

  @ViewChild('sidenav') sidenav: MatSidenav;
  events: string[] = [];
  opened: boolean;
  portal_name: string;
  invoiceTab: any;
  POTab: any;
  GRNTab: any;
  archivedTab: any;
  rejectedTab: any;
  serviceInvoiceTab: any;
  first: any;
  searchStr: string;
  GRNCreateBool: boolean;
  vendorInvoiceAccess: boolean;
  serviceInvoiceAccess: boolean;
  invoceDoctype = false;
  partyType: string;
  isDesktop: boolean;
  tableImportData: any;
  refreshBool: boolean;
  invTabAllColumns: any;
  poTabAllColumns: any;
  arcTabAllColumns: any;
  invsTabAllColumns: any;
  showFactsComponent: boolean;
  userEmailID: string;
  dialogHeader: string;
  entityName: any;
  selectedEntityId: any;
  entityList: any;
  filteredEnt: any[];
  vendorsList: any;
  filteredVendors: any;
  grnTabDownloadOpt = 'All';
  cardCount: number;
  searchText: string;
  ERPName: any;
  servicesList: any[];
  filteredService: any[];
  
  close(reason: string) {
    this.sidenav.close();
  }
  APIParams: string;

  rejectedColumns: any = [];
  columnstodisplayrejected: any = [];
  rejectedColumnLength: number;

  GRNColumns: any = [];
  columnstodisplayGRN: any = [];
  GRNColumnLength: number;
  factsList = ['Accounts payable professionals are like financial superheroes, ensuring the bills get paid on time to keep the business running smoothly',
  'AI can be as smart as your pet! The AI in your smartphone can recognize your face, just like your dog knows you by sight.',
  "It's like magic! OCR can turn handwritten notes into searchable text on your computer",
  "Automation in accounts payable has become more prevalent, with AI and OCR technology used to streamline invoice processing and reduce errors"];
  search_placeholder = 'Ex : By Vendor. By PO, Select Date range from the Calendar icon';
  @ViewChild('datePicker') datePicker: Calendar;
  pageNumber:number = 1;
  pageId:string = 'Inv';
  maxSize = 7;

selectedVendorId: any;
selectedServiceId: any;
soa_uniSearch: string;
SOATableData = [];
columnsForSOA = [
  { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
  { dbColumnname: 'EntityName', columnName: 'Entity' },
  { dbColumnname: 'InvoiceNo', columnName: 'Invoice Number' },
  { dbColumnname: 'PurchaseOrder', columnName: 'PO Number' },
  { dbColumnname: 'GRN Number', columnName: 'GRN Number' },
  { dbColumnname: 'Invoice Status', columnName: 'Invoice Status' },
  { dbColumnname: 'Description', columnName: 'Description' },
  { dbColumnname: 'InvoiceTotal', columnName: 'Amount' },
  { dbColumnname: 'Rejected BY', columnName: 'Rejected BY' },
];
columnLengthSOA:number;

  constructor(
    public route: Router,
    private AlertService: AlertService,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private messageService: MessageService,
    private ds: DataService,
    private ImportExcelService: ImportExcelService,
    private dateFilterService: DateFilterService,
    private datePipe: DatePipe,
    private authService: AuthenticationService
  ) { 
  }

  ngOnInit(): void {
    this.userDetails = this.authService.currentUserValue;
    this.userEmailID = this.userDetails.userdetails.email;
    this.GRNCreateBool = this.ds.configData?.enableGRN;
    this.vendorInvoiceAccess = this.ds?.configData?.vendorInvoices;
    this.serviceInvoiceAccess = this.ds?.configData?.serviceInvoices;
    this.isDesktop = this.ds.isDesktop;
    this.ERPName = this.ds.configData?.erpname;
    if (this.userDetails.user_type == 'customer_portal') {
      this.usertypeBoolean = true;
      this.portal_name = 'customer';
      // if (!this.vendorInvoiceAccess) {
      //   if (this.ds.doc_status_tab == undefined) {
      //     this.route.navigate([`/${this.portal_name}/invoice/ServiceInvoices`])
      //   } else {
      //     this.route.navigate([`${this.ds.doc_status_tab}`]);
      //   }
      // } else {
      //   this.route.navigate([`/${this.portal_name}/invoice/allInvoices`]);
      // }
    } else if (this.userDetails.user_type == 'vendor_portal') {
      this.usertypeBoolean = false;
      this.portal_name = 'vendorPortal';

    }
    this.ds.portalName = this.portal_name;
    this.columnLengthSOA = this.columnsForSOA.length;
    // if (this.vendorInvoiceAccess) {
    //   if (this.ds.ap_boolean) {
    //     this.partyType = 'Vendor';
    //     this.invoceDoctype = true;
    //     if (!this.ds.doc_status_tab) {
    //       this.route.navigate([`/${this.portal_name}/invoice/allInvoices`]);
    //     } else {
    //       // this.route.navigate([`${this.ds.doc_status_tab}`]);
    //     }
    //   } else {
    //     if (!this.ds.doc_status_tab) {
    //       this.route.navigate([`/${this.portal_name}/invoice/PO`]);
    //     } else {
    //       this.route.navigate([`${this.ds.doc_status_tab}`]);
    //     }
    //     this.partyType = 'Customer';
    //   }
    // }
    this.APIParams = `?offset=1&limit=50`;

    this.routeForTabs();
    this.dateRange();
    this.restoreData();
    this.findActiveRoute();
    // this.readGRNExceptionData();
    // this.getInvoiceData();
    // this.getDisplayPOData();
    // this.getDisplayGRNdata();
    // this.getDisplayReceiptdata();
    this.deviceColumns();
  }
  

  deviceColumns() {
    if (this.ds.isDesktop) {
      // if (this.route.url == this.invoiceTab) {
        if (this.ds.invTabColumns) {
          this.invoiceColumns = this.ds.invTabColumns;
          this.allInColumnLength = this.invoiceColumns.length + 1;
          this.columnstodisplayInvoice = this.pushColumnsField(this.invoiceColumns);
        } else {
          this.getInvoiceColumns();
        }
      // } else if (this.route.url == this.POTab) {
        if (this.ds.poTabColumns) {
          this.poColumns = this.ds.poTabColumns;
          this.allPOColumnLength = this.poColumns.length + 1;
          this.columnstodisplayPO = this.pushColumnsField(this.poColumns);
        } else {
          this.getPOColumns();
        }
      // } else if (this.route.url == this.archivedTab) {
        if (this.ds.arcTabColumns) {
          this.archivedColumns = this.ds.arcTabColumns;
          this.allARCColumnLength = this.archivedColumns.length + 1;
          this.columnstodisplayArchived = this.pushColumnsField(this.archivedColumns);
        } else {
          this.getArchivedColumns();
        }
      // } else if (this.route.url == this.serviceInvoiceTab) {
        if (this.ds.serTabColumns) {
          this.serviceColumns = this.ds.serTabColumns;
          this.allSRVColumnLength = this.serviceColumns.length + 1;
          this.columnstodisplayService = this.pushColumnsField(this.serviceColumns);
        } else {
          this.getServiceColumns();
        }
      // }
      this.prepareColumns();
    } else {
      this.mob_columns();
      this.prepareColumnsArray_mobile();
    }
  }

  restoreData() {
    this.invoiceDisplayData = this.ds.invoiceLoadedData;
    this.serviceinvoiceDispalyData = this.ds.serviceinvoiceLoadedData;
    this.filterDataService = this.serviceinvoiceDispalyData;
    this.filterData = this.invoiceDisplayData;
    this.allInvoiceLength = this.ds.invoiceLoadedData.length;
    if (this.allInvoiceLength > 10) {
      this.showPaginatorAllInvoice = true;
    }
    this.serviceInvoiceLength = this.serviceinvoiceDispalyData.length;
    if (this.serviceInvoiceLength > 10) {
      this.showPaginatorServiceInvoice = true;
    }
    // this.filterForArchived();
    this.poDispalyData = this.ds.poLoadedData;
    this.poArrayLength = this.ds.POtableLength;
    if (this.poDispalyData.length > 10 && this.isDesktop) {
      this.showPaginatorPOTable = true;
    }
    // this.soDisplayData = this.ds.SODisplayData;
    // this.soArrayLength = this.ds.soArrayLength;
    // if (this.soDisplayData.length > 10 && this.isDesktop) {
    //   this.showPaginatorSOTable = true;
    // }
    this.GRNDispalyData = this.ds.GRNLoadedData;
    this.GRNArrayLength = this.ds.GRNTableLength;
    if (this.GRNDispalyData.length > 10 && this.isDesktop) {
      this.showPaginatorGRNTable = true;
    }
    this.archivedDisplayData = this.ds.archivedDisplayData;
    this.archivedLength = this.ds.ARCTableLength;
    if (this.archivedDisplayData.length > 10 && this.isDesktop) {
      this.showPaginatorArchived = true;
    }
    this.rejectedDisplayData = this.ds.rejectedDisplayData;
    this.rejectedLength = this.ds.rejectTableLength;
    if (this.rejectedDisplayData.length > 10 && this.isDesktop) {
      this.showPaginatorRejected = true;
    }
    this.receiptDispalyData = this.ds.receiptLoadedData;
    this.receiptArrayLength = this.ds.receiptLoadedData.length;
    this.visibleSidebar2 = this.sharedService.sidebarBoolean;
 
    if (this.ds.receiptLoadedData.length == 0) {
      // this.getDisplayReceiptdata();
    }
  }

  routeForTabs() {
    this.invoiceTab = `/${this.portal_name}/invoice/allInvoices`;
    this.POTab = `/${this.portal_name}/invoice/PO`;
    // this.SOTab = `/${this.portal_name}/invoice/SO`;
    this.GRNTab = `/${this.portal_name}/invoice/GRN`;
    this.archivedTab = `/${this.portal_name}/invoice/archived`;
    this.rejectedTab = `/${this.portal_name}/invoice/rejected`;
    this.serviceInvoiceTab = `/${this.portal_name}/invoice/ServiceInvoices`;
  }

  prepareColumns() {
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
      { dbColumnname: 'grn_status', columnName: 'GRN Status' },
      { dbColumnname: 'CreatedOn', columnName: 'Received Date' },
      { dbColumnname: 'firstName', columnName: 'Created By' },
      { dbColumnname: 'grn_type', columnName: 'Source' }
    ];

    if (this.portal_name == 'customer') {
      if (!this.partyType) {
        this.partyType = 'Service'
      }
      this.rejectedColumns.unshift({
        dbColumnname: 'VendorName',
        columnName: `${this.partyType} Name`,
      });
    }

    this.rejectedColumns.forEach((e) => {
      if (!this.ds.ap_boolean && e.columnName == 'Invoice Number') {
        e.columnName = 'Document Number'
      }
      this.columnstodisplayrejected.push(e.dbColumnname);
    });

    this.GRNColumns.forEach((e) => {
      this.columnstodisplayGRN.push(e.dbColumnname);
    });
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
      this.pageNumber = this.ds.invTabPageNumber;
      this.searchText = this.ds.invoiceGlobe;
      this.routeName = 'allInvoices';
      if (this.ds.invoiceLoadedData.length == 0) {
        this.getInvoiceData();
      }
    } else if (this.route.url == this.POTab) {
      this.pageNumber = this.ds.poTabPageNumber;
      if (this.ds.poLoadedData.length == 0) {
        this.getDisplayPOData(this.APIParams);
      }
      this.routeName = 'PO';
      this.searchStr = this.ds.searchPOStr;
    } else if (this.route.url == this.archivedTab) {
      this.pageNumber = this.ds.arcTabPageNumber;
      if (this.ds.archivedDisplayData.length == 0) {
        this.getDisplayARCData(this.APIParams);
      }
      this.routeName = 'archived';
      this.searchStr = this.ds.searchArcStr;
    } else if( this.route.url == this.rejectedTab){
      this.pageNumber = this.ds.rejTabPageNumber;
      this.routeName = 'rejected';
      if (this.ds.rejectedDisplayData.length == 0) {
        this.getDisplayRejectedData(this.APIParams);
      }
      this.searchStr = this.ds.searchRejStr;
    } else if( this.route.url == this.GRNTab){
      this.pageNumber = this.ds.grnTabPageNumber;
      if (this.ds.GRNLoadedData.length == 0) {
        this.getDisplayGRNdata(this.APIParams);
      }
      this.routeName = 'GRN';
      this.searchStr = this.ds.searchGRNStr;
    } else if(this.route.url == this.serviceInvoiceTab){
      this.routeName = 'services';
      this.pageNumber = this.ds.serviceTabPageNumber;
      this.searchText = this.ds.serviceGlobe;
      if (this.ds.serviceinvoiceLoadedData.length == 0) {
        this.getDisplayServiceInvoicedata();
      }
    }
    setTimeout(() => {
      this.universalSearch(this.searchText);
    }, 1000);
  }
  getInvoiceData() {
    this.SpinnerService.show();
    this.showFactsComponent = true;
    this.sharedService.getAllInvoice().subscribe(
      (data: any) => {
        const invoicePushedArray = [];
        if (data) {
          this.refreshBool = false;
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
          this.invoiceDisplayData = invoicePushedArray;
          this.filterData = this.invoiceDisplayData;
          // this.filterForArchived();
          setTimeout(()=> {
            this.universalSearch(this.searchText);
          },1000)
          this.allInvoiceLength = this.invoiceDisplayData.length;
          if (this.allInvoiceLength> 10 && this.isDesktop) {
            this.showPaginatorAllInvoice = true;
          }
          this.ds.invoiceLoadedData = invoicePushedArray;
          this.showFactsComponent = false;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.error("Server error");
        this.SpinnerService.hide();
      }
    ), err => {
      this.SpinnerService.hide();
    };
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
          this.ds.poLoadedData.concat(poPushedArray);
        this.ds.poLoadedData = this.poDispalyData;
        this.poArrayLength = data.ok.total_po;
        this.ds.POtableLength = data.ok.total_po;
        if (this.poDispalyData.length > 10 && this.isDesktop) {
          this.showPaginatorPOTable = true;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.error("Server error");
        this.SpinnerService.hide();
      }
    );
  }

  getDisplayGRNdata(data) {
    this.SpinnerService.show();
    this.sharedService.getGRNdata(data).subscribe((data: any) => {
      let grnD = []
      data.grndata?.forEach(ele => {
        let merge = { ...ele.Document }
        merge.EntityName = ele.EntityName;
        merge.VendorName = ele.VendorName;
        merge.grn_type = ele.grn_type;
        merge.firstName = ele.firstName;
        merge.InvoiceNumber = ele.InvoiceNumber;
        merge.grn_status = ele.grn_status;
        grnD.push(merge)
      })

      this.GRNDispalyData = this.ds.GRNLoadedData.concat(grnD);
      this.ds.GRNLoadedData = this.GRNDispalyData;
      this.ds.GRNTableLength = data.grn_total;
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
        this.ds.archivedDisplayData.concat(invoicePushedArray);
      this.ds.archivedDisplayData = this.archivedDisplayData;
      this.archivedDisplayData.forEach((ele1) => {
        for (let name in ele1) {
          if (name == 'ServiceProviderName') {
            ele1['VendorName'] = ele1['ServiceProviderName'];
          }
        }
      });
      if (this.ds.posted_inv_type != 'ser') {
        this.ds.ARCTableLength = data?.result?.ven?.ok?.total_arc;
        this.archivedLength = data?.result?.ven?.ok?.total_arc;
      } else {
        this.ds.ARCTableLength = data?.result?.ser?.ok?.total_arc;
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
        this.ds.rejectedDisplayData.concat(invoicePushedArray);
      this.ds.rejectedDisplayData = this.rejectedDisplayData;
      this.ds.rejectTableLength = data?.result?.ven?.ok?.total_rejected;
      this.rejectedLength = data?.result?.ven?.ok?.total_rejected;
      if (this.rejectedDisplayData.length > 10 && this.isDesktop) {
        this.showPaginatorRejected = true;
      }
      this.SpinnerService.hide();
    });
  }

  // getDisplaySOData(data) {
  //   this.SpinnerService.show();
  //   this.sharedService.getSOdata(data).subscribe((data: any) => {
  //     const invoicePushedArray = [];
  //     data?.ok?.podata?.forEach((element) => {
  //       let invoiceData = {
  //         ...element.Document,
  //         ...element.Entity,
  //         ...element.EntityBody,
  //         ...element.VendorAccount,
  //         ...element.Vendor,
  //       };
  //       invoiceData['docstatus'] = element.docstatus;
  //       invoicePushedArray.push(invoiceData);
  //     });

  //     this.soDisplayData =
  //       this.ds.SODisplayData.concat(invoicePushedArray);
  //     this.ds.SODisplayData = this.soDisplayData;
  //     this.ds.soArrayLength = data?.ok?.total_po;
  //     this.soArrayLength = data?.ok?.total_po;
  //     if (this.soDisplayData.length > 10 && this.isDesktop) {
  //       this.showPaginatorSOTable = true;
  //     }
  //     this.SpinnerService.hide();
  //   });
  // }

  getDisplayServiceInvoicedata() {
    this.SpinnerService.show();
    this.sharedService.getServiceInvoices().subscribe(
      (data: any) => {
        const invoicePushedArray = [];
        if (data) {
          this.refreshBool = false;
          data.ok.Documentdata.forEach((element) => {
            let invoiceData = {
              ...element.Document,
              ...element.Entity,
              ...element.EntityBody,
              ...element.ServiceProvider,
              ...element.ServiceAccount,
              ...element.DocumentSubStatus
            };
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
          setTimeout(() => {
            this.serviceinvoiceDispalyData = allInvoicesService;
            this.filterDataService = this.serviceinvoiceDispalyData;
            this.filterds = this.serviceinvoiceDispalyData;
            this.ds.serviceinvoiceLoadedData = allInvoicesService;
            this.universalSearch(this.searchText);
            this.serviceInvoiceLength = this.serviceinvoiceDispalyData.length;
            if (this.serviceinvoiceDispalyData.length > 10 && this.isDesktop) {
              this.showPaginatorServiceInvoice = true;
            }
          }, 500);
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.error("Server error");
        this.SpinnerService.hide();
      }
    );
  }

  getInvoiceColumns() {
    this.columnsFunc('INV','invTabColumns');
  }

  getPOColumns() {
    this.columnsFunc('PO','poTabColumns');
  }

  columnsFunc(tabType,serviceTab_name){
    this.updateColumns = [];
    this.SpinnerService.show();
    let columnArray = [];
    let columns_to_display = [];
    let columnLength:number;
    this.sharedService.readColumnInvoice(tabType).subscribe(
      (data: any) => {
        const pushedColumnsArray = [];
        data.col_data.forEach((element) => {
          let arrayColumn = {
            ...element.ColumnPosDef,
            ...element.DocumentColumnPos,
          };
          pushedColumnsArray.push(arrayColumn);
        });
        columnArray = pushedColumnsArray.filter((element) => {
          if (tabType == 'PO' && element.columnName == 'Vendor Name' && !this.ds.ap_boolean) {
            element.columnName = 'Customer Name';
          }
          if (tabType == 'ARC' &&!this.ds.ap_boolean && element.columnName == 'Invoice Number') {
            element.columnName = 'Document Number';
          }
          return element.isActive == 1;
        });
        columns_to_display = this.pushColumnsField(columnArray);
        columnArray = columnArray.sort(
          (a, b) => a.documentColumnPos - b.documentColumnPos
        );
        this.ds[serviceTab_name] = columnArray
        columnLength = columnArray.length + 1;
        this.allColumns = pushedColumnsArray.sort(
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
        if(tabType == 'INV'){
          this.invoiceColumns = columnArray;
          this.columnstodisplayInvoice = columns_to_display;
          this.allInColumnLength = columnLength;
          this.invTabAllColumns = this.allColumns;
        } else if(tabType == 'PO'){
          this.poColumns = columnArray;
          this.columnstodisplayPO = columns_to_display;
          this.allPOColumnLength = columnLength;
          this.poTabAllColumns = this.allColumns;
        } else if(tabType == 'ARC'){
          this.archivedColumns = columnArray;
          this.columnstodisplayArchived = columns_to_display;
          this.allARCColumnLength = columnLength;
          this.arcTabAllColumns = this.allColumns;
        } else if(tabType == 'INVS'){
          this.serviceColumns = columnArray;
          this.columnstodisplayService = columns_to_display;
          this.allSRVColumnLength = columnLength;
          this.invsTabAllColumns = this.allColumns;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  getArchivedColumns() {
    this.columnsFunc('ARC','arcTabColumns');
  }

  getServiceColumns() {
    this.columnsFunc('INVS','serTabColumns');
  }

  menuChange(value) {
    this.updateColumns = [];

    this.activeMenuName = value;
    // this.getInvoiceData();
    this.ds.allPaginationFirst = 0;
    this.ds.allPaginationRowLength = 10;
    if (value == 'invoice') {
      this.route.navigate([this.invoiceTab]);
      this.ds.doc_status_tab = this.invoiceTab;
      this.allSearchInvoiceString = [];
      if (!this.invoiceColumns) {
        this.getInvoiceColumns();
      }
    } else if (value == 'po') {
      if (!this.poColumns) {
        this.getPOColumns();
      }
      this.route.navigate([this.POTab]);
      this.ds.doc_status_tab = this.POTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.ds.searchPOStr;
    } 
    // else if (value == 'so') {
    //   // this.getPOColums();
    //   this.route.navigate([this.SOTab]);
    //   this.ds.doc_status_tab = this.SOTab;
    //   this.allSearchInvoiceString = [];
    //   this.searchStr = this.ds.searchSOStr;
    // } 
    else if (value == 'grn') {
      this.route.navigate([this.GRNTab]);
      this.ds.doc_status_tab = this.GRNTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.ds.searchGRNStr;
    } else if (value == 'ServiceInvoices') {
      if (!this.serviceColumns) {
        this.getServiceColumns();
      }
      this.route.navigate([this.serviceInvoiceTab]);
      this.ds.doc_status_tab = this.serviceInvoiceTab;
      this.allSearchInvoiceString = [];
    } else if (value == 'archived') {
      if (!this.archivedColumns) {
        this.getArchivedColumns();
      }
      this.route.navigate([this.archivedTab]);
      this.ds.doc_status_tab = this.archivedTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.ds.searchArcStr;
    } else if (value == 'rejected') {
      this.route.navigate([this.rejectedTab]);
      this.ds.doc_status_tab = this.rejectedTab;
      this.allSearchInvoiceString = [];
      this.searchStr = this.ds.searchRejStr;
    } 
    setTimeout(() => {
      this.findActiveRoute();
    }, 500);
  }
  searchInvoiceDataV(value) {
    this.allSearchInvoiceString = [];
    this.allSearchInvoiceString = value.filteredValue;
  }
  showSidebar(value) {
    this.visibleSidebar2 = value;
    // this.sidenav.toggle();
    if (this.route.url == this.invoiceTab) {
      this.allColumns = this.invTabAllColumns;
    } else if (this.route.url == this.POTab) {
      this.allColumns = this.poTabAllColumns;
    } else if (this.route.url == this.archivedTab) {
      this.allColumns = this.arcTabAllColumns;
    } else if (this.route.url == this.rejectedTab) {
      this.allColumns = this.arcTabAllColumns;
    } else if (this.route.url == this.serviceInvoiceTab) {
      this.allColumns = this.invsTabAllColumns;
    }
  }

  exportExcel() {
    if(!this.route.url.includes('GRN')){
      let exportData = [];
      if(!this.tableImportData){
        if (this.route.url == this.invoiceTab) {
          exportData = this.invoiceDisplayData;
        } else if (this.route.url == this.POTab) {
          exportData = this.poDispalyData;
        } else if (this.route.url == this.GRNTab) {
          exportData = this.GRNDispalyData;
        } else if (this.route.url == this.archivedTab) {
          exportData = this.archivedDisplayData;
        } else if (this.route.url == this.rejectedTab) {
          exportData = this.rejectedDisplayData;
        }  else if (this.route.url == this.serviceInvoiceTab) {
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
    } else {
      this.dialogHeader = "GRN Reports";
      const dialog = document.querySelector('dialog');
      if (dialog) {
        dialog.showModal();
      }
    }
  }
  openSOADialog(txt){
    if(txt == 'soa'){
      this.getCustomerVendors();
      this.dialogHeader = "SOA Reports";
    } else {
      this.getServiceProviders();
      this.dialogHeader = "ERP Reports";
    }
    this.readEntity();

    const dialog = document.querySelector('dialog');
    if (dialog) {
      dialog.showModal();
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
  activeColumn(e, value) {
    // if (this.route.url == '/customer/invoice/allInvoices') {
    this.updateColumns.forEach((val) => {
      if (val.idtabColumn == value.idDocumentColumn) {
        val.isActive = e.target.checked;
      }
    });
  }

  updateColumnPosition() {
    let param = '';
    let funName:string;
    if(this.route.url == this.invoiceTab){
      param = 'INV';
      funName = 'getInvoiceColumns';
    } else if(this.route.url == this.POTab){
      param = 'PO';
      funName = 'getPOColumns';
    } else if(this.route.url == this.archivedTab || this.route.url == this.rejectedTab){
      param = 'ARC';
      funName = 'getArchivedColumns';
    } else if(this.route.url == this.serviceInvoiceTab){
      param = 'INVS';
      funName = 'getServiceColumns';
    }
    this.sharedService.updateColumnPOs(this.updateColumns, param).subscribe(
      (data: any) => {
        this[funName]();
        this.AlertService.updateObject.detail =
          'Columns updated successfully';
        this.messageService.add(this.AlertService.updateObject);
      },
      (error) => {
        this.error(error.statusText);
      }
    );
    // this.sidenav.close();
    this.visibleSidebar2 = false;
  }

  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      // this.filterData = [];
      this.search_placeholder = `From "${frmDate}" to "${toDate}"`;
      if(frmDate && toDate){
        if (this.datePicker.overlayVisible) {
          this.datePicker.hideOverlay();
        }
        if (this.route.url == this.invoiceTab) {
          this.invoiceDisplayData = this.filterData;
          this.invoiceDisplayData = this.invoiceDisplayData.filter((element) => {
            const dateF = this.datePipe.transform(element.CreatedOn, 'yyyy-MM-dd')
            return dateF >= frmDate && dateF <= toDate;
          });
          this.allInvoiceLength = this.invoiceDisplayData?.length;
        } else if (this.route.url == this.serviceInvoiceTab) {
          this.serviceinvoiceDispalyData = this.filterDataService;
          this.serviceinvoiceDispalyData = this.serviceinvoiceDispalyData.filter(
            (element) => {
              const dateF = this.datePipe.transform(element.CreatedOn, 'yyyy-MM-dd')
              return dateF >= frmDate && dateF <= toDate;
            }
          );
          this.serviceInvoiceLength = this.serviceinvoiceDispalyData.length;
        } else if (this.route.url == this.archivedTab) {
          this.archivedDisplayData = this.filterDataArchived;
          this.archivedDisplayData = this.archivedDisplayData.filter(
            (element) => {
              const dateF = this.datePipe.transform(element.CreatedOn, 'yyyy-MM-dd')
              return dateF >= frmDate && dateF <= toDate;
            }
          );
          this.archivedLength = this.archivedDisplayData.length;
        }
      }
    } else {
      this.invoiceDisplayData = this.filterData;
      this.allInvoiceLength = this.invoiceDisplayData.length;
      this.search_placeholder = 'Ex : By Vendor. By PO, Select Date range from the Calendar icon';
    }
  }
  clearDates() {
    this.filterByDate('');
  }

  paginate(event) {
    if(this.ds.isTableView){
      this.first = event.first;
    } else {
      this.first = event.pageNumber;
    }
    if (this.route.url == this.invoiceTab) {
      this.ds.allPaginationFirst = this.first;
      this.ds.allPaginationRowLength = event.rows;
    } else if (this.route.url == this.POTab) {
      this.ds.poPaginationFirst = this.first;
      this.ds.poPaginationRowLength = event.rows;
      if (this.first >= this.ds.pageCountVariablePO) {
        this.ds.pageCountVariablePO = this.first;
        if (this.ds.searchPOStr == '') {
          this.ds.offsetCountPO++;
          this.APIParams = `?offset=${this.ds.offsetCountPO}&limit=50`;
          this.getDisplayPOData(this.APIParams);
        } else {
          this.ds.offsetCountPO++;
          this.APIParams = `?offset=${this.ds.offsetCountPO}&limit=50&uni_search=${this.ds.searchPOStr}`;
          this.getDisplayPOData(this.APIParams);
        }
      }
    } else if (this.route.url == this.GRNTab) {
      this.ds.GRNPaginationFirst = this.first;
      this.ds.GRNPaginationRowLength = event.rows;
      if (this.first >= this.ds.pageCountVariableGRN) {
        this.ds.pageCountVariableGRN = this.first;
        if (this.ds.searchGRNStr == '') {
          this.ds.offsetCountGRN++;
          this.APIParams = `?offset=${this.ds.offsetCountGRN}&limit=50`;
          this.getDisplayGRNdata(this.APIParams);
        } else {
          this.ds.offsetCountGRN++;
          this.APIParams = `?offset=${this.ds.offsetCountGRN}&limit=50&uni_search=${this.ds.searchGRNStr}`;
          this.getDisplayGRNdata(this.APIParams);
        }
      }
    } else if (this.route.url == this.archivedTab) {
      this.ds.archivedPaginationFirst = this.first;
      this.ds.archivedPaginationRowLength = event.rows;
      if (this.first >= this.ds.pageCountVariableArc) {
        this.ds.pageCountVariableArc = this.first;
        if (this.ds.searchArcStr == '' && this.ds.posted_inv_type == '') {
          this.ds.offsetCountArc++;
          this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50`;
          this.getDisplayARCData(this.APIParams);
        } else if (this.ds.searchArcStr == '' && this.ds.posted_inv_type != '') {
          this.ds.offsetCountArc++;
          this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50&inv_type=${this.ds.posted_inv_type}`;
          this.getDisplayARCData(this.APIParams);
        } else if (this.ds.searchArcStr != '' && this.ds.posted_inv_type != '') {
          this.ds.offsetCountArc++;
          this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50&uni_search=${this.ds.searchArcStr}&inv_type=${this.ds.posted_inv_type}`;
          this.getDisplayARCData(this.APIParams);
        } else {
          this.ds.offsetCountArc++;
          this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50&uni_search=${this.ds.searchArcStr}`;
          this.getDisplayARCData(this.APIParams);
        }
      }
    } else if (this.route.url == this.rejectedTab) {
      this.ds.rejectedPaginationFirst = this.first;
      this.ds.rejectedPaginationRowLength = event.rows;
      if (this.first >= this.ds.pageCountVariableRej) {
        this.ds.pageCountVariableRej = this.first;
        if (this.ds.searchRejStr == '') {
          this.ds.offsetCountRej++;
          this.APIParams = `?offset=${this.ds.offsetCountRej}&limit=50`;
          this.getDisplayRejectedData(this.APIParams);
        } else {
          this.ds.offsetCountRej++;
          this.APIParams = `?offset=${this.ds.offsetCountRej}&limit=50&uni_search=${this.ds.searchRejStr}`;
          this.getDisplayRejectedData(this.APIParams);
        }
      }
    } 
    // else if (this.route.url == this.SOTab) {
    //   this.ds.SOPaginationFirst = this.first;
    //   this.ds.SOPaginationRowLength = event.rows;
    //   if (this.first >= this.ds.pageCountVariableSO) {
    //     this.ds.pageCountVariableSO = event.first;
    //     if (this.ds.searchSOStr == '') {
    //       this.ds.offsetCountSO++;
    //       this.APIParams = `?offset=${this.ds.offsetCountSO}&limit=50`;
    //       this.getDisplaySOData(this.APIParams);
    //     } else {
    //       this.ds.offsetCountSO++;
    //       this.APIParams = `?offset=${this.ds.offsetCountSO}&limit=50&uni_search=${this.ds.searchSOStr}`;
    //       this.getDisplaySOData(this.APIParams);
    //     }
    //   }
    // } 
    else if (this.route.url == this.serviceInvoiceTab) {
      this.ds.servicePaginationFirst = this.first;
      this.ds.servicePaginationRowLength = event.rows;
    }
  }

  keySearch(str,event:KeyboardEvent){
    if(str == ''){
      this.APIParams = `?offset=1&limit=50`
      if (this.route.url == this.invoiceTab) {
      } else if (this.route.url == this.POTab) {
        this.ds.poLoadedData = [];
        this.getDisplayPOData(this.APIParams);
      } else if (this.route.url == this.GRNTab) {
        this.ds.GRNLoadedData = [];
        this.getDisplayGRNdata(this.APIParams);
      } else if (this.route.url == this.archivedTab) {
        this.ds.archivedDisplayData = [];
        this.getDisplayARCData(this.APIParams);
      } else if (this.route.url == this.rejectedTab) {
        this.ds.rejectedDisplayData = [];
        this.getDisplayRejectedData(this.APIParams);
      } 
      // else if (this.route.url == this.SOTab) {
      //   this.ds.SODisplayData = [];
      //   this.getDisplaySOData(this.APIParams);
      // } 
      else if (this.route.url == this.serviceInvoiceTab) {
      }
    }
    if (event.key === 'Enter') {
      this.filterString(str);
    }
  }

  filterString(event) {
    if (this.route.url == this.invoiceTab) {
      // this.ds.allPaginationFirst = 0;
    } else if (this.route.url == this.POTab) {
      this.ds.poPaginationFirst = 0;
      this.ds.offsetCountPO = 1;
      this.ds.poLoadedData = [];
      this.ds.searchPOStr = event;
      if (this.ds.searchPOStr == '') {
        this.APIParams = `?offset=${this.ds.offsetCountPO}&limit=50`;
        this.getDisplayPOData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.ds.offsetCountPO}&limit=50&uni_search=${this.ds.searchPOStr}`;
        this.getDisplayPOData(this.APIParams);
      }
      // this.ds.poPaginationFisrt = 1;
    } else if (this.route.url == this.GRNTab) {
      this.ds.GRNPaginationFirst = 0;
      this.ds.offsetCountGRN = 1;
      this.ds.GRNLoadedData = [];
      this.ds.searchGRNStr = event;
      if (this.ds.searchGRNStr == '') {
        this.APIParams = `?offset=${this.ds.offsetCountGRN}&limit=50`;
        this.getDisplayGRNdata(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.ds.offsetCountGRN}&limit=50&uni_search=${this.ds.searchGRNStr}`;
        this.getDisplayGRNdata(this.APIParams);
      }
      // this.ds.GRNPaginationFisrt = 1;
    } else if (this.route.url == this.archivedTab) {
      this.ds.archivedPaginationFirst = 0;
      this.ds.offsetCountArc = 1;
      this.ds.archivedDisplayData = [];
      this.ds.searchArcStr = event;
      if (this.ds.searchArcStr == '' && this.ds.posted_inv_type == '') {
        this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50`;
        this.getDisplayARCData(this.APIParams);
      } else if (this.ds.searchArcStr == '' && this.ds.posted_inv_type != '') {
        this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50&inv_type=${this.ds.posted_inv_type}`;
        this.getDisplayARCData(this.APIParams);
      } else if (this.ds.searchArcStr != '' && this.ds.posted_inv_type != '') {
        this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50&uni_search=${this.ds.searchArcStr}&inv_type=${this.ds.posted_inv_type}`;
        this.getDisplayARCData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.ds.offsetCountArc}&limit=50&uni_search=${this.ds.searchArcStr}`;
        this.getDisplayARCData(this.APIParams);
      }
      // this.ds.archivedPaginationFisrt = 1;
    } else if (this.route.url == this.rejectedTab) {
      this.ds.rejectedPaginationFirst = 0;
      this.ds.offsetCountRej = 1;
      this.ds.rejectedDisplayData = [];
      this.ds.searchRejStr = event;
      if (this.ds.searchRejStr == '') {
        this.APIParams = `?offset=${this.ds.offsetCountRej}&limit=50`;
        this.getDisplayRejectedData(this.APIParams);
      } else {
        this.APIParams = `?offset=${this.ds.offsetCountRej}&limit=50&uni_search=${this.ds.searchRejStr}`;
        this.getDisplayRejectedData(this.APIParams);
      }
      // this.ds.rejectedPaginationFisrt = 1;
    } 
    // else if (this.route.url == this.SOTab) {
    //   this.ds.SOPaginationFirst = 0;
    //   this.ds.offsetCountSO = 1;
    //   this.ds.SODisplayData = [];
    //   this.ds.searchSOStr = event;
    //   if (this.ds.searchSOStr == '') {
    //     this.APIParams = `?offset=${this.ds.offsetCountSO}&limit=50`;
    //     this.getDisplaySOData(this.APIParams);
    //   } else {
    //     this.APIParams = `?offset=${this.ds.offsetCountSO}&limit=50&uni_search=${this.ds.searchSOStr}`;
    //     this.getDisplaySOData(this.APIParams);
    //   }
    //   // this.ds.rejectedPaginationFisrt = 1;
    // } 
    else if (this.route.url == this.serviceInvoiceTab) {
    }
  }
  selectinvType(val) {
    this.ds.archivedDisplayData = [];
    this.ds.posted_inv_type = val;
    this.getDisplayARCData(`?offset=${this.ds.offsetCountArc}&limit=50&inv_type=${val}`);
  }

  filterEmit(event) {
    this.tableImportData = event;
  }

  mob_columns() {
    this.invoiceColumns = [
      { columnName: 'Invoice Number', dbColumnname: 'docheaderID' },
      { columnName: 'Vendor Name', dbColumnname: 'VendorName' },
      { columnName: 'Entity', dbColumnname: 'EntityName' },
      { columnName: 'PO Number', dbColumnname: 'PODocumentID' }
    ];
    this.poColumns = [
      { columnName: 'Vendor Name', dbColumnname: 'VendorName' },
      { columnName: 'Entity', dbColumnname: 'EntityName' },
      { columnName: 'PO Number', dbColumnname: 'docheaderID' },
      { columnName: 'Status', dbColumnname: 'docstatus' }
    ];
    this.GRNColumns = [
      { columnName: 'GRN Number', dbColumnname: 'docheaderID' },
      { columnName: 'Vendor Name', dbColumnname: 'VendorName' },
      // { columnName : 'Entity', dbColumnname:'EntityName'},
      { columnName: 'PO Number', dbColumnname: 'PODocumentID' },
    ];
    this.archivedColumns = [
      { columnName: 'Invoice Number', dbColumnname: 'docheaderID' },
      { columnName: 'Vendor Name', dbColumnname: 'VendorName' },
      { columnName: 'PO Number', dbColumnname: 'PODocumentID' },
      { columnName: 'Payment status', dbColumnname: 'PaymentStatus' },
    ];
    this.rejectedColumns = this.invoiceColumns;
    this.serviceColumns = [
      { columnName: 'Invoice Number', dbColumnname: 'docheaderID' },
      { columnName: 'Service Provider', dbColumnname: 'ServiceProviderName' },
      { columnName: 'Entity', dbColumnname: 'EntityName' },
      { columnName: 'Service Account', dbColumnname: 'Account' }
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

  refreshInvoice(type) {
    this.refreshBool = true;
    if (type == 'inv') {
      this.getInvoiceData();
    } else if(type == 'ser'){
      this.getDisplayServiceInvoicedata();
    } else if(type == 'PO'){
      this.ds.poLoadedData = [];
      this.getDisplayPOData(this.APIParams);
      this.refreshBool = false;
    }

  }

  pushColumnsField(element) {
    const arrayOfColumnId = [];
    element.forEach((e) => {
      arrayOfColumnId.push(e.dbColumnname);
    });
    return arrayOfColumnId;
  }

  
  universalSearch(txt){
      if(this.route.url == this.serviceInvoiceTab){
        this.ds.serviceGlobe = txt;
        this.serviceinvoiceDispalyData = this.filterDataService;
        this.serviceinvoiceDispalyData = this.ds.searchFilter(txt,this.filterDataService);
      } else if(this.route.url == this.invoiceTab){
        this.ds.invoiceGlobe = txt;
        this.invoiceDisplayData = this.filterData;
        this.invoiceDisplayData = this.ds.searchFilter(txt,this.filterData);
      }
  }
  closeDialog(){
    const dialog = document.querySelector('dialog');
    if(dialog){
      dialog.close();
    }
  }

  grnDownloadSelection(str){
    this.grnTabDownloadOpt = str;
  }

  email_download(){
    this.SpinnerService.show();
    let api_param = '';
    let api_body = {
        "email": this.userEmailID,
        "option": this.grnTabDownloadOpt
      }
    if(this.rangeDates){
      const frmDate = this.datePipe.transform(this.rangeDates[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(this.rangeDates[1], 'yyyy-MM-dd');
      api_param = `?start_date=${frmDate}&end_date=${toDate}`
    }
    this.sharedService.downloadGRN(api_param,api_body).subscribe((data:any)=>{
      this.success(data.result);
      this.SpinnerService.hide();
      this.closeDialog();
    })
  }
  success(msg) {
    this.AlertService.success_alert(msg);
  }
  error(msg) {
   this.AlertService.error_alert(msg);
  }
  onPageChange(number: number) {
    this.pageNumber = number;
}
readEntity(){
  this.ds.entityData.subscribe((data:[])=>{
    this.entityList = data;
    this.filteredEnt = this.entityList;
  })
}

filterEntity(event) {
  let filtered: any[] = [];
  let query = event.query;

  if (this.entityList?.length > 0) {
    for (let i = 0; i < this.entityList?.length; i++) {
      let ent: any = this.entityList[i];
      if (ent.EntityName.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(ent);
      }
    }
  }
  this.filteredEnt = filtered;
}
selectEntity(value) {
  // this.selectedEntityId = value.idEntity;
  this.sharedService.selectedEntityId = value.idEntity;
  this.entityName = value;
}
getCustomerVendors() {
  this.sharedService
    .getVendorsListToCreateNewlogin(`?offset=1&limit=100`)
    .subscribe((data: any) => {
      this.vendorsList = data.vendorlist;
      // this.filteredVendors = this.vendorsList
    });
}
filterVendor(event) {
  let query = event.query.toLowerCase();
  if (query != '') {
    this.sharedService.getVendorsListToCreateNewlogin(`?offset=1&limit=100&ven_name=${query}`).subscribe((data: any) => {
      this.filteredVendors = data.vendorlist;
    });
  } else {
    this.filteredVendors = this.vendorsList;
  }
}
getServiceProviders() {
  this.sharedService
    .readserviceprovider()
    .subscribe((data: any) => {
      let mergerdArray = [];
      data.forEach(element => {
        let spData = {...element.Entity,...element.ServiceProvider};
        mergerdArray.push(spData);
      });
      this.servicesList = mergerdArray;
      // this.filteredVendors = this.vendorsList
    });
}
filterService(event) {
  let filtered: any[] = [];
  let query = event.query;

  if (this.servicesList?.length > 0) {
    for (let i = 0; i < this.servicesList?.length; i++) {
      let ent: any = this.servicesList[i];
      if (ent.ServiceProviderName.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(ent);
      }
    }
  }
  this.filteredService = filtered;
}
selectedVendor(val){
}
soaSearch(bool){
  // Initialize API parameter with usertype and filter_type
  let apiParam = `?usertype=${this.userDetails.user_type}&filter_type=${bool}`;
  
  // Add entity ID if selected
  if (this.selectedEntityId) {
    let ent_id = this.selectedEntityId?.idEntity;
    apiParam += `&ent_id=${ent_id}`;
  }

  // Add vendor ID if selected
  if (this.selectedVendorId) {
    let ven_name = this.selectedVendorId?.VendorName;
    apiParam += `&ven_name=${ven_name}`;
  }

  // Transform dates if rangeDates_soa is available
  let frmDate, toDate;
  if (this.rangeDates_soa) {
    frmDate = this.datePipe.transform(this.rangeDates_soa[0], 'yyyy-MM-dd');
    toDate = this.datePipe.transform(this.rangeDates_soa[1], 'yyyy-MM-dd');
    apiParam += `&start_date=${frmDate}&end_date=${toDate}`;
  }

  // Add unique search key if present
  if (this.soa_uniSearch) {
    apiParam += `&unq_key=${this.soa_uniSearch}`;
  }
  this.SpinnerService.show();
  this.sharedService.SOASearch(apiParam).subscribe((data:any)=>{
    this.SpinnerService.hide();
    if(bool){
      this.AlertService.addObject.detail = "Dear User, The Report will be sent to your email shortly."
      this.messageService.add( this.AlertService.addObject);
      this.closeDialog();
    } else {
      this.SOATableData = data;
      console.log(this.SOATableData);
    }
  },err=>{
    this.SpinnerService.hide();
    this.AlertService.errorObject.detail = "Server error."
    this.messageService.add( this.AlertService.errorObject);
  })
}

ERPReports(bool) {
   // Initialize API parameter with usertype and filter_type
   let apiParam = `?ismail=${bool}`;
  
   // Add entity ID if selected
   if (this.selectedEntityId) {
     let ent_id = this.selectedEntityId?.idEntity;
     apiParam += `&ent_id=${ent_id}`;
   }
 
   // Add service ID if selected
   if (this.selectedServiceId) {
     let sp_name = this.selectedServiceId?.ServiceProviderName;
     apiParam += `&SP_name=${sp_name}`;
   }
 
   // Transform dates if rangeDates_soa is available
   let frmDate, toDate;
   if (this.rangeDates_soa) {
     frmDate = this.datePipe.transform(this.rangeDates_soa[0], 'yyyy-MM-dd');
     toDate = this.datePipe.transform(this.rangeDates_soa[1], 'yyyy-MM-dd');
     apiParam += `&start_date=${frmDate}&end_date=${toDate}`;
   }
 
   // Add unique search key if present
  //  if (this.soa_uniSearch) {
  //    apiParam += `&unq_key=${this.soa_uniSearch}`;
  //  }
   this.SpinnerService.show();
   this.sharedService.ERPReportDownload(apiParam).subscribe((data:any)=>{
     this.SpinnerService.hide();
     if(bool){
       this.success("Dear User, The Report will be sent to your email shortly.");
       this.closeDialog();
     } else {
      this.success("Dear User, The Report downloaded successfully.");
      //  this.SOATableData = data;
     }
   },err=>{
     this.SpinnerService.hide();
      this.error("Server error");
   }) 
}
}
