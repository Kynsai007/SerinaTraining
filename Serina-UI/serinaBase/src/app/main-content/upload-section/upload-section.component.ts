import { PermissionService } from 'src/app/services/permission.service';
import { ServiceInvoiceService } from './../../services/serviceBased/service-invoice.service';
import { AlertService } from './../../services/alert/alert.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { SharedService } from 'src/app/services/shared.service';
import { TaggingService } from 'src/app/services/tagging.service';
import { DocumentService } from 'src/app/services/vendorPortal/document.service';
import { environment } from 'src/environments/environment';
import { WebSocketService } from 'src/app/services/ws/websocket.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { DatePipe } from '@angular/common';
import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutoComplete } from 'primeng/autocomplete';
import { PopupComponent } from 'src/app/base/popup/popup.component';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// declare var EventSourcePolyfill: any;
export interface getApproverData {
  EntityID: number,
  EntityBodyID?: number,
  DepartmentID?: number,
  categoryID?: number,
  approver?: any[],
  description?: string
}

@Component({
  selector: 'app-upload-section',
  templateUrl: './upload-section.component.html',
  styleUrls: ['./upload-section.component.scss'],
})
export class UploadSectionComponent implements OnInit {
  apiVersion = environment.apiVersion;
  progress: number;
  invoiceUploadDetails: string | Blob;
  selectedPONumber: any;
  OCRInput: string;
  OcrProgress: number;
  progressEvent;
  progressText: string = '...initializing';
  updateData: {};
  progressWidth: string;
  uplaodInvoiceDialog: boolean;
  progressbar: number;

  processStage = '';

  public uploader: FileUploader = new FileUploader({
    isHTML5: true,
  });
  public hasBaseDropZoneOver: boolean = false;
  isDown: boolean = false;
  isuploadable: boolean = true;
  url: any;
  dragfile: boolean;
  name: any;
  type: any;
  size: any;
  isPdf: boolean;
  showInvoice: any;
  response: string;
  poNumbersList: any[];
  filteredPO = [];
  displaySelectPdfBoolean: boolean;
  vendorAccountId: number;
  vendorAccountName: any;
  vendorAccount = [];
  vendorAccountByEntity = [];
  selectedVendor: any;

  tabs = [];
  selected = new FormControl(0);
  tabtitle: string = '';
  isCustomerPortal: boolean;
  filteredVendors = [];
  tabData = [];
  entirePOData = [];
  evtSource: any;
  entity: any;
  selectedEntityId: any;
  GRNUploadID: any;
  reuploadBoolean: boolean;
  seconds: string = "00";
  minutes: string = "00";
  poTypeBoolean: boolean;
  mutliPODailog = false;
  LCMBoolean = 'No';

  rangeDates: Date[];
  minDate: Date;
  maxDate: Date;

  summaryColumnField = [];
  summaryColumnHeader = [];
  customerSummary: any;
  showPaginatorSummary: boolean;
  totalSuccessPages: any;
  totalInvoices: any;

  summaryColumn = [
    { field: 'PONumber', header: 'PO Number' },
    { field: 'POLineDescription', header: 'PO Description' },
    { field: 'POLineNumber', header: 'PO LineNumber' },
    { field: 'GRNNumber', header: 'GRN Number' },
    { field: 'GRNLineDescription', header: 'GRN Description' },
    { field: 'POLineAmount', header: 'PO UnitPrice' },
    { field: 'ConsumedPOQty', header: 'PO Qty' },
    { field: 'GRNLineAmount', header: 'GRN Line Amount' },
    { field: 'GRNQty', header: 'GRN Qty' },

  ];
  multiBtn = "Submit"
  ColumnLengthVendor: number;

  filteredPOLines: any[];
  poLineData = [];
  selectedPOlinevalue: any;
  GRNLineData = [];
  GRNData = []
  filteredGRN: any[];
  UniqueGRN = [];
  selectedGRNValue: any;
  mutliplePOTableData = [];
  @ViewChild('multiPO') multiPO: NgForm;
  PO_amount_line: number;
  PO_qty: any;
  GRN_amount_line: number;
  GRN_qty: any;
  PO_desc_line: any;
  GRN_desc_line: any;
  selectedVendorID: any;
  multiPO_filepath = '';
  uploadExcelValue: any;
  // filterBool: boolean =  false;
  s_date: any;
  e_date: any;
  @ViewChild('vdropdown') vdropdown: AutoComplete;
  GRN_number: any;

  selectedDepartment: any;
  DepartmentList = [];
  approverDialog: boolean;
  uploadInvoicesListData = [];
  quickUploadTable = [
    { header: "Entity", field: 'EntityName' },
    { header: "Vendor name", field: 'VendorName' },
    { header: "Invoice Type", field: 'invoiceType' },
    { header: "PO Number", field: 'PONumber' },
    { header: "GRN Data", field: 'po_grn_data' },
    { header: "Department", field: 'departmentName' },
    { header: "Invoices", field: 'attchedInvoice' },
    { header: "Supprot Docs", field: 'attchedSupport' },
    { header: "Approvers", field: 'approvers' },
  ]
  @ViewChild('quickUploadForm') quickUploadForm: NgForm;
  preAproveBool: boolean;
  approversSendData: getApproverData[] = [];
  approverList: any;
  approverNameList = [];
  entityName: any;
  selectedApprover: any;
  approverNameListFinal = [];
  invoiceDocList = [];
  invoiceFilename = '';
  supportDocList = [];
  supportFileNamelist = [];
  approvalBoolean: boolean;
  selectedDepartmentID: number;
  approversFinalList = [];
  APIPostData = [];
  touchedApproveBoolean: boolean;
  filteredEnt: any[];
  afVendor: boolean;
  viewType: any;
  userDetails: any;
  isQuickUploadbool: boolean;
  bothOptBoolean: boolean;
  progressBarObj = [
    { statusName: 'Initializing', status: '', percent: '' },
    { statusName: 'Pre-Processing', status: '', percent: '' },
    { statusName: 'Post-Processing', status: '', percent: '' },
    { statusName: 'Completed', status: '', percent: '' },
  ]
  po_grn_list = [];
  po_grn_line_list = [];
  filteredPO_GRN = [];
  DocumentTypes = [];
  document_type: string;
  PO_GRN_Number_line = [];
  slectedPOLineDetails: any;
  currencyList: any[];
  selectedCurrency = '';
  flipBool: boolean;
  isPOFlipped: boolean;
  flipPOData = [];
  UniqueGRNPO: any;
  slctinvoicelimit: boolean = false;
  portal_name = 'vendorPortal';

  selectedOption: string;
  serviceData: any[] = [];
  filteredService: any;
  mergefilteredService: any;
  fulldata: any[] = [];
  filterfulldata: any[] = [];
  finalfiltereddata: any[] = [];
  fileToUpload: any;
  // client: any;
  account_number: number;
  socket: WebSocket;
  inputElement: HTMLInputElement;
  fileContent: string;
  messages = [];
  selectedFile: Blob;
  sp_id: any;
  serviceAccounts: any;
  filteredServiceAccount: any[];
  selectedServiceAccount: any;
  accountsData: any;
  selectedInvoiceType: any;
  selectedEntity: string;
  returnmessage: boolean;
  event: string;
  percentage: any;
  final: string;
  reason: any;
  serviceInvoiceAccess: boolean;
  vendorAccess: boolean;
  selectedCategory = 'credit';
  invNumbersList = [];
  filteredInv: any[];
  returnInvArr = [];
  invTypeArr = [
    { name:'LCM', value:'LCM'},
    { name:'Non-PO', value:'nonPO'},
    { name:'Single PO', value:'singlePO'},
    { name:'Multiple PO', value:'multiPO'}
  ];
  categoryArr = [];

  constructor(
    private http: HttpClient,
    public route: Router,
    private docService: DocumentService,
    private dataService: DataService,
    private spinnerService: NgxSpinnerService,
    private dateFilterService: DateFilterService,
    private alertService: AlertService,
    private tagService: TaggingService,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private serviceProviderService: ServiceInvoiceService,
    private datepipe: DatePipe,
    private webSocketService: WebSocketService,
    private PS: PermissionService,
    private exceptionService: ExceptionsService,
    private mat_dlg: MatDialog
  ) {
    this.exceptionService.getMsg().pipe(take(2)).subscribe((msg) => {
      if (msg == 'normal') {
        this.isPOFlipped = true;
      }
    })
  }

  ngOnInit(): void {
    this.userDetails = this.authenticationService.currentUserValue['userdetails'];
    this.DocumentTypes = this.dataService.configData.documentTypes;
    this.serviceInvoiceAccess = this.dataService?.configData?.serviceInvoices;
    this.vendorAccess = this.dataService?.configData?.vendorInvoices;
    if (!this.vendorAccess && this.serviceInvoiceAccess) {
      this.selectedOption = 'Service';
    } else {
      this.selectedOption = 'Vendor';
    }
    if (this.dataService.ap_boolean) {
      this.document_type = 'Invoice';
    } else {
      this.document_type = 'Purchase Orders'
    }
    this.isCustomerPortal = this.sharedService.isCustomerPortal;
    if (this.isCustomerPortal) {
      this.portal_name = "customer"
    }
    if (this.PS.uploadPermissionBoolean) {
      this.permissions();
    }
    else {
      // alert("Sorry, you don't have access!")
      this.route.navigate([`${this.portal_name}/invoice/allInvoices`]);
    }

  }

  permissions() {
    if (this.userDetails?.uploadOpt == 'Quick Upload' && this.isCustomerPortal) {
      this.viewType = 'quick';
      this.isQuickUploadbool = true;
      this.bothOptBoolean = false;
    } else if (this.userDetails?.uploadOpt == 'Both' && this.isCustomerPortal) {
      this.viewType = 'ideal';
      this.isQuickUploadbool = false;
      this.bothOptBoolean = true;
    } else {
      this.viewType = 'ideal';
      this.isQuickUploadbool = false;
      this.bothOptBoolean = false;
    }
    this.seconds = "00";
    this.minutes = "00";

    this.GRNUploadID = this.dataService.reUploadData?.grnreuploadID;
    this.getEntitySummary();
    this.dateRange();
    this.findColumns();
    if (this.GRNUploadID != undefined && this.GRNUploadID != null) {
      this.reuploadBoolean = true;
      this.vendorAccountId = this.dataService.reUploadData.idVendorAccount;
      this.selectedEntityId = this.dataService.reUploadData.idEntity;
    } else {
      this.reuploadBoolean = false;
    }
  }

  chooseTab(val) {
    this.viewType = val;
  }
  // Set date range
  dateRange() {
    let today = new Date();
    let day = today.getDate()
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    this.s_date = `${year}-${month}-01`;
    this.e_date = `${year}-${month}-${day}`;

    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }
  // display columns
  findColumns() {
    this.summaryColumn.forEach((e) => {
      this.summaryColumnHeader.push(e.header);
      this.summaryColumnField.push(e.field);
    });

    this.ColumnLengthVendor = this.summaryColumn.length;
  }
  clearDates() { }
  filterData(val) {
    let s_date = this.datepipe.transform(val[0], "yyyy-MM-dd");
    let e_date = this.datepipe.transform(val[1], "yyyy-MM-dd");
    //  if(s_date && e_date){
    //   this.filterBool = true;
    //  } else {
    //   this.filterBool = false;
    //  }
    this.readPONumbers(s_date, e_date);
  }

  runEventSource(eventSourceObj) {
    this.evtSource = new EventSource(
      `${environment.apiUrl}/${this.apiVersion
      }/ocr/status/stream?eventSourceObj=${encodeURIComponent(
        JSON.stringify(eventSourceObj)
      )}`
    );
  }

  getEntitySummary() {
    this.serviceProviderService.getSummaryEntity().subscribe((data: any) => {
      let arr = [];
      data?.result?.forEach(ele => {
        ele.EntityName1 = `${ele.EntityName} ${ele.EntityCode ? '-' +ele.EntityCode : ""}`;
        arr.push({ EntityName: ele.EntityName1, idEntity: ele.idEntity })
      })
      this.entity = arr;
    });
  }

  getVendorAccountsData(ent_id) {
    this.docService.readVendorAccountsData(ent_id).subscribe((data: any) => {
      this.vendorAccount = data.result;
    });
  }
  selectType(value) {

    this.entity = '';
    this.displaySelectPdfBoolean = false;
    this.getEntitySummary();
    if (value === 'Service invoice') {
      this.selectedOption = 'Service';
    }
    else if (value === 'Vendor invoice') {
      this.selectedOption = 'Vendor';
    }
  }

  // selectEntity(value){
  //   this.selectedEntityId = value;
  //   this.vendorAccount = [];
  //   this.displaySelectPdfBoolean = false;

  // }
  // onSelectLCM(val) {
  //   if (val == true) {
  //     this.poTypeBoolean = true;
  //     this.LCMBoolean = 'Yes';
  //   } else {
  //     this.poTypeBoolean = false;
  //     this.LCMBoolean = 'No';
  //   }
  // }

  onSelectPOType(val, type) {
    this.selectedInvoiceType = val ;
    if (type == 'ideal') {
      this.LCMBoolean = 'No';
      if (val == 'singlePO' || val == "nonPO") {
        this.poTypeBoolean = true;
      } else if (val == 'LCM') {
        this.poTypeBoolean = true;
        this.LCMBoolean = 'Yes';
      }
      else if (val == 'multiPO') {
        this.poTypeBoolean = false;
        this.readPONumbers(this.s_date, this.e_date);
        if (this.displaySelectPdfBoolean) {
          this.mutliPODailog = true;
          this.multiBtn = 'Submit';
        }
      }
    } else {
      this.LCMBoolean = 'No';
      if (val == 'multiPO') {
        this.poTypeBoolean = false;
        this.readPONumbers(this.s_date, this.e_date);
        this.mutliPODailog = true;
        this.multiBtn = 'Submit';
      } else if (val == 'LCM') {
        this.LCMBoolean = 'Yes';
        this.getCurrency(this.vendorAccountId);
      } else if(val == 'singlePO') {
        this.categoryArr = [
          { name:'Credit', value:'credit'},
          { name:'Returns', value:'returns'},
          { name:'Advance', value:'advance'}
        ]
      } else if(val == 'nonPO') {
        this.categoryArr = [
          { name:'Credit', value:'credit'},
          { name:'Debit', value:'debit'},
          { name:'Advance', value:'advance'}
        ]
      }
    }
  }

  selectEntity(value) {
    this.approversSendData = [];
    this.selectedEntityId = value.idEntity;
    this.sharedService.selectedEntityId = value.idEntity;
    // this.entity.forEach(val => {
    //   if (value == val.idEntity) {
    this.entityName = value.EntityName;
    //   }
    // })
    if (this.isCustomerPortal == true) {
      this.quickUploadForm.controls['vendor'].reset();
      // this.getCustomerVendors();
      this.readDepartment();
      // this.dropdown.show();
      if (this.selectedOption == 'Service') {
        // this.getEntitySummary();
        this.filteredService = '';
        this.getServiceList();
      }
      if (this.selectedOption == 'Vendor') {
        this.selectedVendor = '';
        this.getCustomerVendors();
      }
      let event = {
        query: ''
      }
      this.filterVendor(event);
    } else {
      this.getVendorAccountsData(value.idEntity);
    }

  }

  getCustomerVendors() {
    this.sharedService
      .getVendorsListToCreateNewlogin(`?offset=1&limit=100&ent_id=${this.selectedEntityId}`)
      .subscribe((data: any) => {
        let arr = [];
        data.vendorlist.forEach(ele => {
          ele.VendorName1 = `${ele.VendorName} - ${ele.VendorCode}`;
          arr.push({ VendorName: ele.VendorName1, idVendor: ele.idVendor, is_onboarded: ele.is_onboarded })
        })
        this.vendorAccount = arr;
        // this.filteredVendors = arr;
      });
  }
  getServiceList() {
    this.sharedService
      .getServiceList(this.selectedEntityId)
      .subscribe((data: any) => {
        console.log(data)
        this.filteredService = data.map(element => element.ServiceProvider);
        this.serviceData = data.map(element => element.ServiceProvider);

      });
  }
  onSelectAccountByEntity(val) {
    if (val) {
      this.displaySelectPdfBoolean = true;
    } else {
      this.displaySelectPdfBoolean = false;
    }
    // this.vendorAccountName = val.Account;
    this.vendorAccountId = val;
  }

  // filterVendor(event){
  //   let filtered:any[] = [];
  //   let query = event.filter;
  //   for (let i = 0; i < this.vendorAccount.length; i++) {
  //     let account: any = this.vendorAccount[i];
  //     if (account.VendorName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(account);
  //     }
  //   }
  //   this.vendorAccount = filtered;
  // }

  filterVendor(event) {
    let query = event.query.toLowerCase();
    if (query != '') {
      this.sharedService.getVendorsListToCreateNewlogin(`?offset=1&limit=100&ent_id=${this.selectedEntityId}&ven_name=${query}`).subscribe((data: any) => {
        let arr = [];
        data.vendorlist.forEach(ele => {
          ele.VendorName1 = `${ele.VendorName} - ${ele.VendorCode}`;
          arr.push({ VendorName: ele.VendorName1, idVendor: ele.idVendor, is_onboarded: ele.is_onboarded })
        })
        this.filteredVendors = arr;
      });
    } else {
      this.filteredVendors = this.vendorAccount;
    }
  }
  filterServices(value) {
    let query = value.query.toLowerCase();
    this.filteredService = this.serviceData.filter(
      (service) => service.ServiceProviderName.toLowerCase().includes(query)
    );
  }

  selectVendorAccount_vdr(value) {
    this.vendorAccountId = value;
    if (value) {
      this.displaySelectPdfBoolean = true;
    } else {
      this.displaySelectPdfBoolean = false;
    }
  }

  selectVendorAccount(value) {
    // this.vendorAccountId = value.vendoraccounts[0].idVendorAccount;
    // this.getPONumbers(this.vendorAccountId);
    this.selectedVendorID = value.idVendor;
    this.getAccountsByEntity(value.idVendor);
  }

  getAccountsByEntity(vId) {
    this.sharedService
      .readCustomerVendorAccountsData(vId)
      .subscribe((data: any) => {
        this.vendorAccountByEntity = data.result;
        this.vendorAccountId = this.vendorAccountByEntity[0].idVendorAccount;
        this.getPONumbers(this.vendorAccountId);
        if (this.vendorAccountId && this.viewType == 'ideal') {
          this.displaySelectPdfBoolean = true;
        } else {
          this.displaySelectPdfBoolean = false;
        }
      });
  }
  selectService(value) {
    this.sp_id = value;
    this.selectedServiceAccount = '';

    this.getAccountsByService(this.sp_id);
  }
  getAccountsByService(val) {

    this.sharedService.readServiceAccounts(val, this.selectedEntityId).subscribe((data: any) => {

      this.serviceAccounts = data;

    })
  }


  filterServicesAccount(value) {
    let query = value.query.toLowerCase();
    this.filteredServiceAccount = this.serviceAccounts?.filter(
      (account) => account.Account.toLowerCase().includes(query)
    );

  }
  selectServiceAccount(value) {
    this.selectedServiceAccount = value.Account;
    this.displaySelectPdfBoolean = true;
    this.selectedServiceAccount = value.Account;
    this.webSocketService.userId = this.sharedService.userId;
    this.webSocketService.service_account = this.selectedServiceAccount;
    this.webSocketService.authToken = this.authenticationService.currentUserValue.token;
    this.webSocketService.connectWebsocket();
  }
  getCurrency(vId) {
    this.sharedService.getCurrency(vId).subscribe((data: any) => {
      this.currencyList = data;
      this.selectedCurrency = data[0];
    })
  }
  getPONumbers(id) {
    this.sharedService.getPoNumbers(id).subscribe((data: any) => {
      this.poNumbersList = data;
    })
  }

  filterPOnumber(event) {
    // if(this.filterBool){
    let filtered: any[] = [];
    let query = event.query;

    if (this.poNumbersList?.length > 0) {
      for (let i = 0; i < this.poNumbersList?.length; i++) {
        let PO: any = this.poNumbersList[i];
        if (PO.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(PO);
        }
      }
    }
    // if (filtered.length == 0) {
    //   // filtered.push({idDocument:null,PODocumentID:"PO's not available" })
    //   this.alertService.errorObject.detail = "PO numbers are not available, please select other range.";
    //   this.messageService.add(this.alertService.errorObject);
    // }
    this.filteredPO = filtered;
    // } else {

    // }
  }

  getVendorInvoices(po_num){
    this.sharedService.readVenInvoices(po_num).subscribe((data:any)=>{
      console.log(data);
      this.invNumbersList = data;
    })
  }

  filterInvnumber(event){
    let filtered: any[] = [];
    let query = event.query;

    if (this.invNumbersList?.length > 0) {
      for (let i = 0; i < this.invNumbersList?.length; i++) {
        let inv: any = this.invNumbersList[i];
        if (inv.docheaderID.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(inv);
        }
      }
    }
    this.filteredInv = filtered;
  }

  selectedInv(event){
    this.sharedService.readInvLines(event.docheaderID).subscribe(data=>{
      console.log(data);
      this.popupFun('flip returns',data,'');
    }, err=>{
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
    })
  }

  selectedPO(event) {
    if (this.selectedCategory == 'credit') {
    this.readPOLines(event.PODocumentID);
    } else {
      this.getVendorInvoices(event.PODocumentID);
    }
    this.selectedPONumber = event.PODocumentID;
    this.multiPO.controls['Name'].reset();
    this.multiPO.controls['POLineAmount'].reset();
    this.multiPO.controls['GRN_Name'].reset();
    this.multiPO.controls['GRN_number'].reset();
    this.multiPO.controls['GRNQty'].reset();
    this.multiPO.controls['GRNLineAmount'].reset();
    this.multiPO.controls['ConsumedPOQty'].reset();
  }
  filterPO_GRNnumber(event) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.po_grn_list?.length > 0) {
      for (let i = 0; i < this.po_grn_list?.length; i++) {
        let PO: any = this.po_grn_list[i];
        if (PO.GRNField.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(PO);
        }
      }
    }
    this.filteredPO_GRN = filtered;
  }
  filterEntity(event) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.entity?.length > 0) {
      for (let i = 0; i < this.entity?.length; i++) {
        let ent: any = this.entity[i];
        if (ent.EntityName.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(ent);
        }
      }
    }
    this.filteredEnt = filtered;
  }

  readPONumbers(s_d, e_d) {
    this.spinnerService.show();
    this.sharedService.readPOnumbers(this.selectedEntityId, this.selectedVendorID, s_d, e_d).subscribe((data: any) => {
      this.poNumbersList = data;
      this.spinnerService.hide();
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
      this.spinnerService.hide();
    })
  }

  readPOLines(po_num) {
    this.sharedService.readPOLines(po_num).subscribe((data: any) => {
      this.poLineData = data.PODATA;
      this.UniqueGRN = data?.GRNDATA?.filter((val1, i, a) => a.findIndex(val2 => val2.PackingSlip == val1.PackingSlip) === i);
      this.GRNData = data?.GRNDATA
      // let jsonObj = data?.GRNDATA?.map(JSON.stringify);
      // let uniqeSet = new Set(jsonObj);
      // let unique = Array?.from(uniqeSet)?.map(JSON.parse);

      this.po_grn_list = data?.GRNDATA.filter((val1, index, arr) => arr.findIndex(v2 => ['PackingSlip'].every(k => v2[k] === val1[k])) === index);
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
    })
  }
  addGrnLine(val) {
    this.po_grn_line_list = [];
    val?.value?.forEach(ele => {
      this.GRNData.filter(el => {
        if (ele.PackingSlip == el.PackingSlip) {
          this.po_grn_line_list.push(el)
        }
      });
    })
    let arr = [];
    this.po_grn_line_list?.forEach(val => {
      let ele = `${val.PackingSlip}-${val.POLineNumber}-${val.Name}`;
      arr.push({ PackingSlip: val.PackingSlip, POLineNumber: val.POLineNumber, GRNField: ele });
    })
    this.po_grn_line_list = arr.filter((val1, index, arr) => arr.findIndex(v2 => ['PackingSlip', 'POLineNumber'].every(k => v2[k] === val1[k])) === index);
    this.PO_GRN_Number_line = this.po_grn_line_list;
    if (this.PO_GRN_Number_line.length > 0) {
      this.flipBool = true;
    } else {
      this.flipBool = false;
    }
  }
  filterPOLine(event) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.poLineData?.length > 0) {
      for (let i = 0; i < this.poLineData?.length; i++) {
        let PO: any = this.poLineData[i];
        if (PO.Name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(PO);
        }
      }
    }
    this.filteredPOLines = filtered;
  }

  selectedPOLine(event) {
    this.selectedPOlinevalue = event.Name;
    this.slectedPOLineDetails = event;
    this.UniqueGRNPO = this.GRNData.filter(el => event.LineNumber == el.POLineNumber);
    // let obj = {
    //   PODocumentID : this.selectedPONumber,
    //   Name : event.Name,
    //   PO_line_amount : event.UnitPrice * event.PurchQty,
    //   PurchQty : event.PurchQty
    // }
    // this.multiPO.control.patchValue(obj);
    this.PO_desc_line = event.Name;
    this.PO_amount_line = event.UnitPrice;
    this.PO_qty = event.PurchQty;
    this.multiPO.controls['GRN_Name'].reset();
    this.multiPO.controls['GRN_number'].reset();
    this.multiPO.controls['GRNQty'].reset();
    this.multiPO.controls['GRNLineAmount'].reset();
  }

  filterGRNnumber(event, name) {
    let filtered: any[] = [];
    let query = event.query;

    if (name == 'grn_num') {
      for (let i = 0; i < this.UniqueGRNPO?.length; i++) {
        let PO: any = this.UniqueGRNPO[i];
        if (PO?.PackingSlip?.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(PO);
        }
      }

    } else {
      for (let i = 0; i < this.GRNLineData?.length; i++) {
        let PO: any = this.GRNLineData[i];
        if (PO.Name.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(PO);
        }
      }

    }

    this.filteredGRN = filtered;
  }
  selectedGRN(event, name) {
    if (name == 'grn_num') {
      this.GRN_number = event.PackingSlip;
      this.GRNLineData = this.GRNData.filter(ele => (ele.PackingSlip === event.PackingSlip) && (ele.POLineNumber == this.slectedPOLineDetails.LineNumber));
      this.multiPO.controls['GRN_Name'].reset();
    } else {
      this.GRN_desc_line = event.Name;
      this.GRN_amount_line = event.Price * event.Qty;
      this.GRN_qty = event.Qty;
    }
    // let obj = {
    //   GRN_Name : event.Name,
    //   GRN_line_amount : event.UnitPrice * event.Qty,
    //   Qty : event.Qty
    // }
    // this.multiPO.control.patchValue(obj);

  }

  addMultiPOLines(value) {
    let obj = {
      "PONumber": this.selectedPONumber,
      "POLineNumber": value.Name.LineNumber,
      "POLineDescription": this.PO_desc_line,
      "GRNNumber": this.GRN_number,
      "GRNLineDescription": this.GRN_desc_line,
      "POLineAmount": this.PO_amount_line,
      "ConsumedPOQty": value.ConsumedPOQty,
      "POremainingQty": value.Name.RemainPurchFinancial,
      "GRNLineAmount": this.GRN_amount_line,
      "GRNQty": this.GRN_qty
    }
    this.mutliplePOTableData.push(obj);
    this.multiPO.resetForm();
  }

  onChange(evt) {
    const formData = new FormData();
    formData.append("file", evt.target.files[0]);
    let data, data1, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      data = XLSX.utils.sheet_to_json(ws);
    };

    reader.readAsBinaryString(target.files[0]);

    reader.onloadend = (e) => {
      this.uploadExcel_multiPO(formData, data)
    }

  }

  uploadExcel_multiPO(file, json_data) {
    this.spinnerService.show();
    this.sharedService.uploadMultiPO(file).subscribe((data: any) => {
      if (data.Result.excelCheck == 1) {
        json_data.forEach(ele => {
          this.mutliplePOTableData.push(ele);
        });
        this.alertService.addObject.detail = data.Result.status_msg;
        this.messageService.add(this.alertService.addObject);
      } else {
        this.alertService.errorObject.detail = data.Result.status_msg;
        this.messageService.add(this.alertService.errorObject);
      }
      // this.mutliPODailog = false;
      // this.poTypeBoolean = true;
      this.spinnerService.hide();
    }, err => {
      this.alertService.errorObject.detail = "Server error"
      this.messageService.add(this.alertService.errorObject);
    })
    // delete this.uploadExcelValue;
  }

  downloadTemplate() {
    this.sharedService.downloadTemplate('').subscribe((data: any) => {
      this.excelDownload(data, 'Multiple PO upload template');
    })
  }
  excelDownload(data, type) {
    let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    let d = new Date();
    let datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    fileSaver.saveAs(blob, `${type}-(${datestring})`);
  }
  editMulti() {
    this.mutliPODailog = true;
    this.multiBtn = 'Update';
    this.readSavedLines();
  }
  readSavedLines() {
    this.spinnerService.show();
    this.sharedService.readSavedLines(this.multiPO_filepath).subscribe((data: any) => {
      this.spinnerService.hide();
    }, err => {
      this.spinnerService.hide();
    })
  }


  submitMultiPO() {
    let query = '';
    if (this.multiPO_filepath != '') {
      query = `?filename=${this.multiPO_filepath}`
    }
    this.sharedService.saveMultiPO(JSON.stringify(this.mutliplePOTableData), query).subscribe((data: any) => {
      this.multiPO_filepath = data.Result;
      this.mutliPODailog = false;
      if (this.viewType == 'ideal') {
        this.poTypeBoolean = true;
      }
      this.alertService.addObject.detail = "Line details data saved."
      this.messageService.add(this.alertService.addObject)
    }, err => {
      this.alertService.errorObject.detail = "Server error"
      this.messageService.add(this.alertService.errorObject);
    })
  }

  onSelectFile(event) {
    let isSupportedFiletype = !!event.target.files[0].name.match(/(.png|.jpg|.pdf|.html|.htm)/);
    if (isSupportedFiletype) {
      this.isuploadable = false;
      this.dragfile = false;
      this.inputElement = event.target as HTMLInputElement;
      this.convertFileToUint8Array(event.target.files[0]);
      this.invoiceUploadDetails = event.target.files[0];
      if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => {
          // called once readAsDataURL is completed
          this.url = event.target.result;
          var img = new Image();
          img.onload = () => { };
        };
      }

      this.fileDataProcess(event);
      for (var i = 0; i < event.target.files.length; i++) {
        this.name = event.target.files[i].name;
        this.type = event.target.files[i].type;
        this.size = event.target.files[i].size;
      }
      this.size = this.size / 1024 / 1024;
    } else {
      this.alertService.errorObject.detail = "Please Upload mentioned file type only";
      this.messageService.add(this.alertService.errorObject);
    }
  }

  cancelSelect() {
    this.invoiceUploadDetails = '';
    this.isuploadable = true;
  }

  // drop file in upload file selection
  fileDrop(event) {
    let isSupportedFiletype = !!event[0].name.match(/(.png|.jpg|.pdf|.html|.htm)/);
    if (isSupportedFiletype) {
      // this.inputElement = event.target as HTMLInputElement;
      this.convertFileToUint8Array(event[0]);
      this.invoiceUploadDetails = event[0];
      this.isuploadable = false;
      this.dragfile = true;

      if (event && event[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(event[0]); // read file as data url

        reader.onload = (event) => {
          // called once readAsDataURL is completed
          this.url = event.target;
        };
      }
      for (var i = 0; i < event.length; i++) {
        this.name = event[i].name;
        this.type = event[i].type;
        this.size = event[i].size;
      }

      this.size = this.size / 1024 / 1024;
      this.fileDataProcess(event);
    } else {
      this.alertService.errorObject.detail = "Please Upload mentioned file type only";
      this.messageService.add(this.alertService.errorObject);
    }
  }

  //file selction from upload file section
  fileSelect(event) {
    this.fileDataProcess(event);
  }

  //file data processing on file selection
  fileDataProcess(event) {
  }

  // identify drop file area
  fileOverBase(event) {
    // this.isuploadable=false;
    this.hasBaseDropZoneOver = event;
  }

  removeQueueLIst(index) {
    this.uploader.queue.splice(index, 1);
    if (this.uploader.queue.length == 0) {
      this.isuploadable = true;
    }
  }

  cancelQueue() {
    this.isuploadable = true;
    this.uploader.queue.length = 0;
    this.OcrProgress = 0;
    this.progress = null;
    if(this.selectedOption == 'Service'){
      this.returnmessage = false;
      this.webSocketService.close();
    } else {
      this.evtSource.close();
    }
  }

  // getPONumbers(id) {
  //   this.sharedService.getPoNumbers(id).subscribe((data: any) => {
  //     console.log(data)
  //     this.poNumbersList = data;
  //   })
  // }

  uploadInvoice() {
    this.seconds = "00";
    this.minutes = "00";
    this.processStage = '0/2 (step 1) : Document uploading initiated';
    this.progress = 1;
    const formData = new FormData();
    formData.append('file', this.invoiceUploadDetails);
    let timer = setInterval(() => {
      if (Number(this.seconds) < 9) {
        this.seconds = "0" + (Number(this.seconds) + 1).toString();
      } else {
        this.seconds = (Number(this.seconds) + 1).toString();
      }
      if (Number(this.seconds) > 59) {
        this.seconds = "00";
        if (Number(this.minutes) < 9) {
          this.minutes = "0" + (Number(this.minutes) + 1).toString();
        } else {
          this.minutes = (Number(this.minutes) + 1).toString();
        }

      }
    }, 1000);
    this.http
      .post(
        `${environment.apiUrl}/${this.apiVersion}/VendorPortal/uploadfile`,
        formData,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
            this.OCRInput = event.body.filepath;
            let filetype = event.body.filetype;
            let filename = event.body.filename;
            this.messageService.add({
              severity: 'success',
              summary: 'File Uploaded',
              detail: 'File Uploaded, OCR Process started Successfully',
            });
            this.processStage =
              '1/2 (step 2): Document upload completed, OCR processing underway.';

            /* OCR Process Starts*/
            this.OcrProgress = 1;
            // this.progressText = document.getElementById("percText");
            // this.progressWidth = document.getElementById("precWidth");
            this.updateData = {};

            const headers = new Headers({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.authenticationService.currentUserValue.token}`,
            });
            // var EventSource = EventSourcePolyfill;
            let eventSourceObj = {
              file_path: this.OCRInput,
              MultiPO_upload: this.multiPO_filepath,
              lcmtype: this.LCMBoolean,
              vendorAccountID: this.vendorAccountId,
              poNumber: '',
              VendoruserID: this.sharedService.userId,
              filetype: filetype,
              filename: filename,
              source: 'Web',
              sender: JSON.parse(sessionStorage.currentLoginUser).userdetails.email,
              entityID: this.selectedEntityId,
              document_type: this.document_type
            };
            this.runEventSource(eventSourceObj);
            let count = 0;
            this.evtSource.addEventListener('update', (event: any) => {
              // Logic to handle status updates
              this.updateData = JSON.parse(event.data);
              this.progressText = this.updateData['status'];
              this.progressBarObj[count].status = 'Passed'
              this.progressBarObj[count].percent = this.updateData['percentage'];
              this.progressWidth = this.updateData['percentage'];
              count = count + 1;
              if (this.progressText == 'ERROR') {
                alert('ERROR');
              }
              // console.log(event)
            });
            this.evtSource.addEventListener('end', (event: any) => {
              this.progressEvent = JSON.parse(event.data);
              clearInterval(timer);
              if (this.progressEvent.InvoiceID) {
                this.selectedPONumber = '';
                this.vendorAccountName = '';
                this.OcrProgress = null;
                this.uplaodInvoiceDialog = false;
                this.invoiceUploadDetails = '';
                this.evtSource.close();
                if (this.progressEvent.InvoiceID) {
                  if (this.isCustomerPortal == false) {
                    this.route.navigate([
                      `vendorPortal/invoice/InvoiceDetails/vendorUpload/${this.progressEvent.InvoiceID}`,
                    ], { queryParams: { uploadtime: this.minutes + ":" + this.seconds } });
                  } else {
                    this.route.navigate([
                      `customer/invoice/InvoiceDetails/CustomerUpload/${this.progressEvent.InvoiceID}`,
                    ], { queryParams: { uploadtime: this.minutes + ":" + this.seconds } });
                  }
                  // this.tagService.createInvoice = true;
                  // this.tagService.invoicePathBoolean = true;
                  this.tagService.documentType = this.progressEvent.UploadDocType;
                  let id: number
                  if (this.document_type == 'Purchase Orders') {
                    id = 1;
                  } else {
                    id = 3
                  }
                  this.dataService.idDocumentType = id;
                  this.dataService.entityID = this.selectedEntityId;
                  this.tagService.isUploadScreen = true;
                  this.tagService.displayInvoicePage = false;
                  this.tagService.editable = true;
                  this.tagService.submitBtnBoolean = true;
                  this.sharedService.invoiceID = this.progressEvent.InvoiceID;
                  this.tagService.headerName = 'Review Invoice';
                }
              } else {
                this.alertService.errorObject.detail =
                  this.progressEvent['status'];
                this.messageService.add(this.alertService.errorObject);
                this.OcrProgress = null;
                this.isuploadable = true;
                this.uplaodInvoiceDialog = false;
                this.invoiceUploadDetails = '';
                this.evtSource.close();
              }
            });
            this.evtSource.onerror = (err) => {
              clearInterval(timer);
              let error = ''
              if(this.progressText == "Duplicate Invoice Uploaded!") {
               error = 'Duplicate Invoice Uploaded!';
              } else {
                error = 'Something went wrong, Plase try again';
              }
                this.messageService.add({
                  severity: 'error',
                  summary: 'error',
                  detail: error,
                });
              
              this.processStage = '';
              this.evtSource.close();
            };
          }
        }),
        catchError((err: any) => {
          clearInterval(timer);
          this.evtSource.close();
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise();

    if (this.OCRInput) {
    }
  }
  readDepartment() {
    this.sharedService.getDepartment().subscribe((data: any) => {
      this.DepartmentList = data.department;
      let deparmrnt_id;
      deparmrnt_id = this.DepartmentList[0]?.idDepartment;
      this.selectedDepartmentID = this.DepartmentList[0]?.idDepartment;
      this.selectedDepartment = this.DepartmentList[0]?.DepartmentName;
      this.approversSendData.push({
        EntityID: this.sharedService.selectedEntityId,
        DepartmentID: deparmrnt_id
      });
      this.checkApprovalStatus();
      // this.readApproverData();
      this.approversSendData[0].DepartmentID = this.DepartmentList[0]?.idDepartment ? this.DepartmentList[0]?.idDepartment : null;
      // this.entityDeptList = this.entityBodyList[0].department
    });
  }
  readApproverData() {
    this.spinnerService.show();
    this.approversSendData[0].approver = [];
    this.approverList = {};
    this.sharedService.invoiceID = 12344;
    this.approverNameList = [];
    this.sharedService.readApprovers(JSON.stringify(this.approversSendData[0])).subscribe((data: any) => {
      let resultData = data?.result
      let array = [];
      let list = [];
      let count = 0;
      for (const item in resultData) {
        count = count + 1;
        list = resultData[item].sort((a, b) => a.userPriority - b.userPriority);
        this.approverList[`${item}_${count}`] = list;
        this.approverNameList.push(resultData[item][0]?.User?.firstName)
        array.push(resultData[item][0]?.User?.idUser);
      }
      this.approversSendData[0].approver = array;
      this.spinnerService.hide();
    }, err => {
      this.spinnerService.hide();
      if (err.status == 403) {
        this.alertService.errorObject.detail = 'Approvers are not available for this combination';
      } else {
        this.alertService.errorObject.detail = 'Server error';
      }
      this.messageService.add(this.alertService.errorObject);

    })

  }
  onSelectDepartment(val) {
    this.DepartmentList.forEach(ele => {
      if (ele.DepartmentName == val) {
        this.approversSendData[0].DepartmentID = ele.idDepartment
        this.selectedDepartmentID = ele.idDepartment;
      }
    })

    this.checkApprovalStatus();
  }
  checkApprovalStatus() {
    let obj = {
      "subRole": 0,
      "EntityID": this.selectedEntityId,
      "DepartmentID": Number(this.selectedDepartmentID),
      "userPriority": 0
    }
    this.sharedService.checkPriority(true, JSON.stringify(obj)).subscribe((data: any) => {

      if (data.status == 1) {
        this.approvalBoolean = true;
        this.readApproverData();
      } else {
        this.approvalBoolean = false;
      }
    })
  }
  addApprovers() {
    this.approverDialog = false;
    this.approverNameListFinal = this.approverNameList;
    this.approversFinalList = this.approversSendData[0].approver;
  }
  onSelectFile_quick(event, type) {
    this.supportFileNamelist = [];
    if (type == 'invoice') {
      for (var i = 0; i < event.target.files?.length; i++) {
        this.invoiceDocList.push(event.target.files[i]);
        this.invoiceFilename = event.target.files[i].name;
        this.slctinvoicelimit = true;
      }
    } else {
      for (var i = 0; i < event.target.files?.length; i++) {
        this.supportDocList.push(event.target.files[i]);
        this.supportFileNamelist.push(event.target.files[i].name);
      }
    }
  }
  onSelectPreaprve(val) {
    if (val) {
      this.touchedApproveBoolean = true;
    } else {
      this.touchedApproveBoolean = false;
    }

  }
  onSelectApprovers(value, index) {
    this.approversSendData[0].approver[index] = value;
    let approver
    let count = 0;
    for (const item in this.approverList) {
      if (count == index) {
        this.approverList[item].forEach(ele => {
          if (ele.User.idUser == value) {
            this.approverNameList[index] = ele.User.firstName;
          }

        })
      }
      count = count + 1;

      // approver = this.approversSendData[0].approver.filter((ele)=> this.approverList[item].User.idUser == ele)
    }
  }
  addInvoiceDetailsToQueue(val) {
    if (this.approvalBoolean) {
      if (this.touchedApproveBoolean || this.approverNameListFinal.length > 0) {
        if (val.invoiceType == 'multiPO') {
          if (this.multiPO_filepath != '') {
            this.addFunction(val)
          } else {
            this.alertService.errorObject.detail = "Please add multiple PO lines.";
            this.messageService.add(this.alertService.errorObject);
          }
        } else {
          this.addFunction(val)
        }

      } else {
        this.alertService.errorObject.detail = "Please select pre-approve or approver names.";
        this.messageService.add(this.alertService.errorObject);
      }
    } else {
      this.addFunction(val)
    }

  }
  addFunction(val) {
    let Approver;
    let po_grn_data = [];
    let pre_approved = false;
    let multiPath = this.multiPO_filepath;
    if (val.preApprove) {
      Approver = "Pre Approved";
      pre_approved = true;
    } else {
      Approver = this.approverNameListFinal

    }
    this.PO_GRN_Number_line?.forEach(el => {
      po_grn_data.push(el.GRNField)
    })
    let obj = {
      EntityName: this.entityName,
      VendorName: val.vendor?.VendorName,
      PONumber: val.PONumber?.PODocumentID,
      invoiceType: val.invoiceType,
      attchedInvoice: this.invoiceFilename,
      attchedSupport: this.supportFileNamelist,
      departmentName: val.departmentName,
      approvers: Approver,
      po_grn_data: po_grn_data
    }
    let APIObj = {
      "ven_acc_id": this.vendorAccountId,
      "invoice_type": val.invoiceType,
      "invoice_category":val?.invoice_category,
      "is_pre_approved": pre_approved,
      "EntityID": val.EntityName?.idEntity,
      "DepartmentID": this.selectedDepartmentID,
      "approver": this.approversFinalList,
      "invoice_name": this.invoiceFilename,
      "po_number": val.PONumber?.PODocumentID,
      "multi_po_path": multiPath,
      "supporting_doc_names": this.supportFileNamelist,
      "po_grn_data": this.PO_GRN_Number_line,
      "Currency": this.selectedCurrency,
      "flippo_data": this.flipPOData,
      "return_lines": this.returnInvArr,
      "up_lt": val.pageLimit
    }
    this.uploadInvoicesListData.push(obj);
    this.APIPostData.push(APIObj);
    this.quickUploadForm.control.reset();
    this.approverNameList = [];
    this.approverNameListFinal = [];
    this.approversFinalList = [];
    this.supportFileNamelist = [];
    this.approvalBoolean = false;
    this.selectedDepartmentID = 0;
    this.touchedApproveBoolean = false;
    this.invoiceFilename = '';
    this.multiPO_filepath = '';
    this.approversSendData = [];
    this.mutliplePOTableData = [];
    this.selectedInvoiceType = '';
    this.selectedCurrency = '';
    this.flipPOData = [];
    this.selectedCategory = 'credit';
  }
  deleteQueue(index, data) {
    if (confirm('Are you sure you want to delete?')) {
      this.APIPostData.splice(index, 1);
      this.uploadInvoicesListData.splice(index, 1);
      this.invoiceDocList.splice(index, 1);
      data.attchedSupport.forEach(ele => {
        let ind = this.supportDocList.findIndex(val => val.name == ele)
        if (ind !== -1) {
          this.supportDocList.splice(ind, 1);
        }
      });
    }

  }
  uploadSigle(val) {
    this.addInvoiceDetailsToQueue(val);
    setTimeout(() => {
      if (this.APIPostData.length > 0) {
        this.uploadAllFiles();
      }
    }, 100);
  }
  uploadAllFiles() {
    const inv_formData: any = new FormData();
    for (const file of this.invoiceDocList) {
      inv_formData.append('invoices', file, file.name);
    }
    for (const file of this.supportDocList) {
      inv_formData.append('supporting_docs', file, file.name);
    }
    inv_formData.append('data', JSON.stringify(this.APIPostData))

    this.spinnerService.show();
    this.sharedService.mutliUpload(inv_formData).subscribe((data: any) => {
      this.alertService.addObject.detail = "Files Uploading process started, please check after some time.";
      this.messageService.add(this.alertService.addObject);
      this.APIPostData = [];
      this.uploadInvoicesListData = [];
      this.invoiceDocList = [];
      this.supportDocList = [];
      this.spinnerService.hide();
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
      this.spinnerService.hide();
    })
  }

  deleteMultiPO(index, data) {
    if (confirm('Are you sure you want to delete?')) {
      this.mutliplePOTableData.splice(index, 1);
    }
  }
  open_dialog_comp(str) {
    this.spinnerService.show();
    this.getPO_lines(str);
  }

  getPO_lines(str) {
    let query = `?po_number=${this.selectedPONumber}`;
    this.exceptionService.getPOLines(query).subscribe((data: any) => {
      this.popupFun(str,data.Po_line_details,this.PO_GRN_Number_line);
      this.spinnerService.hide();
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.messageService.add(this.alertService.errorObject);
      this.spinnerService.hide();
    })
  }

  popupFun(str,poLineData,grn_line){
    const dailogRef: MatDialogRef<PopupComponent> = this.mat_dlg.open(PopupComponent, {
      width: '60%',
      height: '70vh',
      hasBackdrop: false,
      data: { type: str, comp: 'upload', resp: poLineData, grnLine:  grn_line}
    });
    dailogRef.afterClosed().subscribe(result => {
      if(str != 'flip returns'){
        this.flipPOData = result;
      } else {
        this.returnInvArr = result;
      }
    })
  }

  uploadService() {
    this.processStage = 'Invoice uploading initiated';
    this.sendFile();
    this.returnmessage = true;
    const progressUpdates = [];
    this.webSocketService.getMessageSubject().subscribe((message) => {
      this.messages.push(message);
      progressUpdates.push(message);
      const variabletest = JSON.parse(message)
      const events = variabletest.event;

      let index = 0;
      const lastMessageIndex = this.messages.length - 1; // Store the index of the last message.
      const displayInterval = setInterval(() => {
        if (index < this.messages.length) {
          const update = this.messages[index];
          const percentage = JSON.parse(update).percentage;
          const event = JSON.parse(update).event;
          this.progressbar = percentage;
          this.progressText = event;
          if (index === this.messages.length - 1) {
            const lastEvent = JSON.parse(this.messages[lastMessageIndex]).event;
            const lastreason = JSON.parse(this.messages[lastMessageIndex]).reason;
            const doc_id = JSON.parse(this.messages[lastMessageIndex]).doc_id;
            // Check if it's the last event.
            if (lastreason != '') {
              this.messageService.add({
                severity: 'error',
                summary: 'error',
                detail: lastreason,
              });
              this.returnmessage = false;
            }
            if (lastEvent == 'File Processed successfully.') {
              this.messageService.add({
                severity: 'success',
                summary: 'File Uploaded',
                detail: lastEvent,
              });
              this.route.navigate([
                `customer/invoice/InvoiceDetails/CustomerUpload/${doc_id}`,
              ]);
              this.tagService.isUploadScreen = true;
              this.tagService.displayInvoicePage = false;
              this.tagService.editable = true;
              this.tagService.submitBtnBoolean = true;
              this.sharedService.invoiceID = doc_id;
              this.tagService.headerName = 'Review Invoice';
              this.dataService.idDocumentType = 3;
            }
            this.webSocketService.close();
          }
          index++;

        } else {
          // Stop the interval when all elements have been displayed.
          clearInterval(displayInterval);
        }
      }, 1000);
    });



  }
  convertFileToUint8Array(file: File) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result instanceof ArrayBuffer) {
        const arrayBuffer = event.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        const base64String = new Blob([uint8Array], { type: 'application/pdf' });
        this.selectedFile = base64String;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  sendFile() {
    if (this.selectedFile) {
      this.webSocketService.sendFile(this.selectedFile);
    } else {

      // Handle case where no file is selected

    }
  }
  ngOnDestroy() {
    this.mat_dlg.closeAll();
  }
}
