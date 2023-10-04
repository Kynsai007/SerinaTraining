import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { TaggingService } from './../../../services/tagging.service';
import {
  Component,
  EventEmitter,
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
import { MessageService } from 'primeng/api';

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
  @Input() ColumnLength;
  @Output() public searchInvoiceData: EventEmitter<any> =
    new EventEmitter<any>();

  showPaginator: boolean;
  // columnsToDisplay =[];
  _selectedColumns: any[];
  visibleSidebar2;
  cols;
  status = {};

  @ViewChild('allInvoice', { static: true }) allInvoice: Table;
  hasSearch: boolean = false;
  statusId: any;
  displayStatus: any;
  previousAvailableColumns: any[];
  select: any;
  userType: string;
  first = 0;
  last: number;
  rows;
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
  exceptionAlertdate:any;
  isDesktop: boolean;
  drilldownarray = [];
  drillBool: boolean;
  docId: any;

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
    private MessageService: MessageService
  ) { }

  ngOnInit(): void {
    this.ap_boolean = this.ds.ap_boolean;
    this.initialData();
    this.dateFunc();
  }
  dateFunc(){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 4);

    // Extract the year, month, and day from the resulting date
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
    let day = currentDate.getDate();

    // Format the date as desired (e.g., "YYYY-MM-DD")
    let date:any = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    let normalDate = new Date(date);
    this.exceptionAlertdate = normalDate.toISOString();
}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.columnsData && changes.columnsData.currentValue && changes.columnsData.currentValue.length > 0) {

    let mergedStatus = ['All'];
    let columnsData = changes?.columnsData?.currentValue;
    setTimeout(() => {
      columnsData.forEach(ele => {
        if(ele.documentsubstatusID == 40 || ele.documentsubstatusID == 32){
          ele.status = ele.substatus;
        }
        mergedStatus.push(ele.status)
      })
      this.statusData = new Set(mergedStatus);
    }, 500);
    // if (this.router.url.includes('ExceptionManagement')) {
    //   this.filter('All', 'status');
    // }
    if(!this.isDesktop){
      this.showPaginatorAllInvoice = false;
    }
    // }
  }
  initialData() {
    this.userType = this.authService.currentUserValue['user_type'];
    this.isDesktop = this.ds.isDesktop;
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
    // this.getColumnData();
    if (this.columnsData) {
      // if(this.columnsData.length > 10){

      //   this.showPaginator = true;
      // }
      if (this.statusId) {
        this.displayStatus = this.status[this.statusId];
      }
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
    }
  }

  searchInvoice(value) {
    this.searchInvoiceData.emit(this.allInvoice);
    if (this.router.url.includes('ExceptionManagement')) {
      if (this.tagService.batchProcessTab == 'normal') {
        this.ds.exception_G_S = value;
      } else {
        this.ds.exception_A_G_S = value;
      }
    } else if (this.router.url.includes('Create_GRN_inv_list')) {
      this.ds.createGrn_G_S = value;
    }
  }
  filter(value, dbCl) {
    this.selectedStatus = value;
    // this.ds.allSelected
    if (value != 'All') {
      this.allInvoice.filter(value || ' ', dbCl, 'contains')

      this.first = 0
    } else {
      this.allInvoice.filter(value || ' ', dbCl, 'notContains')
    }
  }

  // edit invoice details if something wrong
  editInvoice(e) {
    this.ds.editableInvoiceData = e;
    this.ExceptionsService.invoiceID = e.idDocument;
    this.tagService.editable = true;
    this.sharedService.invoiceID = e.idDocument;
    this.tagService.documentType = e.UploadDocType;
    this.ds.idDocumentType = e.idDocumentType;
    if (this.router.url == `/${this.portalName}/Create_GRN_inv_list`) {
      this.ds.grnWithPOBoolean = false;
      this.router.navigate([
        `${this.portalName}/Create_GRN_inv_list/Inv_vs_GRN_details/${e.idDocument}`,
      ]);
    } else {
      this.SpinnerService.show();
      let session = {
        "session_status": false,
        "client_address": JSON.parse(sessionStorage.getItem('userIp'))
      }
      this.ExceptionsService.getDocumentLockInfo(session).subscribe((data: any) => {
        this.SpinnerService.hide();
        if (data.result?.lock_info?.lock_status == 0) {
          this.ExceptionsService.checkInvStatus().subscribe((resp:any)=>{
            if(resp.result.status == e.documentStatusID && resp.result.substatus == e.documentsubstatusID ) {
          if (this.tagService.batchProcessTab == 'normal' || this.tagService.batchProcessTab == 'PODoc') {
            if (this.permissionService.editBoolean == true) {
              if (e.documentsubstatusID == 8 ||
                e.documentsubstatusID == 16 ||
                e.documentsubstatusID == 17 ||
                e.documentsubstatusID == 33 ||
                e.documentsubstatusID == 21 ||
                e.documentsubstatusID == 27 ||
                e.documentsubstatusID == 35 ||
                e.documentsubstatusID == 75) {
                  if(this.tagService.batchProcessTab == 'PODoc'){
                    this.router.navigate([
                      `${this.portalName}/ExceptionManagement/batchProcess/SO_generate/${e.idDocument}`,
                    ]);
                  } else {
                    if(e.documentsubstatusID == 35){
                      this.getPOLines(e);
                    } else {
                      this.router.navigate([
                        `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${e.idDocument}`,
                      ]);
                    }
                  }
                
              } else {
                this.ExceptionsService.selectedRuleId = e.ruleID;
                this.router.navigate([
                  `${this.portalName}/ExceptionManagement/InvoiceDetails/${e.idDocument}`,
                ]);
                this.ds.entityID = e.idEntity;
                this.sharedService.selectedEntityId = e.idEntity;
                if (e.documentsubstatusID == 29) {

                } else if (e.documentStatusID == 24) {
                  this.tagService.approval_selection_boolean = true;
                } else if (e.documentStatusID == 49 || e.documentsubstatusID == 51) {
                  this.tagService.LCM_boolean = true;
                  this.tagService.approval_selection_boolean = true;
                }
              }
              // this.invoiceListBoolean = false;
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
          } else if (this.tagService.batchProcessTab == 'editApproveBatch') {
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
            this.ds.entityID = e.idEntity;
            this.sharedService.selectedEntityId = e.idEntity;
            // this.ExceptionsService.selectedRuleId = e?.ruleID;
            this.router.navigate([
              'customer/ExceptionManagement/InvoiceDetails/' + e.idDocument,
            ]);
          }
        } else {
          this.alertService.errorObject.detail = "Hey someone already made changes on this document, can you refresh and try again?"
          this.MessageService.add(this.alertService.errorObject);
        }
      })
        } else {
          this.displayResponsivepopup = true;
          this.confirmText = `Sorry, "${data.result.User?.firstName} ${data.result.User?.lastName}" is doing changes for this invoice.`;
        }
      }, err => {
        this.SpinnerService.hide();
        this.alertService.errorObject.detail = "Please try after sometime"
        this.MessageService.add(this.alertService.errorObject);
      });
    }
  }

  getPOLines(e){
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
      this.alertService.errorObject.detail = "Server error";
      this.MessageService.add(this.alertService.errorObject);
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
}
