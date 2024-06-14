import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { TaggingService } from './../../../services/tagging.service';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { PermissionService } from 'src/app/services/permission.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';

@Component({
  selector: 'app-exception-table',
  templateUrl: './exception-table.component.html',
  styleUrls: ['./exception-table.component.scss'],
})
export class ExceptionTableComponent implements OnInit, OnChanges {
  @Input() columnsData;
  @Input() invoiceColumns;
  @Input() columnsToDisplay;
  @Input() showPaginatorAllInvoice;
  @Input() pageNumber: number;
  cardCount: number;
  @Input() pageId: string;
  @Input() ColumnLength;
  @Input() searchText: string;
  @Output() public searchInvoiceData: EventEmitter<any> =
    new EventEmitter<any>();
  // @Output() public paginateEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() public paginationEvent: EventEmitter<any> =
    new EventEmitter<boolean>();
  @Output() public systemCheckEmit: EventEmitter<any> = new EventEmitter<any>();
  showPaginator: boolean;
  @Output() public sideBarBoolean: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() public filterDataEmit: EventEmitter<any> =
    new EventEmitter<any>();
  // columnsToDisplay =[];
  _selectedColumns: any[];
  visibleSidebar2;
  cols;
  status = {};

  @ViewChild('allInvoice', { static: true }) allInvoice: Table;
  hasSearch: boolean = false;
  previousAvailableColumns: any[];
  select: any;
  userType: string;
  first = 0;
  last: number;
  rows = 10;
  bgColorCode;

  public counts = [];
  public orderStatus = 'Quantity check';
  dataLength: any;
  batchBoolean: boolean;
  dashboardViewBoolean: boolean;
  portalName: string;
  confirmText: string;
  displayResponsivepopup: boolean;
  selectedFields1: any;
  stateTable: any
  globalSearch: string;
  ap_boolean: any;
  selectedStatus: any;
  statusData: Set<string>;
  exceptionAlertdate: any;
  isDesktop: boolean;
  drilldownarray = [];
  drillBool: boolean;
  docId: any;
  user_name: string;
  // offCount_grn = 1;
  // offSetArr = [];
  source_icons = [
    { src: 'assets/Serina Assets/new_theme/email.png', name: 'Mail' },
    { src: 'assets/Serina Assets/new_theme/whatsapp.png', name: 'WhatsApp' },
    { src: 'assets/Serina Assets/new_theme/sharepoint-logotype.png', name: 'SharePoint' },
    { src: 'assets/Serina Assets/new_theme/internet.png', name: 'Web' },
    { src: 'assets/Serina Assets/new_theme/email.png', name: 'API' },
    { src: 'assets/Serina Assets/new_theme/email.png', name: 'RPA' }
  ]
  fst: number = 0;
  isAdmin: boolean;
  triggerBoolean: boolean;
  invoiceID: any;
  checkstatusPopupBoolean: boolean;
  statusText: any;
  statusText1: string;
  isOpen: boolean;
  maxSize = 7;
  isTableView: boolean;
  FilterData: any;
  ERPName: string;
  actionBool: boolean = true;

  constructor(
    private tagService: TaggingService,
    public router: Router,
    private permissionService: PermissionService,
    private authService: AuthenticationService,
    private ExceptionsService: ExceptionsService,
    private ds: DataService,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private alertService: AlertService,
    private md: MatDialog
  ) {
    this.ds.isTableView.subscribe(bool => {
      this.isTableView = bool;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.ap_boolean = this.ds.ap_boolean;
    this.initialData();
    this.dateFunc();
    let userRole = this.authService.currentUserValue['permissioninfo'].NameOfRole.toLowerCase();
    this.ERPName = this.ds.configData?.erpname;
    if (userRole == 'customer super admin' || userRole == 'ds it admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    // if(this.columnsData?.length>10){
    //   this.showPaginatorAllInvoice = true;
    // }
    this.getRowsData();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(this.isDesktop){
      this.calculateCardCountPerPage();
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
  dateFunc() {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 4);

    // Extract the year, month, and day from the resulting date
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
    let day = currentDate.getDate();

    // Format the date as desired (e.g., "YYYY-MM-DD")
    let date: any = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    let normalDate = new Date(date);
    this.exceptionAlertdate = normalDate.toISOString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.invoiceColumns) {
      this.invoiceColumns.forEach(e => {
        if (e.columnName == 'Rejected BY') {
          this.actionBool = false;
        }
      })
    }
    if (changes.columnsData && changes.columnsData.currentValue && changes.columnsData.currentValue.length > 0) {
      this.FilterData = this.columnsData;
      let mergedStatus = ['All'];
      this.columnsData.forEach(ele => {
        if (this.router.url.includes('invoice')) {
          mergedStatus.push(ele.docstatus);
        } else {
          if (ele.documentsubstatusID == 40 || ele.documentsubstatusID == 32) {
            ele.status = ele.substatus;
          }
          mergedStatus.push(ele.status)
        }

      })
      this.statusData = new Set(mergedStatus);
      if (!this.isTableView && this.columnsData?.length <= this.cardCount) {
        this.showPaginatorAllInvoice = false;
      } else if(this.columnsData?.length > this.cardCount){
        this.showPaginatorAllInvoice = true;
      }
    }
    this.findActiveRoute();
  }
  findActiveRoute() {
    if (this.router.url.includes('allInvoices')) {
      this.pageNumber = this.ds.invTabPageNumber;
    } else if (this.router.url.includes('PO')) {
      this.pageNumber = this.ds.poTabPageNumber;
    } else if (this.router.url == `/${this.portalName}/invoice/GRN`) {
      this.pageNumber = this.ds.grnTabPageNumber;
    } else if (this.router.url.includes('archived')) {
      this.pageNumber = this.ds.arcTabPageNumber;
    } else if (this.router.url.includes('rejected')) {
      this.pageNumber = this.ds.rejTabPageNumber;
    } else if (this.router.url.includes('ServiceInvoices')) {
      this.pageNumber = this.ds.serviceTabPageNumber;
    } else if (this.router.url.includes('ExceptionManagement')) {
      this.pageNumber = this.ds.excTabPageNumber;
    } else if (this.router.url.includes('Create_GRN_inv_list')) {
      this.pageNumber = this.ds.crGRNTabPageNumber;
    } else if (this.router.url.includes('GRN_Approvals')) {
      this.pageNumber = this.ds.aprTabPageNumber;
    }
  }
  initialData() {
    this.userType = this.authService.currentUserValue['user_type'];
    this.user_name = this.authService.currentUserValue['userdetails'].firstName;
    this.isDesktop = this.ds.isDesktop;
    if(this.isDesktop){
      this.calculateCardCountPerPage();
    } 
    if (this.userType == 'vendor_portal') {
      this.portalName = 'vendorPortal';
    } else {
      this.portalName = 'customer';
    }
    this.bgColorCode = this.ds.bgColorCode;
    this.visibleSidebar2 = this.sharedService.sidebarBoolean;

    if (this.router.url.includes('home')) {
      this.dashboardViewBoolean = true;
    } else {
      this.dashboardViewBoolean = false;
    }

    // if (this.tagService.batchProcessTab == 'normal') {
    //   this.batchBoolean = true;
    //   this.first = this.ds.exc_batch_edit_page_first;
    //   this.rows = this.ds.exc_batch_edit_page_row_length;
    // } else {
    //   this.batchBoolean = false;
    //   this.first = this.ds.exc_batch_approve_page_first;
    //   this.rows = this.ds.exc_batch_approve_page_row_length;
    // }
    if (this.router.url.includes('ExceptionManagement')) {
      if (this.tagService.batchProcessTab == 'normal') {
        this.batchBoolean = true;
        this.first = this.ds.exc_batch_edit_page_first;
        this.rows = this.ds.exc_batch_edit_page_row_length;
        let stItem: any = JSON.parse(sessionStorage?.getItem('editException'));
        if (stItem) {
          this.globalSearch = stItem?.filters?.global?.value;
        } else {
          this.globalSearch = this.ds.exception_G_S;
        }

        this.stateTable = 'editException';
      } else {
        this.batchBoolean = false;
        this.first = this.ds.exc_batch_approve_page_first;
        this.rows = this.ds.exc_batch_approve_page_row_length;
        this.stateTable = 'approvalPending';
        let stItem: any = JSON.parse(sessionStorage?.getItem('approvalPending'));
        if (stItem) {
          this.globalSearch = stItem?.filters?.global?.value;
        } else {
          this.globalSearch = this.ds.exception_A_G_S;
        }
      }

    } else if (this.router.url.includes('Create_GRN_inv_list')) {
      this.first = this.ds.create_GRN_page_first;
      this.rows = this.ds.create_GRN_page_row_length;
      this.stateTable = "GRN Creation";
      this.globalSearch = this.ds.createGrn_G_S;
    }
  }

  viewInvoice(e) {
    if (this.router.url.includes('ExceptionManagement')) {
      this.router.navigate([
        `/${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${e.idDocument}`,
      ]);
    } else {
      this.router.navigate([
        `/${this.portalName}/home/comparision-docs/${e.idDocument}`,
      ]);
    }

    this.tagService.createInvoice = true;
    this.tagService.displayInvoicePage = false;
    this.tagService.editable = false;
    this.sharedService.invoiceID = e.idDocument;
    this.tagService.type = 'Invoice';
    this.ExceptionsService.invoiceID = e.idDocument;
  }
  viewInvoiceDetails(e) {
    this.tagService.submitBtnBoolean = false;
    this.ds.documentType = e?.UploadDocTypeCategory?.toLowerCase();
    let route: string;
    if (this.router.url.includes('PO')) {
      route = 'PODetails';
      delete this.ds.editableInvoiceData;
    } else if (this.router.url.includes('GRN')) {
      route = 'GRNDetails';
      delete this.ds.editableInvoiceData;
    } else if (this.router.url.includes('ServiceInvoices')) {
      route = 'serviceDetails';
      this.ds.editableInvoiceData = e;
    } else {
      route = 'InvoiceDetails';
      this.ds.editableInvoiceData = e;
    }
    if (this.userType == 'vendor_portal') {
      this.router.navigate([
        `/vendorPortal/invoice/${route}/${e.idDocument}`,
      ]);
    } else if (this.userType == 'customer_portal') {
      if (e.documentsubstatusID != 30) {
        this.router.navigate([`customer/invoice/${route}/${e.idDocument}`]);
      } else {
        this.router.navigate([`customer/invoice/comparision-docs/${e.idDocument}`]);
      }
    }
    this.tagService.createInvoice = true;
    this.tagService.displayInvoicePage = false;
    this.tagService.editable = false;
    this.sharedService.invoiceID = e.idDocument;
  }

  paginate(event) {
    this.first = event.first;
    if (this.router.url.includes('ExceptionManagement')) {

      if (this.tagService.batchProcessTab != 'normal') {
        this.ds.exc_batch_approve_page_first = this.first;
        this.ds.exc_batch_approve_page_row_length = event.rows;
      } else {
        this.ds.exc_batch_edit_page_first = this.first;
        this.ds.exc_batch_edit_page_row_length = event.rows;

      }
    } else if (this.router.url.includes('Create_GRN_inv_list')) {
      this.ds.create_GRN_page_first = this.first;
      this.ds.create_GRN_page_row_length = event.rows;
    } else if (this.router.url.includes('invoice')) {
      this.fst + 10;
      let evnt = {
        first: this.fst,
        rows: 50
      }
      this.paginate_doc(evnt);
    }
  }

  searchInvoice(value) {
    this.searchInvoiceData.emit(this.allInvoice);
    if (this.router.url.includes('ExceptionManagement')) {
      if (this.router.url.includes('Service_ExceptionManagement')) {
        this.ds.exceptionService_G_S = value;
      } else {
        if (this.tagService.batchProcessTab == 'normal') {
          this.ds.exception_G_S = value;
        } else {
          this.ds.exception_A_G_S = value;
        }
      }

    } else if (this.router.url.includes('Create_GRN_inv_list')) {
      this.ds.createGrn_G_S = value;
    }
  }
  filter(value, dbCl) {
    this.selectedStatus = value;
    // this.ds.allSelected
    if (!this.router.url.includes('invoice')) {
      if (value != 'All') {
        this.allInvoice.filter(value || ' ', dbCl, 'equals')
        this.first = 0
      } else {
        this.allInvoice.filter(value || ' ', dbCl, 'notContains')
      }
    } else {
      this.filterDoc(value);
    }
  }
  filterDoc(value) {
    this.columnsData = this.FilterData;
    if (value != 'All') {
      this.columnsData = this.columnsData.filter(
        (val) => value == val.docstatus
      );
      this.first = 0
      this.filterDataEmit.emit(this.columnsData);
    } else {
      this.filterDataEmit.emit(this.columnsData);
    }
  }
  columnFilter(text,c_name){
    this.columnsData = this.FilterData;
    this.columnsData = this.columnsData.filter(el=>{
      return el[c_name].toLowerCase().includes(text.toLowerCase());
    })
    this.first = 0;
    this.filterDataEmit.emit(this.columnsData);
  }
  // edit invoice details if something wrong
  editInvoice(e) {
    this.tagService.approval_selection_boolean = false;
    this.ds.documentType = e?.UploadDocTypeCategory?.toLowerCase();
    if (this.router.url.includes('invoice')) {
      this.tagService.submitBtnBoolean = false;
      let route: string;
      if (this.router.url.includes('PO')) {
        route = 'PODetails';
        delete this.ds.editableInvoiceData;
      } else if (this.router.url.includes('GRN')) {
        route = 'GRNDetails';
        delete this.ds.editableInvoiceData;
      } else if (this.router.url.includes('ServiceInvoices')) {
        route = 'serviceDetails';
        this.ds.editableInvoiceData = e;
      } else {
        route = 'InvoiceDetails';
        this.ds.editableInvoiceData = e;
      }
      if (this.userType == 'vendor_portal') {
        this.router.navigate([
          `/vendorPortal/invoice/${route}/${e.idDocument}`,
        ]);
      } else if (this.userType == 'customer_portal') {
        if (e.documentsubstatusID != 30 && route == 'serviceDetails') {
          this.router.navigate([`customer/invoice/${route}/${e.idDocument}`]);
        } else {
          this.router.navigate([`customer/invoice/comparision-docs/${e.idDocument}`]);
        }
      }
      this.tagService.createInvoice = true;
      this.tagService.displayInvoicePage = false;
      this.tagService.editable = false;
      this.sharedService.invoiceID = e.idDocument;
      this.ds.subStatusId = e.idDocumentSubstatus;
      this.ds.statusId = e.documentStatusID
    } else {
      this.ds.editableInvoiceData = e;
      this.ExceptionsService.invoiceID = e.idDocument;
      this.ds.subStatusId = e.idDocumentSubstatus;
      this.tagService.editable = true;
      this.sharedService.invoiceID = e.idDocument;
      this.tagService.documentType = e.UploadDocType;
      this.ds.idDocumentType = e.idDocumentType;
      this.ds.entityID = e.idEntity;
      this.sharedService.selectedEntityId = e.idEntity;
      if (this.router.url == `/${this.portalName}/Create_GRN_inv_list` || this.router.url.includes('GRN_approvals')) {
        this.updatePO(e);
        this.ds.grnWithPOBoolean = false;
      } else if (this.router.url.includes('Service_ExceptionManagement')) {
        this.tagService.submitBtnBoolean = true;
        if (e.documentStatusID == 24) {
          this.tagService.approval_selection_boolean = true;
        }
        this.router.navigate([
          `${this.portalName}/invoice/serviceDetails/${e.idDocument}`,
        ]);
      } else {
        if (this.router.url.includes('approvals')) {
          this.tagService.financeApprovePermission = true;
        }
        this.SpinnerService.show();
        let session = {
          "session_status": false,
          "client_address": JSON.parse(sessionStorage.getItem('userIp'))
        }
        this.ExceptionsService.getDocumentLockInfo(session).subscribe((data: any) => {

          this.SpinnerService.hide();
          if (data.result?.lock_info?.lock_status == 0) {
            this.SpinnerService.show();
            this.ExceptionsService.checkInvStatus(e.docheaderID).subscribe((resp: any) => {
              this.SpinnerService.hide();
              if (resp.result.status == e.documentStatusID && resp.result.substatus == e.documentsubstatusID) {
                if (!this.router.url.includes('approvalPending')) {
                  if (this.permissionService.editBoolean == true) {
                    if (e.documentStatusID == 24) {
                      this.tagService.approval_selection_boolean = true;
                    } else if (e.documentStatusID == 49 || e.documentsubstatusID == 51) {
                      this.tagService.LCM_boolean = true;
                      this.tagService.approval_selection_boolean = true;
                    }
                    if (e.documentsubstatusID == 35) {
                      this.getPOLines(e);
                    } else {
                      if(this.router.url.includes('approvals/ServiceInvoices')){
                        this.router.navigate([
                          `${this.portalName}/invoice/serviceDetails/${e.idDocument}`,
                        ]);
                      } else {
                        this.router.navigate([
                          `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${e.idDocument}`,
                        ]);
                      }

                    }

                    let sessionData = {
                      session_status: true,
                    };
                    // this.ExceptionsService.updateDocumentLockInfo(JSON.stringify(sessionData)).subscribe((data:any)=>{})
                    this.tagService.submitBtnBoolean = true;
                    if (this.tagService.batchProcessTab == 'PODoc') {
                      this.tagService.headerName = 'Edit PO';
                    } else {
                      this.tagService.headerName = 'Edit Invoice';
                    }
                  } else {
                    this.displayResponsivepopup = true;
                    this.confirmText = 'Sorry, you do not have access to edit';
                  }
                } else if (this.router.url.includes('approvalPending')) {
                  // if (this.permissionService.changeApproveBoolean == true) {
                  //   if (e.documentsubstatusID == (29 || 4)) {
                  //     this.ExceptionsService.selectedRuleId = e.ruleID;
                  //     this.router.navigate([
                  //       `${this.portalName}/ExceptionManagement/InvoiceDetails/${e.idDocument}`,
                  //     ]);
                  //   } else {
                  //     this.router.navigate([
                  //       `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${e.idDocument}`,
                  //     ]);
                  //   }
                  //   // this.invoiceListBoolean = false;
                  //   this.tagService.approveBtnBoolean = true;
                  //   this.tagService.headerName = 'Approve Invoice';
                  //   this.tagService.approvalType = e.Approvaltype;
                  // } else {
                  //   this.displayResponsivepopup = true;
                  //   this.confirmText = 'Sorry, you do not have Permission to Approve';
                  // }
                  this.tagService.submitBtnBoolean = true;
                  this.tagService.headerName = 'Edit Invoice';
                  this.tagService.approval_selection_boolean = true;
                  // this.ExceptionsService.selectedRuleId = e?.ruleID;
                  this.router.navigate([
                    `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${e.idDocument}`
                  ]);
                }
              } else {
                this.error("Hey someone already made changes on this document, can you refresh and try again?")
              }
            }, err => {
              this.SpinnerService.hide();
              this.error("Server error");
            })
          } else {
            this.displayResponsivepopup = true;
            this.confirmText = `Sorry, "${data.result.User?.firstName} ${data.result.User?.lastName}" is doing changes for this invoice.`;
          }
        }, err => {
          this.SpinnerService.hide();
          this.error("Please try after sometime");
        });
      }
    }
  }

  getPOLines(e) {
    this.SpinnerService.show();
    this.sharedService.getPO_Lines(e.PODocumentID).subscribe((data: any) => {
      this.SpinnerService.hide();
      this.ds.GRN_PO_Data = [];
      this.ds.grnWithPOBoolean = true;
      this.ds.GRN_PO_Data = data.result;
      this.router.navigate([
        `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${e.idDocument}`,
      ]);
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error")
    })
  }

  clickDrildown(data) {
    this.drillBool = !this.drillBool;
    this.docId = data.idDocument;
    // if(this.router.url.includes('ExceptionManagement')){
    this.drilldownarray = [
      { header: 'Upload Date', field: data.CreatedOn },
      { header: 'PO number', field: data.PODocumentID },
      { header: 'Amount', field: data.totalAmount },
      { header: 'Sender', field: data.sender }
    ]
    // } else if(this.router.url.includes('Create_GRN_inv_list')) {
    //   this.drilldownarray = [
    //     { header: 'Upload Date', field: data.CreatedOn },
    //     { header: 'Entity', field: data.EntityName },
    //     { header: 'Amount', field: data.totalAmount }
    //   ]
    // }


  }
  showSidebar() {
    this.sideBarBoolean.emit(true);
  }
  updatePO(e) {
    this.invoiceID = e.idDocument;
    this.SpinnerService.show();
    this.sharedService.get_poDoc_id(e.PODocumentID).subscribe((data: any) => {
      let bool: boolean;
      let icon;
      let header: string;
      this.sharedService.updatePO(data.result).subscribe((data: any) => {
        if (data.po_status?.toLowerCase() == 'open' && data.po_confirmation_status?.toLowerCase() == 'confirmed') {
          this.permissionService.enable_create_grn = true;
          if (this.router.url.includes('GRN_approvals')) {
            this.router.navigate([
              `${this.portalName}/GRN_approvals/approval_id/${e.idDocument}`,
            ]);
          } else {
            this.router.navigate([
              `${this.portalName}/Create_GRN_inv_list/Inv_vs_GRN_details/${e.idDocument}`,
            ]);
          }
        } else if (data.po_status?.toLowerCase() != 'open') {
          bool = true;
          icon = 'assets/Serina Assets/new_theme/closed_icon.svg';
          header = 'Closed';
          this.confirmText = `PO(${e.PODocumentID}) is closed. \n Please check if entered PO value is correct, if still issue persist, please contact support.`;
        } else if (data.po_status?.toLowerCase() != 'confirmed') {
          bool = true;
          header = 'Amended';
          icon = 'assets/Serina Assets/new_theme/Group 1005.svg';

          this.confirmText = `PO(${e.PODocumentID}) was amended and not confirmed. \n Please ensure the confirmation in the ERP system and then retry.`;
        }

        if (bool) {
          const drf: MatDialogRef<ConfirmationComponent> = this.md.open(ConfirmationComponent, {
            width: '400px',
            height: '300px',
            hasBackdrop: false,
            data: { body: this.confirmText, type: 'poStatus', icon: icon, heading: header }
          })
          drf.afterClosed().subscribe((bool) => {
            if (bool) {
              this.view_GRn();
            }
          })
        }

        this.SpinnerService.hide();
      }, err => {
        this.SpinnerService.hide();
        this.error("Server error");
      })
    }, err => {
      this.error("Server error");
      this.SpinnerService.hide();
    })
  }
  view_GRn() {
    this.permissionService.enable_create_grn = false;
    if (this.router.url.includes('GRN_approvals')) {
      this.router.navigate([
        `${this.portalName}/GRN_approvals/approval_id/${this.invoiceID}`,
      ]);
    } else {
      this.router.navigate([
        `${this.portalName}/Create_GRN_inv_list/Inv_vs_GRN_details/${this.invoiceID}`,
      ]);
    }
  }

  more_opt(event: Event, id) {
    this.invoiceID = id;
    this.isOpen = true;
    let el_id = `more_dp${id}`
    event.stopPropagation();
    document.getElementById(el_id).style.display = 'block';
  }
  close_more(event: Event, id) {
    this.isOpen = false;
    this.invoiceID = id;
    let el_id = `more_dp${id}`;
    event.stopPropagation();
    document.getElementById(el_id).style.display = 'none';
  }

  onScroll() {
    this.fst + 10;
    let evnt = {
      first: this.fst,
      rows: 50
    }
    if (this.router.url.includes('invoice') && !this.isDesktop) {
      this.paginate_doc(evnt);
      console.log('scrolled, Mobile mode');
    } else {
      console.log('Desktop mode');
    }
  }
  paginate_doc(event) {
    this.paginationEvent.emit(event);
  }

  changeStatus(event: Event, id) {
    event.stopPropagation();
    this.SpinnerService.show();
    this.invoiceID = id;
    this.sharedService.invoiceID = id;
    let obj = {
      "documentStatusID": 4,
      "documentsubstatusID": 29
    }
    this.sharedService.changeStatus(obj).subscribe((data: any) => {
      this.success(data.result);
      this.systemCheckEmit.emit("inv");
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }

  triggerBatch(event: Event, id) {
    event.stopPropagation();
    const drf: MatDialogRef<ConfirmationComponent> = this.md.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: 'Are you sure you want to re-trigger the batch for the Invoice?', type: 'confirmation', heading: 'Confirmation', icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
    })

    drf.afterClosed().subscribe((bool) => {
      if (bool) {
        this.triggerBoolean = true;
        let query = `?re_upload=false`;
        this.invoiceID = id;
        this.sharedService.invoiceID = id;
        if (this.router.url.includes('ServiceInvoices')) {
          this.serviceBatch();
        } else {
          this.vendorInvoiceBatch(query);
        }
      }
    })
  }
  vendorInvoiceBatch(query) {
    this.sharedService.syncBatchTrigger(query).subscribe((data: any) => {
      let sub_status = null;

      if (data) {
        this.triggerBoolean = false;
        for (const el of data[this.invoiceID]?.complete_status) {
          if (el.status == 0) {
            sub_status = el.sub_status;
          }
        };
      }
      if (sub_status != 1) {
        // window.location.reload();
        this.systemCheckEmit.emit("inv");
      } else {
        this.error("Hey, we are facing some issue so, our technical team will handle this Document")
      }
    }, (error => {
      this.triggerBoolean = false;
    }))
  }
  serviceBatch() {
    this.sharedService.serviceSubmit().subscribe((data: any) => {
      this.triggerBoolean = false;
      this.systemCheckEmit.emit("ser");
    }, err => {
      this.error("Server error");
      this.triggerBoolean = false;
    })
  }

  viewStatusPage(event: Event, e) {
    event.stopPropagation();
    this.sharedService.invoiceID = e.idDocument;
    this.router.navigate([`${this.portalName}/invoice/InvoiceStatus/${e.idDocument}`]);
  }
  checkStatus(event: Event, e) {
    event.stopPropagation();
    this.SpinnerService.show();
    let urlStr = ''
    if (this.router.url.includes('payment-details-vendor')) {
      urlStr = 'InvoicePaymentStatus';
    } else {
      urlStr = 'InvoiceStatus';
    }
    this.sharedService.checkInvStatus(e.idDocument, urlStr).subscribe((data: any) => {

      if (urlStr == 'InvoiceStatus') {
        this.statusText = data.Message;
        if (data.IsPosted == 'Yes') {
          this.statusText1 = 'Posted to ERP'
        } else {
          this.statusText1 = 'Not Posted to ERP'
        }
      } else {
        this.statusText = data['Payment Status'];
        this.statusText1 = `Payment date : ${data['Payment Date']}`;
      }
      this.checkstatusPopupBoolean = true;
      this.SpinnerService.hide();
    }, (err) => {
      this.SpinnerService.hide();
      this.error("Server error")
    })
  }
  refreshPO(e: Event, id) {
    e.stopPropagation();
    this.SpinnerService.show();
    this.sharedService.updatePO(id).subscribe((data: any) => {
      this.SpinnerService.hide();
      this.success("PO data updated.")
      this.systemCheckEmit.emit("PO");
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }

  success(msg) {
    this.alertService.success_alert(msg);
  }
  error(msg) {
    this.alertService.error_alert(msg);
  }
  onPageChange(number: number) {
    this.pageNumber = number;
    this.fst + 10;
    let evt = {
      first: this.fst,
      rows: 50,
      pageNumber: number
    }
    this.paginationEvent.emit(evt);
    if (this.router.url.includes('allInvoices')) {
      this.ds.invTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('PO')) {
      this.ds.poTabPageNumber = this.pageNumber;
    } else if (this.router.url == `/${this.portalName}/invoice/GRN`) {
      this.ds.grnTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('archived')) {
      this.ds.arcTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('rejected')) {
      this.ds.rejTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('ServiceInvoices')) {
      this.ds.serviceTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('ExceptionManagement')) {
      this.ds.excTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('Create_GRN_inv_list')) {
      this.ds.crGRNTabPageNumber = this.pageNumber;
    } else if (this.router.url.includes('GRN_Approvals')) {
      this.pageNumber = this.ds.aprTabPageNumber = this.pageNumber;
    }
  }
  getRowsData() {

    if (this.router.url.includes('allInvoices')) {
      this.first = this.ds.allPaginationFirst;
      this.rows = this.ds.allPaginationRowLength;
      this.stateTable = 'allInvoices';
      let stItem: any = JSON.parse(sessionStorage?.getItem('allInvoices'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      } else {
        this.globalSearch = this.ds.invoiceGlobe;
      }
    }
    else if (this.router.url.includes('PO')) {
      this.first = this.ds.poPaginationFirst;
      this.rows = this.ds.poPaginationRowLength;
      this.stateTable = 'PO';
      let stItem: any = JSON.parse(sessionStorage?.getItem('PO'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      }
    }
    else if (this.router.url.includes('GRN') && !this.router.url.includes('GRNExceptions')) {
      this.first = this.ds.GRNPaginationFirst;
      this.rows = this.ds.GRNPaginationRowLength;
      this.stateTable = 'GRN';
      let stItem: any = JSON.parse(sessionStorage?.getItem('GRN'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      }
    }
    else if (this.router.url.includes('GRN') && this.router.url.includes('GRNExceptions')) {
      this.first = this.ds.GRNExceptionPaginationFisrt;
      this.rows = this.ds.GRNExceptionPaginationRowLength;
      this.stateTable = 'GRNE';
      let stItem: any = JSON.parse(sessionStorage?.getItem('GRNE'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      }
    }
    else if (this.router.url.includes('archived')) {
      this.first = this.ds.archivedPaginationFirst;
      this.rows = this.ds.archivedPaginationRowLength;
      this.stateTable = 'Archived';
      let stItem: any = JSON.parse(sessionStorage?.getItem('Archived'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      }
    }
    else if (this.router.url.includes('rejected')) {
      this.first = this.ds.rejectedPaginationFirst;
      this.rows = this.ds.rejectedPaginationRowLength;
      this.stateTable = 'rejected';
      let stItem: any = JSON.parse(sessionStorage?.getItem('rejected'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      }
    }
    else if (this.router.url.includes('ServiceInvoices')) {
      this.first = this.ds.servicePaginationFirst;
      this.rows = this.ds.servicePaginationRowLength;
      this.stateTable = 'Service';
      let stItem: any = JSON.parse(sessionStorage?.getItem('Service'));
      if (stItem) {
        this.globalSearch = stItem?.filters?.global?.value;
      } else {
        this.globalSearch = this.ds.serviceGlobe;
      }
    }
  }
  erpDownload(event: Event, e) {
    event.stopPropagation();
    let apiParam = `?ismail=false&doc_id=${e.idDocument}`
    this.SpinnerService.show();
    this.sharedService.ERPReportDownload(apiParam).subscribe((data: any) => {
      this.SpinnerService.hide();
      this.sharedService.csvDownload(data);
      this.success("Dear User, The Report downloaded successfully.");
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }

}
