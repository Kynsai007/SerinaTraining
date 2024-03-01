import { AlertService } from './../../../services/alert/alert.service';
import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { AuthenticationService } from './../../../services/auth/auth-service.service';
import { DataService } from './../../../services/dataStore/data.service';
import { Subscription, throwError } from 'rxjs';
import { PermissionService } from './../../../services/permission.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/services/shared.service';
import { TaggingService } from './../../../services/tagging.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
// import { fabric } from 'fabric';
import { DatePipe, Location } from '@angular/common';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { FormCanDeactivate } from '../../can-deactivate/form-can-deactivate';
import { SettingsService } from 'src/app/services/settings/settings.service';
import IdleTimer from '../../idleTimer/idleTimer';
import * as fileSaver from 'file-saver';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, map, take } from 'rxjs/operators';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CanUploadComponentDeactivate } from '../UnsavedChanges.guard';
import { Calendar } from 'primeng/calendar';
import { HttpEventType } from '@angular/common/http';
import { SupportpdfViewerComponent } from '../supportpdf-viewer/supportpdf-viewer.component';
export interface getApproverData {
  EntityID: number,
  EntityBodyID?: number,
  DepartmentID?: number,
  categoryID?: number,
  approver?: any[],
  description?: string
}
@Component({
  selector: 'app-comparision3-way',
  templateUrl: './comparision3-way.component.html',
  styleUrls: [
    './comparision3-way.component.scss',
    '../../invoice/view-invoice/view-invoice.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Comparision3WayComponent
  extends FormCanDeactivate
  implements OnInit, CanUploadComponentDeactivate {
  // @ViewChild('canvas') canvas;
  zoomX = 1;
  // @ViewChild(PdfViewerComponent, { static: false })
  // private pdfViewer: PdfViewerComponent;

  // @ViewChild('pdfviewer') pdfviewer;
  @ViewChild('form')
  form: NgForm;
  editable: boolean;
  inputData = [];

  mergedArray: any;
  inputDisplayArray = [];
  vendorData = [];
  lineDisplayData: any;
  Itype: string;
  updateInvoiceData: any = [];
  headerName: string;
  editPermissionBoolean: boolean;
  changeApproveBoolean: boolean;
  financeApproveBoolean: boolean;
  fin_boolean: boolean;
  submitBtn_boolean: boolean;
  approveBtn_boolean: boolean;
  innerHeight: number;
  InvoiceHeight: number = 560;
  zoomdata: number = 1;
  showInvoice: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  invoiceID: any;
  routeIdCapture: Subscription;
  byteArray: Uint8Array;
  displayRuleDialog: boolean;
  displayErrorDialog: boolean;
  SelectErrorOption;
  givenErrors = [];
  rejectionComments: string = '';
  rejectReason: any;

  grnCreateBoolean: boolean = false;
  GRNObject = [];
  GRNObjectDuplicate = [];

  isPdfAvailable: boolean;
  userDetails: any;
  showPdf: boolean = true;
  btnText = 'Close';
  selectedPONumber;
  poList = [];
  filteredPO: any[];

  lineCount = [];
  currentTab = 'header';
  lineItems: any;
  inv_itemcode: any;
  po_itemcode: any;
  vendorAcId: any;
  mappedData: any;
  zoomVal: number = 0.8;

  isImgBoolean: boolean;
  financeapproveDisplayBoolean: boolean;
  displayrejectDialog: boolean;
  // lineDescription ="Select Line items";
  timer: any;
  callSession: any;
  invoiceNumber = '';
  vendorName: any;
  isGRNDataLoaded: boolean;
  content_type: any;
  lineTabBoolean: boolean;
  grnLineCount: any;

  rotation = 0;
  addrejectcmtBool: boolean;
  ap_boolean: boolean;
  // poLineData = [];
  isAdmin: boolean;
  GRN_PO_Bool: boolean;
  GRN_PO_Data = [];
  GRN_PO_tags = [
    { TagName: 'Description', linedata: [] },
    { TagName: 'PO Qty', linedata: [] },
    { TagName: 'AmountExcTax', linedata: [] },
    { TagName: 'GRN - Quantity', linedata: [] },
    { TagName: 'UnitPrice', linedata: [] },
    { TagName: 'Actions', linedata: [] }
  ];
  po_grn_list = [];
  po_grn_line_list = [];
  filteredPO_GRN = [];
  GRNData: any;
  PO_GRN_Number_line = [];
  grnEditData = [];
  summaryColumn = [
    { field: 'PackingSlip', header: 'GRN Number' },
    { field: 'GRNField', header: 'GRN Field' },

  ];
  ColumnLengthVendor: number;
  validatePOInvUnit = [];
  validateUnitpriceBool: boolean;
  grnList = [];
  selectedGRNList = [];
  selectedGRNLines = [];
  currentlyOpenedItemIndex = -1;
  GRNTabData: any;
  grnTabDatalength: number;
  batchData: any;
  progressDailogBool: boolean;
  portalName: string;
  GRNDialogBool: boolean;
  headerpop: string;
  descrptonBool = false;
  polineTableData = [
    { TagName: 'LineNumber', linedata: [] },
    { TagName: 'ItemId', linedata: [] },
    { TagName: 'Name', linedata: [] },
    { TagName: 'ProcurementCategory', linedata: [] },
    { TagName: 'PurchQty', linedata: [] },
    { TagName: 'UnitPrice', linedata: [] },
    { TagName: 'DiscAmount', linedata: [] },
    { TagName: 'DiscPercent', linedata: [] }
  ];
  POlineBool: boolean;
  poDocId: any;
  po_num: any;
  subStatusId: any;
  isAmtStr: boolean;
  flipEnabled: boolean;
  partytype: string;
  lineTxt1: string;
  lineTxt2: string;
  docType: number;
  poLinedata = [];
  soLinedata = [];
  lineTable = [
    { header: 'Description', field: 'Description' },
    { header: 'Unit', field: 'Unit' },
    { header: 'Price', field: 'UnitPrice' },
    { header: 'Quantity', field: 'Quantity' },
    { header: 'Amount', field: 'amount' }
  ];
  documentViewBool: boolean;
  isDesktop: boolean;
  APIResponse: any;
  so_id: any;
  isEmpty: boolean;
  filteredPOLine = [];
  isBatchFailed: boolean;
  batch_count = 0;

  sampleLineData = [];
  p_width: string;
  poNumbersList: any;
  vendorId: any;
  activePOId: string;
  poDate: any;
  displayYear;
  minDate: Date;
  maxDate: Date;
  lastYear: number;
  months: string[];
  selectedMonth: string;
  rangeDates: Date;
  filterDataPO: any;
  searchPOArr: any;
  status_arr: any[];
  status_change_op: any;
  rejectModalHeader: string;
  GRNUploadID: any;
  reuploadBoolean: boolean;
  isServiceData: boolean;
  uploadtime: string = "00:00";
  doc_status: string;
  vendorUploadBoolean: boolean;
  pageType: string;
  item_code: any;
  GRN_line_total: number = 0;
  invoice_subTotal: any;
  po_total: number;
  enable_create_grn: boolean;
  uploadCompleted: boolean = true;
  activeGRNId: string;
  filterGRNlist: any[];
  linedata_mobile: any;
  @ViewChild('datePicker') datePicker: Calendar;
  progress: number;
  uploadFileList = [];
  support_doc_list = [];
  approval_selection_boolean: boolean;
  documentTypeId: number;
  documentType: any;
  isLCMInvoice: boolean;
  multiPOBool: boolean;
  isLinenonEditable: boolean;
  supportTabBoolean: boolean;
  isLCMTab: boolean;
  selectionTabBoolean: boolean;
  isLCMCompleted: boolean;
  costAllocation = [];
  allocationFileds = [];
  ERP: string;
  isRejectCommentBoolean: boolean;
  isApproveCommentBoolean: boolean;
  isLCMSubmitBoolean: boolean;
  BtnpopText: string;
  preApproveBoolean = false;
  approval_setting_boolean: boolean;
  DepartmentList: any;
  approversSendData: getApproverData[] = [];
  selectedDepartment: string;

  LCMTable = [
    { name: "Entity", id: 'drp', field: 'EntityName', data: [''] },
    { name: "PO Number", id: 'drp', field: 'PoDocumentId', data: [''] },
    { name: "PO Line Descrption", id: 'drp', field: 'PoLineDescription', data: [''] },
    { name: "Voyage Number", id: 'drp', field: 'VoyageNumber', data: [''] },
    { name: "Charges code", id: 'drp', field: 'CostCategory', data: [''] },
    { name: "Vessel Number", id: 'drp', field: 'AGIVesselNumber', data: [''] },
    { name: "Estimated value", id: 'text', field: 'EstimatedValue', data: [''] },
    { name: "Actualized value", id: 'text', field: 'ActualizedValue', data: [''] },
    { name: "Allocate", id: 'text', field: 'Allocate', data: [''] },
  ]
  LCMDataTable = [];
  approverList: any;
  categoryList: any;
  LCMObj = {
    EntityName: '',
    PoDocumentId: '',
    PoLineDescription: '',
    PoLineNumber: '',
    VoyageNumber: '',
    CostCategory: '',
    EstimatedValue: '',
    ActualizedValue: '',
    AGIVesselNumber: '',
    Allocate: '',
    ContextTableId: '',
    ContextRecId: '',
    MarkupTransRecId: ''
  }

  @ViewChild('LCMLineForm') LCMLineForm: NgForm;
  POlist_LCM = [];
  filteredEnt: any[];
  filteredLCMLines: any[];
  filteredVoyage: any[];
  filteredCost: any[];
  LCMItems = [];
  voyageList: any;
  selectedLCMLine: any;
  selectedVoyage: any;
  selectedEntity: any;
  max_allocation: number;
  est_val: number;
  act_val: number;
  AGIVesselNumber: string;
  selectedCost: any;
  chargeList: any;
  EntityName: any;
  itemId: any;
  lineNumber: any;
  ContextTableId: any;
  ContextRecId: any;
  uploadExcelValue: any;
  MarkupTransRecId: any;
  commentslabelBool = true;
  allocateTotal: number;
  balanceAmount: any;
  invoiceTotal: any;
  entityList: any;
  entityName: any;
  commentsBool: boolean = true;
  selected_GRN_total: number;

  constructor(
    fb: FormBuilder,
    private tagService: TaggingService,
    public router: Router,
    private authService: AuthenticationService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private exceptionService: ExceptionsService,
    private AlertService: AlertService,
    private SpinnerService: NgxSpinnerService,
    private permissionService: PermissionService,
    private dataService: DataService,
    private settingService: SettingsService,
    private SharedService: SharedService,
    private mat_dlg: MatDialog,
    private datePipe: DatePipe
  ) {
    super();
    this.exceptionService.getMsg().pipe(take(2)).subscribe((msg) => {
      if (msg == 'mapping') {
        this.getInvoiceFulldata('');
      }
    })
  }

  ngOnInit(): void {
    this.rejectReason = this.dataService.rejectReason;
    this.ap_boolean = this.dataService.ap_boolean;
    this.GRN_PO_Bool = this.dataService.grnWithPOBoolean;
    this.flipEnabled = true;
    // this.flipEnabled = this.dataService.configData.flipBool;
    this.userDetails = this.authService.currentUserValue;
    this.isDesktop = this.dataService.isDesktop;
    this.documentViewBool = this.isDesktop;
    this.enable_create_grn = this.permissionService.enable_create_grn;
    this.doc_status = this.dataService?.editableInvoiceData?.status;
    this.activatedRoute.queryParams.subscribe(params => {
      this.uploadtime = params.uploadtime;
    })
    // this.sampleLineData = this.exceptionService.lineDataSample;
    if (this.userDetails.user_type == 'vendor_portal') {
      this.portalName = 'vendorPortal';
    } else {
      this.portalName = 'customer'
    }
    this.getEntity();
    this.initialData();
    this.readFilePath();
    this.ERPCostAllocation();
    this.AddPermission();
    this.isAdmin = this.dataService.isAdmin;

  }
  getPdfBool(event) {
    this.isPdfAvailable = event;
  }
  doc_view() {
    this.showPdf = true;
    this.documentViewBool = !this.documentViewBool
  }

  idleTimer(time, str) {
    this.timer = new IdleTimer({
      timeout: time, //expired after 180 secs
      clean: str,
      onTimeout: () => {
        if (this.router.url.includes('comparision-docs')) {
          this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          this.error("Session expired for editing invoice");
        }
      },
    });
  }

  updateSessionTime() {
    let sessionData = {
      session_status: true,
      "client_address": JSON.parse(sessionStorage.getItem('userIp'))
    };
    this.exceptionService
      .updateDocumentLockInfo(JSON.stringify(sessionData))
      .subscribe((data: any) => { });
  }

  initialData() {
    if (
      this.router.url.includes('invoice/InvoiceDetails/vendorUpload') ||
      this.router.url.includes('invoice/InvoiceDetails/CustomerUpload')
    ) {
      this.vendorUploadBoolean = true;
      this.uploadCompleted = false;
    } else {
      this.vendorUploadBoolean = false;
    }
    if (this.router.url.includes('InvoiceDetails') || this.router.url.includes('comparision-docs')) {
      this.Itype = 'Invoice';
      this.readLineItems();
    } else if (this.router.url.includes('PODetails')) {
      this.Itype = 'PO';
    } else if (this.router.url.includes('GRNDetails')) {
      this.Itype = 'GRN';
    } else if (this.router.url.includes('serviceDetails')) {
      this.Itype = 'Service';
    }

    this.routeIdCapture = this.activatedRoute.params.subscribe((params) => {
      this.SharedService.invoiceID = params['id'];
      this.exceptionService.invoiceID = params['id'];
      this.invoiceID = params['id'];
    });
    if (this.router.url.includes('Create_GRN_inv_list') || this.router.url.includes('GRN_approvals') || this.GRN_PO_Bool) {
      if (this.permissionService.GRNPageAccess == true) {
        this.grnCreateBoolean = true;
        this.showPdf = false;
        this.btnText = 'View PDF';
        this.currentTab = 'line';
        if (this.GRN_PO_Bool) {
          this.tagService.headerName = 'Create GRN with PO';
          this.Itype = 'PO';
          this.getInvoiceFulldata_po();
          this.get_PO_GRN_Lines();
        } else {
          if (this.router.url.includes('GRN_approvals')) {
            this.tagService.headerName = 'GRN Approval';
          } else {
            this.tagService.headerName = 'Create GRN with invoice';
          }
          this.readGRNInvData();
          this.Itype = 'Invoice';
        }
        // this.readPOLines();
        // if (this.grnCreateBoolean) {

        // }
      } else {
        alert('Sorry!, you do not have access');
        this.router.navigate(['customer/invoice/allInvoices']);
      }
    } else {
      this.getInvoiceFulldata('');
      // this.getRulesData();
      // this.getPOs();
      // this.readPOLines();
      // this.readErrorTypes();
      // this.readMappingData();
      // this.getGRNtabData()
      if (this.tagService.editable == true && this.grnCreateBoolean == false) {
        this.updateSessionTime();
        this.idleTimer(180, 'Start');
        this.callSession = setTimeout(() => {
          this.updateSessionTime();
        }, 250000);
      }
    }
    // this.onResize();
    // this.Itype = this.tagService.type;
    this.editable = this.tagService.editable;
    this.fin_boolean = this.tagService.financeApprovePermission;
    this.submitBtn_boolean = this.tagService.submitBtnBoolean;
    this.approveBtn_boolean = this.tagService.approveBtnBoolean;
    this.approval_selection_boolean =
      this.tagService.approval_selection_boolean;
    this.isLCMInvoice = this.tagService.LCM_boolean;
    this.documentType = this.tagService.documentType;
    this.documentTypeId = this.dataService.idDocumentType;
    this.headerName = this.tagService.headerName;
    this.userDetails = this.authService.currentUserValue;
    // this.approvalType = this.tagService.approvalType;
    this.financeapproveDisplayBoolean =
      this.settingService.finaceApproveBoolean;
    this.subStatusId = this.dataService.subStatusId;
    this.routeOptions();
    // this.showInvoice = "/assets/New folder/MEHTAB 9497.pdf"
  }

  routeOptions() {
    if (this.documentType == 'lcm' || this.documentType == 'multipo') {
      if (this.documentType == 'multipo') {
        this.multiPOBool = true;
        this.currentTab = "line";
      }
      this.isLinenonEditable = true;
    }

    if (this.approval_selection_boolean == true && this.isLCMInvoice == true) {
      this.supportTabBoolean = false;
      this.isLCMTab = true;
      this.readPONumbersLCM(this.dataService.entityID);
      this.showPdf = false;
      this.btnText = 'View PDF';
      this.currentTab = "LCM";

      // this.selectionTabBoolean = true;
      // this.supportTabBoolean = true;
    } else if (this.approval_selection_boolean == true && this.isLCMInvoice == false) {
      this.readDepartment();
      this.readCategoryData();
      this.showPdf = false;
      this.btnText = 'View PDF';
      this.currentTab = "approver_selection";
      this.selectionTabBoolean = true;
      this.supportTabBoolean = true;
      this.isLCMCompleted = true;

    } else {
      // this.showPdf = true;
      // this.btnText = 'Close';
      this.selectionTabBoolean = false;
    }
  }
  // cost allocation selection based on ERP
  ERPCostAllocation() {
    if (this.ERP == 'JD') {
      this.allocationFileds = [
        { header: 'Element', field: 'Element' },
        { header: 'Business Unit', field: 'costCenter' },
        { header: 'Company Code', field: 'interco' },
        { header: 'Non Vat ItemCodes', field: 'fixedAssetDepartment' },
        { header: 'Vat ItemCode', field: 'fixedAssetGroup' },
        { header: 'Object Code', field: 'mainAccount' },
        { header: 'Element Factor', field: 'elementFactor' },
      ]
    } else if (this.ERP == 'Dynamics') {
      this.allocationFileds = [
        { header: 'Element', field: 'Element' },
        { header: 'Cost Center', field: 'costCenter' },
        { header: 'Product', field: 'product' },
        { header: 'Project', field: 'project' },
        { header: 'Interco', field: 'interco' },
        { header: 'Segments', field: 'segments' },
        { header: 'BSMovements', field: 'bsmovements' },
        { header: 'fixedAssetDepartment', field: 'fixedAssetDepartment' },
        { header: 'fixedAssetGroup', field: 'fixedAssetGroup' },
        { header: 'Main Account', field: 'mainAccount' },
        { header: 'Element Factor', field: 'elementFactor' },
      ]
    } else if (this.ERP == 'SAP') {
      this.allocationFileds = [
        { header: 'Element', field: 'Element' },
        { header: 'Cost Center', field: 'costCenter' },
        { header: 'Product', field: 'product' },
        { header: 'Project', field: 'project' },
        { header: 'Interco', field: 'interco' },
        { header: 'Segments', field: 'segments' },
        { header: 'BSMovements', field: 'bsmovements' },
        { header: 'fixedAssetDepartment', field: 'fixedAssetDepartment' },
        { header: 'fixedAssetGroup', field: 'fixedAssetGroup' },
        { header: 'Main Account', field: 'mainAccount' },
        { header: 'Element Factor', field: 'elementFactor' },
      ]
    }
  }
  AddPermission() {
    if (
      this.permissionService.editBoolean == true &&
      this.permissionService.changeApproveBoolean == false &&
      this.permissionService.financeApproveBoolean == false
    ) {
      this.editPermissionBoolean = true;
    } else if (
      this.permissionService.editBoolean == true &&
      this.permissionService.changeApproveBoolean == true &&
      this.permissionService.financeApproveBoolean == false
    ) {
      this.changeApproveBoolean = true;
    } else if (
      this.permissionService.editBoolean == true &&
      this.permissionService.changeApproveBoolean == true &&
      this.permissionService.financeApproveBoolean == true
    ) {
      this.financeApproveBoolean = true;
    }
  }

  changeTab(val) {
    this.currentTab = val;
    if (val == 'header') {
      this.showPdf = true;
      this.btnText = 'Close';

    } else {
      this.showPdf = false;
      this.btnText = 'View PDF';
    }
    if (this.currentTab === 'support') {
      this.supportTabBoolean = true;

    } else if (this.currentTab === 'approver_selection') {

      this.selectionTabBoolean = true;
      this.supportTabBoolean = true;
    } else {
      this.supportTabBoolean = false;
      this.selectionTabBoolean = false;
    }

    if (this.currentTab == 'LCM') {
      this.isLCMTab = true;
    }
    // if (val == 'line') {
    //   this.lineTabBoolean = true;
    // } else {
    //   this.lineTabBoolean = false;
    // }
  }

  get_PO_GRN_Lines() {
    this.descrptonBool = true;
    this.dataService.GRN_PO_Data.forEach((ele, i) => {
      this.GRN_PO_tags.forEach(tag => {
        if (tag.TagName == 'Description') {
          tag.linedata.push({ Value: ele.Name, old_value: ele.Name, ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: '', tagName: 'Description' })
        } else if (tag.TagName == 'PO Qty') {
          tag.linedata.push({ Value: ele.PurchQty, ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: '', tagName: 'PO Qty' })
        } else if (tag.TagName == 'PO Balance Qty') {
          tag.linedata.push({ Value: ele.RemainInventPhysical, ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: '', tagName: 'PO Balance Qty' })
        } else if (tag.TagName == 'GRN - Quantity') {
          tag.linedata.push({ Value: ele.PurchQty, ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: '', tagName: 'Quantity' })
        } else if (tag.TagName == 'UnitPrice') {
          tag.linedata.push({ Value: ele.UnitPrice, ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: 'Price', tagName: 'UnitPrice' })
        } else if (tag.TagName == 'AmountExcTax') {
          let amount = (ele.UnitPrice * ele.PurchQty).toFixed(2)
          this.GRN_line_total = this.GRN_line_total + Number(amount)
          tag.linedata.push({ Value: amount, ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: '', tagName: 'AmountExcTax' })
        }
        else if (tag.TagName == 'Actions') {
          tag.linedata.push({ Value: '', ErrorDesc: '', idDocumentLineItems: ele.LineNumber, is_mapped: '', tagName: 'Actions' })
        }

      })
    })
    this.lineDisplayData = this.GRN_PO_tags;
    let arr = this.GRN_PO_tags;
    setTimeout(() => {
      arr.forEach((ele1) => {
        if (ele1.TagName == 'GRN - Quantity' || ele1.TagName == 'Description' || ele1.TagName == 'UnitPrice') {
          this.GRNObject.push(ele1.linedata);
        }
        if (ele1.TagName == 'GRN - Quantity') {
          ele1.linedata?.forEach((el) => {
            el.is_quantity = true;
          });
        }
        this.GRNObject = [].concat(...this.GRNObject);
      });
      this.GRNObject.forEach((val) => {
        if (!val.old_value) {
          val.old_value = val.Value;
        }
      });
    }, 100);
    this.grnLineCount = this.lineDisplayData[0]?.linedata;
    this.isGRNDataLoaded = true;
  }

  getInvoiceFulldata_po() {
    this.SpinnerService.show();
    this.inputDisplayArray = [];
    this.SharedService.getInvoiceInfo().subscribe(
      (data: any) => {
        const pushedArrayHeader = [];
        data.ok.headerdata.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        // let inv_num_data: any = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'InvoiceId') || (val.TagLabel == 'bill_number');
        // });
        // this.invoiceNumber = inv_num_data[0]?.Value;
        // let po_num_data = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'PurchaseOrder' || val.TagLabel ==  'PurchId');
        // });
        this.headerDataOrder();
        // this.po_num = po_num_data[0]?.Value;
        this.getPODocId(this.po_num);
        if (data?.ok?.vendordata) {
          this.vendorData = {
            ...data?.ok?.vendordata[0].Vendor,
            ...data?.ok?.vendordata[0].VendorAccount,
            ...data?.ok?.vendordata[0].VendorUser,
          };
          this.vendorName = this.vendorData['VendorName'];
          this.vendorId = this.vendorData['idVendor'];
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  getInvoiceFulldata(str) {
    this.SpinnerService.show();
    this.inputDisplayArray = [];
    // this.lineData = [];
    let serviceName;
    if (this.Itype == 'PO' || this.Itype == 'GRN' || this.Itype == 'Service') {
      this.pageType = "normal";
      serviceName = this.SharedService;
    } else {
      this.pageType = "mapping";
      serviceName = this.exceptionService;
    }
    serviceName?.getInvoiceInfo().subscribe(
      (data: any) => {
        let response;
        if (serviceName == this.SharedService) {
          response = data.ok
        } else {
          response = data;
        }
        if (response?.uploadtime) {
          this.uploadtime = response.uploadtime;
        }

        // this.lineDataConversion();

        this.po_total = response.po_total;
        const pushedArrayHeader = [];
        response.headerdata.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        // let inv_num_data: any = this.inputData.filter(val => {
        //   return val.TagLabel == 'InvoiceId';
        // })
        // this.invoiceNumber = inv_num_data[0]?.Value;
        // let po_num_data = this.inputData.filter((val) => {
        //   return (val.TagLabel == 'PurchaseOrder');
        // });
        // this.po_num = po_num_data[0]?.Value;
        this.headerDataOrder();
        if (this.po_num) {
          this.getPODocId(this.po_num);
          this.getGRNnumbers(this.po_num);
        }
        let vendorData;
        if (this.pageType == 'normal') {
          vendorData = response?.vendordata;
          if (this.Itype == 'PO') {
            let count = 0;
            let array = data.ok.linedata;
            array.forEach((val) => {
              if (val.TagName == 'LineNumber') {
                val.id = 1;
              } else if (val.TagName == 'ItemId') {
                val.id = 2;
              } else if (val.TagName == 'Name') {
                val.id = 3;
              } else if (val.TagName == 'ProcurementCategory') {
                val.id = 4;
              } else if (val.TagName == 'PurchQty') {
                val.id = 5;
              } else if (val.TagName == 'UnitPrice') {
                val.id = 6;
              } else if (val.TagName == 'DiscAmount') {
                val.id = 7;
              } else if (val.TagName == 'DiscPercent') {
                val.id = 8;
              } else {
                count = count + 9;
                val.id = count;
              }
            });
            this.lineDisplayData = array.sort((a, b) => a.id - b.id);
          } else {
            this.lineDisplayData = data.ok.linedata;
            if (this.isDesktop) {
              this.lineDisplayData.unshift({
                TagName: 'S.No',
                idDocumentLineItemTags: 1,
              });

            } else {
              // Get the maximum number of linedata entries across all tags
              const maxLinedataEntries = Math.max(...this.lineDisplayData.map(tag => tag.linedata.length));

              // Iterate through the index of linedata entries
              for (let dataIndex = 0; dataIndex < maxLinedataEntries; dataIndex++) {
                const transformedData: any = [];
                let hasError = false;
                let hasUpdated = false;

                // Iterate through the received data
                this.lineDisplayData.forEach(tag => {
                  const tagName = tag.TagName;
                  const linedata = tag.linedata[dataIndex];
                  const itemData = linedata.DocumentLineItems;

                  // Check if any isError is 1
                  if (itemData.isError === 1) {
                    hasError = true;
                  }
                  if (itemData.IsUpdated === 1) {
                    hasUpdated = true;
                  }

                  // Create an object with the TagName and linedata for the current index
                  const tagObject = {
                    TagName: tagName,
                    linedata: linedata
                  };

                  // Add the tagObject to the transformedData array
                  transformedData.push(tagObject);
                });
                transformedData.hasError = hasError;
                transformedData.hasUpdated = hasUpdated;
                // Add the transformedData array for the current index to the main array
                this.linedata_mobile.push(transformedData);
              }
            }
            if (this.editable) {
              this.lineDisplayData.push({
                TagName: 'Actions',
                idDocumentLineItemTags: 1,
              });
            }
            this.lineDisplayData.forEach((ele) => {
              if (ele.TagName == 'S.No') {
                ele.linedata = this.lineDisplayData[1]?.linedata;
              } else if (ele.TagName == 'Actions') {
                ele.linedata = this.lineDisplayData[1]?.linedata;
              }
            });
          }
        } else {
          vendorData = response?.Vendordata;
          this.lineDisplayData = response.linedata.Result;
          this.lineDisplayData.forEach((element, index, arr) => {
            this.lineCount = arr[0].items
            if (element.tagname == 'Description') {
              element.order = 1;
            } else if (element.tagname == 'Quantity') {
              element.order = 2;
            } else if (element.tagname == 'UnitPrice') {
              element.order = 3;
            } else if (element.tagname == 'Unit') {
              element.order = 4;
            } else if (element.tagname == 'Discount') {
              element.order = 5;
            } else if (element.tagname == 'AmountExcTax') {
              element.order = 6;
            }
          });
          this.lineDisplayData = this.lineDisplayData.sort((a, b) => a.order - b.order);
        }
        if (vendorData) {
          this.isServiceData = false;
          this.vendorData = {
            ...vendorData[0].Vendor,
            ...vendorData[0].VendorAccount,
            ...vendorData[0].VendorUser,
          };
          this.vendorAcId = this.vendorData['idVendorAccount'];
          this.vendorName = this.vendorData['VendorName'];
          this.vendorId = this.vendorData['idVendor'];
        }
        if (response?.servicedata) {
          this.isServiceData = true;
          this.vendorData = {
            ...response.servicedata[0].ServiceAccount,
            ...response.servicedata[0].ServiceProvider,
          };
          this.vendorName = this.vendorData['ServiceProviderName'];
        }
        this.support_doc_list = response?.support_doc?.files;
        if (this.support_doc_list == null) {
          this.support_doc_list = []
        }
        if (str != 'batch') {
          this.SpinnerService.hide();
        }
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }
  lineDataConversion() {
    const originalData = this.lineDisplayData;


    // Function to convert the original data
    function convertData(originalData: any[]): any[] {
      const result: any[] = [];

      originalData.forEach((tag) => {
        const tagItems = tag.items;

        tagItems?.forEach((item) => {
          const itemCode = item?.itemcode;
          const description = item?.linedetails[0]?.invline[0]?.DocumentLineItems.Value;
          const quantity = item.linedetails[0].invline[0].DocumentLineItems.Value;
          const unitPrice = item.linedetails[0].poline[0].Value;

          const invlineRecord = {
            tagName: tag.tagname,
            itemCode,
            invline: [
              {
                DocumentLineItems: item.linedetails[0].invline[0].DocumentLineItems,
                DocumentUpdates: item.linedetails[0].invline[0].DocumentUpdates,
              },
            ],
          };

          const quantityRecord = {
            tagName: 'Quantity',
            itemCode,
            invline: [
              {
                DocumentLineItems: {
                  idDocumentLineItems: item.linedetails[0].invline[0].DocumentLineItems.idDocumentLineItems,
                  ErrorDesc: item.linedetails[0].invline[0].DocumentLineItems.ErrorDesc,
                  Value: quantity,
                  isError: item.linedetails[0].invline[0].DocumentLineItems.isError,
                  itemCode,
                },
                DocumentUpdates: item.linedetails[0].invline[0].DocumentUpdates,
              },
            ],
          };

          const unitPriceRecord = {
            tagName: 'UnitPrice',
            itemCode,
            invline: [
              {
                DocumentLineItems: {
                  idDocumentLineItems: item.linedetails[0].invline[0].DocumentLineItems.idDocumentLineItems,
                  ErrorDesc: item.linedetails[0].invline[0].DocumentLineItems.ErrorDesc,
                  Value: unitPrice,
                  isError: item.linedetails[0].invline[0].DocumentLineItems.isError,
                  itemCode,
                },
                DocumentUpdates: item.linedetails[0].invline[0].DocumentUpdates,
              },
            ],
          };

          const polineRecord = {
            tagName: tag.tagname,
            itemCode,
            poline: [
              {
                idDocumentLineItems: item.linedetails[0].poline[0].idDocumentLineItems,
                Value: description,
                isError: item.linedetails[0].poline[0].isError,
              },
            ],
          };

          const quantityPolineRecord = {
            tagName: 'Quantity',
            itemCode,
            poline: [
              {
                idDocumentLineItems: item.linedetails[0].poline[0].idDocumentLineItems,
                Value: quantity,
                isError: item.linedetails[0].poline[0].isError,
              },
            ],
          };

          const unitPricePolineRecord = {
            tagName: 'UnitPrice',
            itemCode,
            poline: [
              {
                idDocumentLineItems: item.linedetails[0].poline[0].idDocumentLineItems,
                Value: unitPrice,
                isError: item.linedetails[0].poline[0].isError,
              },
            ],
          };

          result.push([invlineRecord, quantityRecord, unitPriceRecord]);
          result.push([polineRecord, quantityPolineRecord, unitPricePolineRecord]);
        });
      });

      return result;
    }

    // Calling the function with the original data
    const convertedData = convertData(originalData);


    this.sampleLineData = convertedData;
  }
  getPOs() {
    this.exceptionService.getInvoicePOs().subscribe(((data: any) => {
      this.poList = data;
    }))
  }

  headerDataOrder() {
    this.inputData.forEach(ele => {
      if (ele.TagLabel == 'VendorName') {
        ele.order = 1
      } else if (ele.TagLabel == 'VendorAddress') {
        ele.order = 2
      } else if (ele.TagLabel == 'PurchaseOrder' || ele.TagLabel == 'PurchId') {
        ele.order = 3
        this.po_num = ele?.Value
      } else if (ele.TagLabel == 'InvoiceId' || ele.TagLabel == 'bill_number') {
        this.invoiceNumber = ele?.Value;
        ele.order = 4
      } else if (ele.TagLabel == 'InvoiceTotal') {
        ele.order = 5
      } else if (ele.TagLabel == 'InvoiceDate') {
        ele.order = 6
      } else if (ele.TagLabel == 'TotalTax') {
        ele.order = 7
      } else if (ele.TagLabel == 'SubTotal') {
        ele.order = 8
        this.invoice_subTotal = ele?.Value;
      } else if (ele.TagLabel == 'PaymentTerm') {
        ele.order = 9
      } else if (ele.TagLabel == 'TRN') {
        ele.order = 10
      } else if (ele.TagLabel == 'DueDate') {
        ele.order = 11
      }
    })
    this.inputData = this.inputData.sort((a, b) => a.order - b.order);
  }

  readGRNInvData() {
    this.SharedService.readReadyGRNInvData().subscribe(
      (data: any) => {
        this.lineDisplayData = data.ok?.linedata;
        this.grnLineCount = this.lineDisplayData[0]?.linedata;
        let dummyLineArray = this.lineDisplayData;
        dummyLineArray.forEach((ele, i, array) => {
          if (ele.TagName == 'Quantity') {
            ele.TagName = 'Inv - Quantity';
            ele.linedata?.forEach((ele2, index) => {
              this.validatePOInvUnit.push({ invoice_itemcode: ele2.invoice_itemcode })
              if (ele.linedata?.length <= ele.grndata?.length) {
                ele.grndata?.forEach((ele3) => {
                  ele.grndata[index].old_value = ele2.Value;
                });
              }
            });
          } else if (ele.TagName == 'UnitPrice') {
            ele.TagName = 'Inv - UnitPrice';
          } else if (ele.TagName == 'Description' || ele.TagName == 'Name') {
            if (ele.linedata?.length > 0) {
              this.descrptonBool = true;
            }
          }
          if (ele.TagName == 'AmountExcTax') {
            ele.TagName = 'Inv - AmountExcTax';
            ele.linedata.forEach(v => {
              this.GRN_line_total = this.GRN_line_total + Number(v.Value)
            })
          }

          setTimeout(() => {
            if (
              ele.TagName == 'Inv - Quantity' &&
              (ele.grndata == null || ele.grndata.length == 0)
            ) {
              array.splice(2, 0, {
                TagName: 'GRN - Quantity',
                linedata: ele.linedata,
              });
              array.splice(7, 0, {
                TagName: 'Comments',
                linedata: ele.linedata,
              });
            } else if (
              ele.TagName == 'Inv - Quantity' &&
              ele.grndata != null &&
              ele.grndata &&
              ele.grndata.length != 0
            ) {
              array.splice(2, 0, {
                TagName: 'GRN - Quantity',
                linedata: ele.grndata,
              });
              array.splice(7, 0, {
                TagName: 'Comments',
                linedata: ele.grndata,
              });
              let poQty = [];
              let poBalQty = [];
              ele.podata.forEach((v) => {
                if (v.TagName == 'PurchQty') {
                  poQty.push(v);
                } else if (v.TagName == 'RemainInventPhysical') {
                  poBalQty.push(v);
                }
              });
              if (poQty.length > 0) {
                array.splice(8, 0, { TagName: 'PO quantity', linedata: poQty });
                // array.splice(9, 0, {
                //   TagName: 'PO balance quantity',
                //   linedata: poBalQty,
                // });
              }
            } else if (
              ele.TagName == 'Inv - UnitPrice' &&
              (ele.grndata == null || ele.grndata.length == 0)
            ) {
              array.splice(4, 0, {
                TagName: 'GRN - UnitPrice',
                linedata: ele.linedata,
              });
            } else if (
              ele.TagName == 'Inv - UnitPrice' &&
              ele.grndata != null &&
              ele.grndata &&
              ele.grndata.length != 0
            ) {
              array.splice(4, 0, {
                TagName: 'GRN - UnitPrice',
                linedata: ele.grndata,
              });
            } else if (
              ele.TagName == 'Inv - AmountExcTax' &&
              (ele.grndata == null || ele.grndata.length == 0)
            ) {
              array.splice(6, 0, {
                TagName: 'GRN - AmountExcTax',
                linedata: ele.linedata,
              });
            } else if (
              ele.TagName == 'Inv - AmountExcTax' &&
              ele.grndata != null &&
              ele.grndata &&
              ele.grndata.length != 0
            ) {
              array.splice(6, 0, {
                TagName: 'GRN - AmountExcTax',
                linedata: ele.grndata,
              });
            }
          }, 10);
        });
        this.lineDisplayData = dummyLineArray;

        setTimeout(() => {
          this.lineDisplayData = this.lineDisplayData.filter((v) => {
            return !(
              v.TagName == 'Inv - AmountExcTax'
            );
          });
        }, 100);
        let arr = dummyLineArray;
        setTimeout(() => {
          arr.forEach((ele1) => {
            if (ele1.TagName.includes('GRN') || ele1.TagName == 'Description') {
              this.GRNObject.push(ele1.linedata);
            }
            if (ele1.TagName == 'GRN - Quantity') {
              ele1.linedata?.forEach((el) => {
                el.is_quantity = true;
              });
            }
            this.GRNObject = [].concat(...this.GRNObject);
          });
          this.GRNObject.forEach((val) => {
            if (!val.old_value) {
              val.old_value = val.Value;
            }
          });
        }, 100);

        const pushedArrayHeader = [];
        data.ok.headerdata.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        let inv_num_data: any = this.inputData.filter(val => {
          return val.TagLabel == 'InvoiceId';
        })
        this.invoiceNumber = inv_num_data[0]?.Value;
        let po_num_data = this.inputData.filter((val) => {
          return (val.TagLabel == 'PurchaseOrder');
        });
        this.headerDataOrder();
        this.po_num = po_num_data[0]?.Value;
        this.getPODocId(this.po_num);
        this.vendorData = {
          ...data.ok.vendordata[0].Vendor,
          ...data.ok.vendordata[0].VendorAccount,
        };
        this.vendorAcId = this.vendorData['idVendorAccount'];
        this.vendorName = this.vendorData['VendorName'];
        this.vendorId = this.vendorData['idVendor'];
        // this.selectedRule = data.ok.ruledata[0].Name;
        // this.poList = data.all_pos;
        this.isGRNDataLoaded = true;
        setTimeout(() => {
          // document.getElementById('grnTable').style.display = 'block';
          this.SpinnerService.hide();
        }, 4000);

      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  readFilePath() {
    this.showInvoice = '';
    this.SpinnerService.show();
    this.exceptionService.readFilePath().subscribe(
      (data: any) => {
        this.content_type = data?.content_type;
        if (data.filepath && data.content_type == 'application/pdf') {
          this.isPdfAvailable = false;
          this.isImgBoolean = false;
          this.byteArray = new Uint8Array(
            atob(data.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: 'application/pdf' })
          );
        } else if (data.content_type == 'image/jpg' || data.content_type == 'image/png') {
          this.isPdfAvailable = false;
          this.isImgBoolean = true;
          this.byteArray = new Uint8Array(
            atob(data.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: data.content_type })
          );
          // this.loadImage();
        } else {
          this.isPdfAvailable = true;
          this.showInvoice = '';
        }
        // this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.error("Server error");
      }
    );
  }

  DownloadPDF() {
    let extension;
    if (this.content_type == 'application/pdf') {
      extension = '.pdf';
    } else if (this.content_type == 'image/jpg') {
      extension = '.jpg';
    } else if (this.content_type == 'image/png') {
      extension = '.png';
    }
    fileSaver.saveAs(this.showInvoice, `${this.vendorName}_${this.invoiceNumber}${extension}`);
  }

  loadImage() {
    if (this.isImgBoolean == true) {
      setTimeout(() => {
        this.zoomVal = 1;
        (<HTMLDivElement>document.getElementById('parentDiv')).style.transform =
          'scale(' + this.zoomVal + ')';

        const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        const ctx = canvas.getContext('2d');
        let image = new Image();
        image.src = this.showInvoice;
        image.onload = function () {
          // Calculate the aspect ratio of the image
          const imageAspectRatio = image.width / image.height;
          // Calculate the aspect ratio of the canvas
          const canvasAspectRatio = canvas.width / canvas.height;

          // Set the dimensions of the image to fit the canvas while maintaining the aspect ratio
          let imageWidth, imageHeight;
          if (imageAspectRatio > canvasAspectRatio) {
            // The image is wider than the canvas, so set the width of the image to the width of the canvas
            // and scale the height accordingly
            imageWidth = canvas.width;
            imageHeight = imageWidth / imageAspectRatio;
          } else {
            // The image is taller than the canvas, so set the height of the image to the height of the canvas
            // and scale the width accordingly
            imageHeight = canvas.height;
            imageWidth = imageHeight * imageAspectRatio;
          }

          // Draw the image on the canvas
          ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
        };


      }, 50);
    }
  }

  onChangeValue(key, value, data) {
    if (key == 'InvoiceTotal' || key == 'SubTotal') {
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true;
      } else {
        this.isAmtStr = false;
      }
    }
    let updateValue = {
      documentDataID: data.idDocumentData,
      OldValue: data.Value || '',
      NewValue: value,
    };
    this.updateInvoiceData.push(updateValue);
  }
  onChangeLineValue(key, value, data) {
    if (key == 'Quantity' || key == 'UnitPrice' || key == 'AmountExcTax') {
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true;
      } else {
        this.isAmtStr = false;
      }
    } else if (key == 'Description') {
      if (value == '') {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    }
    let updateValue = {
      documentLineItemID: data.idDocumentLineItems,
      OldValue: data.Value || '',
      NewValue: value,
    };
    this.updateInvoiceData.push(updateValue);
  }

  saveChanges() {
    if (!this.isAmtStr && !this.isEmpty) {
      if (this.updateInvoiceData.length != 0) {
        this.SharedService.updateInvoiceDetails(
          JSON.stringify(this.updateInvoiceData)
        ).subscribe(
          (data: any) => {
            this.success('Changes saved successfully')
            this.updateInvoiceData = [];
          },
          (err) => {
            this.updateInvoiceData = [];
            this.error("Server error or Please check the data");
          }
        );
      }
    } else {
      this.updateInvoiceData = [];
      let err = ''
      if (this.isAmtStr) {
        err = 'Alphabets not allowed in the Quantity and Amount Fields.';
      } else if (this.isEmpty) {
        err = "'Description' field cannot be empty";
      }
      this.error(err)
      // this.errorTriger('Strings are not allowed in the amount and quantity fields.');
    }
  }
  onSubmitData() {
    // this.SpinnerService.show();
    // this.SharedService.updateInvoiceDetails(JSON.stringify(this.updateInvoiceData)).subscribe((data: any) => {
    //   console.log(data);
    //   if (data.result == 'success') {
    //     this.messageService.add({
    //       severity: "info",
    //       summary: "Updated",
    //       detail: "Updated Successfully"
    //     });
    //     this.getInvoiceFulldata();
    //   } else {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "error",
    //       detail: "Something went wrong"
    //     });
    //   }
    //   this.updateInvoiceData = [];
    //   this.SpinnerService.hide();
    // })
  }

  drawrectangleonHighlight(index) {
    // var rect = new fabric.Rect({
    //   left: 100,
    //   top: 50,
    //   fill: 'rgba(255,0,0,0.5)',
    //   width: 100,
    //   height: 30,
    //   selectable: false,
    //   lockMovementX: true,
    //   lockMovementY: true,
    //   lockRotation: true,
    //   transparentCorners: true,
    //   hasControls: false,
    // });

    // this.canvas[index].add(rect);
    // this.canvas[index].setActiveObject(rect);
    // document.getElementById(index + 1).scrollIntoView();
  }

  zoomin() {
    this.zoomVal = this.zoomVal + 0.2;
    this.zoomX = this.zoomX + 0.05;
    if (this.zoomVal >= 2.0 && this.zoomX >= 2.0) {
      this.zoomVal = 1;
      this.zoomX = 1;
    }
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
  }

  zoomout(index) {
    this.zoomVal = this.zoomVal - 0.2;
    this.zoomX = this.zoomX - 0.05;
    if (this.zoomVal <= 0.5 && this.zoomX <= 0.8) {
      this.zoomVal = 1;
      this.zoomX = 1;
    }
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
  }

  // removeEvents(index) {
  //   this.canvas[index].off('mouse:down');
  //   this.canvas[index].off('mouse:up');
  //   this.canvas[index].off('mouse:move');
  // }

  panning(index) {
    // this.removeEvents(index);
    // let panning = false;
    // let selectable;
    // this.canvas[index].on('mouse:up', (e) => {
    //   panning = false;
    // });

    // this.canvas[index].on('mouse:down', (e) => {
    //   panning = true;
    //   selectable = false;
    // });
    // this.canvas[index].on('mouse:move', (e) => {
    //   if (panning && e && e.e) {
    //     selectable = false;
    //     var units = 10;
    //     var delta = new fabric.Point(e.e.movementX, e.e.movementY);
    //     this.canvas[index].relativePan(delta);
    //   }
    // });
  }

  addVendorDetails() {
  }
  onVerify(e) {
  }
  submitChanges() {
    // if (this.userDetails.user_type == 'customer_portal') {
    //   let submitData = {
    //     "documentdescription": " "
    //   }
    //   this.SpinnerService.show();
    //   this.SharedService.submitChangesInvoice(JSON.stringify(submitData)).subscribe((data: any) => {
    //     this.dataService.invoiceLoadedData = [];
    //     if (data.result) {
    //       this.messageService.add({
    //         severity: "success",
    //         summary: "Updated",
    //         detail: "Updated Successfully"
    //       });
    //       this.SpinnerService.hide();
    //       setTimeout(() => {
    //         this._location.back()
    //       }, 1000);
    //     }
    //   }, error => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "error",
    //       detail: error.error
    //     });
    //     this.SpinnerService.hide();
    //   })
    // } else if (this.userDetails.user_type == 'vendor_portal') {
    //   this.SharedService.vendorSubmit().subscribe((data: any) => {
    //     console.log(data);
    //     this.messageService.add({
    //       severity: "success",
    //       summary: "Uploaded",
    //       detail: "Uploaded to serina successfully"
    //     });
    //     setTimeout(() => {
    //       this.router.navigate(['vendorPortal/invoice/allInvoices']);
    //     }, 1000);
    //   }, error => {
    //     this.messageService.add({
    //       severity: "error",
    //       summary: "error",
    //       detail: error.statusText
    //     });
    //   })
    // }
  }

  // approveChangesManual() {
  //   this.exceptionService.send_manual_approval().subscribe(
  //     (data: any) => {
  //       this.AlertService.addObject.detail =
  //         'Send to Manual approval successfully';
  //       this.messageService.add(this.AlertService.addObject);
  //       this.success("")
  //       setTimeout(() => {
  //         this._location.back();
  //       }, 2000);
  //     },
  //     (error) => {
  //       this.error("Server error");
  //     }
  //   );
  // }

  approveChangesBatch() {
    this.getInvoiceFulldata('batch');
    this.GRNUploadID = this.dataService.reUploadData?.grnreuploadID;
    if (this.GRNUploadID != undefined && this.GRNUploadID != null) {
      this.reuploadBoolean = true;
    } else {
      this.reuploadBoolean = false;
    }
    setTimeout(() => {
      let count = 0;
      let errorType: string;
      let errorTypeHead: string;
      let errorTypeLine: string;
      this.inputData.forEach((data: any) => {
        if (data.TagLabel == 'InvoiceTotal' || data.TagLabel == 'SubTotal') {
          if (data.Value == '' || isNaN(+data.Value)) {
            count++;
            errorTypeHead = 'AmountHeader';
          }
        } else if (
          data.TagLabel == 'PurchaseOrder' ||
          data.TagLabel == 'InvoiceDate' ||
          data.TagLabel == 'InvoiceId'
        ) {
          if (data.Value == '') {
            count++;
            errorType = 'emptyHeader';
          }
        }
      });

      this.lineDisplayData.forEach((element) => {
        if (
          element.tagname == 'Quantity' ||
          element.tagname == 'UnitPrice' ||
          element.tagname == 'AmountExcTax' ||
          element.tagname == 'Amount'
        ) {
          element.items.forEach((ele) => {
            ele.linedetails.forEach((ele1) => {
              if (
                ele1.invline[0]?.DocumentLineItems?.Value == '' ||
                isNaN(+ele1.invline[0]?.DocumentLineItems?.Value)
              ) {
                count++;
                errorTypeLine = 'AmountLine';
              }

              if (element.tagname == 'Quantity') {
                if (
                  ele1.invline[0]?.DocumentLineItems?.Value == 0
                ) {
                  count++;
                  errorTypeLine = 'quantity';
                }
              }
            });
          });
        }
      });
      if (count == 0) {
        this.uploadCompleted = true;
        // this.sendToBatch();
        if (!this.isServiceData) {
          this.vendorSubmit();
        } else {
          this.serviceSubmit();
        }
      } else {
        this.SpinnerService.hide();
        /* Error response starts*/
        if (errorTypeHead == 'AmountHeader') {
          setTimeout(() => {
            this.error("Please verify the 'Sub-Total' and 'Invoice-Total' on the Header")
          }, 50);
        }
        if (errorType == 'emptyHeader') {
          this.error("Please Check the PO Number, Invoice Date, and Invoice-Id fields on the header");
          // this.changeTab('header');
        }
        if (errorTypeLine == 'AmountLine') {
          setTimeout(() => {
            this.error("Please verify the Amount, Quantity, Unit price and Amount-Excluding-Tax on the Line details")
            // this.currentTab = 'line';
          }, 10);
        } else if (errorTypeLine == 'quantity') {
          setTimeout(() => {
            this.error("Please check the 'Quantity' in the Line details")
            // this.currentTab = 'line';
          }, 10);
        }
        /* Error response end*/
      }
    }, 2000);
  }

  sendToBatch() {
    this.exceptionService.send_batch_approval().subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        this.success("Sent to Batch Successfully!");
        this.syncBatch();

      },
      (error) => {
        this.error("Server error");
      }
    );
  }
  vendorSubmit() {
    this.SharedService.vendorSubmit(this.reuploadBoolean, this.uploadtime).subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        if (this.router.url.includes('ExceptionManagement')) {
          this.success("Sent to Batch Successfully!")
        } else {
          if (!this.GRNUploadID) {
            this.success("Uploaded to Serina Successfully!")
          }
        }
        this.syncBatch();

      },
      (error) => {
        this.error("Server error");
      }
    );
  }
  serviceSubmit() {
    this.SharedService.serviceSubmit().subscribe((data: any) => {
      this.success("Sent to Batch Successfully!");
      setTimeout(() => {
        this._location.back();
      }, 1000);
    }, err => {
      this.error("Server error");
    })
  }
  syncBatch() {
    this.SpinnerService.show();
    this.SharedService.syncBatchTrigger(`?re_upload=false`).subscribe((data: any) => {
      this.headerpop = 'Batch Progress'
      this.p_width = '350px';
      this.progressDailogBool = true;
      this.GRNDialogBool = false;
      this.batchData = data[this.invoiceID]?.complete_status;
      let last_msg = this.batchData[this.batchData.length - 1].msg;
      this.isBatchFailed = false;
      if (last_msg == 'Batch ran to an Exception!' || last_msg == 'Matching Failed - Batch Failed' && this.batch_count <= 2) {
        this.batch_count++;
        this.isBatchFailed = true;
      }
      if (!(this.batch_count <= 2)) {
        this.error("Dear User, Kindly check with Serina's support team regarding this invoice.")
        // setTimeout(() => {
        //   this.router.navigate([`${this.portalName}/ExceptionManagement`])
        // }, 2000);
      }
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    });
  }

  routeToMapping() {
    this.exceptionService.invoiceID = this.invoiceID;
    this.tagService.editable = true;
    this.tagService.submitBtnBoolean = true;
    this.tagService.headerName = 'Edit Invoice';
    let sub_status = null;
    for (const el of this.batchData) {
      if (el.status == 0) {
        sub_status = el.sub_status;
      }
    };
    if (!sub_status) {
      sub_status = this.batchData[this.batchData.length - 1].sub_status;
    }
    this.subStatusId = sub_status;
    this.dataService.subStatusId = sub_status;
    if (this.portalName == 'vendorPortal') {
      if ([8, 16, 18, 19, 33, 21, 27].includes(sub_status)) {
        this.processAlert(sub_status);
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    } else {
      if ([8, 16, 17, 18, 19, 33, 21, 27, 75].includes(sub_status)) {
        this.processAlert(sub_status);
      } else if (sub_status == 34) {
        this.update("Please compare the PO lines with the invoices. We generally recommend the 'PO flip' method to resolve issues of this type.")
      } else if (sub_status == 7 || sub_status == 23 || sub_status == 10 || sub_status == 35 || sub_status == 23) {
        this.router.navigate([`${this.portalName}/ExceptionManagement`]);
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    }
    this.progressDailogBool = false;
  }
  processAlert(subStatus: number): void {
    if (subStatus == 18) {
      this.update("Invoice Total and 'Sub-Total+Tax' Mismatch Identified. Kindly check Entry");
    } else if (subStatus == 19) {
      this.update("Dear User, Sub total is not matching with the invoice lines total.");
    } else {
      this.getInvoiceFulldata('');
      this.update("Please check the values in invoice.");
    }

  }

  financeApprove() {
    let desc = {
      "desp": this.rejectionComments
    }
    this.SharedService.financeApprovalPermission(JSON.stringify(desc)).subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.success(data.result);
        this.displayrejectDialog = false;
        setTimeout(() => {
          this._location.back();
        }, 1000);
      },
      (error) => {
        this.error(error.statusText);
        this.displayrejectDialog = false;
      }
    );
  }
  backToInvoice() {
    if (
      !this.router.url.includes('vendorUpload') ||
      !this.router.url.includes('CustomerUpload')
    ) {
      this._location.back();
    } else if (
      this.router.url.includes('vendorUpload') &&
      this.router.url.includes('CustomerUpload') &&
      this.submitBtn_boolean == true
    ) {
      if (
        confirm(
          ` Are you sure you want cancel process ? \n if you click OK you will lost your invoice meta data.`
        )
      ) {
        this._location.back();
      }
    } else {
      this._location.back();
    }
  }
  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   this.innerHeight = window.innerHeight;
  //   if (this.innerHeight > 550 && this.innerHeight < 649) {
  //     this.InvoiceHeight = 500;
  //   } else if (this.innerHeight > 650 && this.innerHeight < 700) {
  //     this.InvoiceHeight = 560;
  //   } else if (this.innerHeight > 750) {
  //     this.InvoiceHeight = 660;
  //   }
  // }
  zoomIn() {
    this.zoomdata = this.zoomdata + 0.1;
  }
  zoomOut() {
    this.zoomdata = this.zoomdata - 0.1;
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }
  textLayerRendered(e: CustomEvent) { }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
  selectedText(): void { }

  // search(stringToSearch: string) {
  //   this.pdfViewer.pdfFindController.executeCommand('find', {
  //     caseSensitive: false,
  //     findPrevious: undefined,
  //     highlightAll: true,
  //     phraseSearch: true,
  //     query: stringToSearch,
  //   });
  // }
  // hightlight(val) {
  //   var pageno = parseInt('1');
  //   var pageView = this.pdfViewer.pdfViewer._pages[pageno - 1];
  //   //datas - array returning from server contains synctex output values
  //   var left = parseInt('530px');
  //   var top = parseInt('660px');
  //   var width = parseInt('50px');
  //   var height = parseInt('20px');
  //   //recalculating top value
  //   top = pageView.viewport.viewBox[3] - top;
  //   var valueArray = [left, top, left + width, top + height];
  //   let rect = pageView.viewport.convertToViewportRectangle(valueArray);
  //   // rect       = PDFJS.disableTextLayer.normalizeRect(rect);
  //   var x = Math.min(rect[0], rect[2]),
  //     width = Math.abs(rect[0] - rect[2]);
  //   var y = Math.min(rect[1], rect[3]),
  //     height = Math.abs(rect[1] - rect[3]);
  //   const element = document.createElement('div');
  //   element.setAttribute('class', 'overlay-div-synctex');
  //   element.style.left = x + 'px';
  //   element.style.top = y + 'px';
  //   element.style.width = width + 'px';
  //   element.style.height = height + 'px';
  //   element.style.position = 'absolute';
  //   element.style.backgroundColor = 'rgba(200,0,0,0.5)';
  //   $('*[data-page-number="' + pageno + '"]').append(element);
  //   this.pdfviewer.pdfViewer._scrollIntoView({
  //     pageDiv: pageView.div,
  //   });
  // }

  // onClick(e) {
  //   const textLayer = document.getElementsByClassName('TextLayer');
  //   const x =
  //     window.getSelection().getRangeAt(0).getClientRects()[0].left -
  //     textLayer[0].getBoundingClientRect().left;
  //   const y =
  //     window.getSelection().getRangeAt(0).getClientRects()[0].top -
  //     textLayer[0].getBoundingClientRect().top;
  // }

  viewPdf() {
    this.showPdf = !this.showPdf;
    if (this.showPdf != true) {
      this.btnText = 'View PDF';
    } else {
      this.btnText = 'Close';
    }
    if (this.isImgBoolean == true) {
      this.loadImage();
    }
  }
  rotate(angle: number) {
    this.rotation += angle;
  }

  filterPO(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.poList.length; i++) {
      let country = this.poList[i];
      if (
        country.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredPO = filtered;
  }

  onSelectPO(value) {
    if (confirm(`Are you sure you want to change PO Number?`)) {
      this.exceptionService.updatePONumber(value.PODocumentID).subscribe(
        (data: any) => {
          this.success("PO Number updated successfully")
          this.getInvoiceFulldata('');
        },
        (error) => {
          this.error("Server error");
        }
      );
    }
  }

  readLineItems() {
    this.exceptionService.readLineItems().subscribe((data: any) => {
      this.lineItems = data.description;
    });
  }
  filterPOLine(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.lineItems.length; i++) {
      let item = this.lineItems[i];
      if (
        item.Value.toLowerCase().includes(query.toLowerCase())
      ) {
        filtered.push(item);
      }
    }
    this.filteredPOLine = filtered;
  }
  readErrorTypes() {
    this.exceptionService.readErrorTypes().subscribe((data: any) => {
      this.givenErrors = data.description;
    });
  }

  lineMapping(val, el, val1) {
    let itemCodeArray = [];
    let presetBoolean: boolean = false;

    this.inv_itemcode = val;
    this.po_itemcode = el;
    this.updateLine();
    // if (itemCodeArray.length > 1) {
    //   presetBoolean = itemCodeArray.includes(el);
    // }
    // if (this.mappedData?.length > 0) {
    //   let presetArray = this.mappedData?.filter((ele1) => {
    //     return ele1.ItemMetaData?.itemcode == el;
    //   });
    //   if (presetArray.length > 0) {
    //     presetBoolean = true;
    //   }
    // }
    // if (presetBoolean) {
    //   if (confirm('Lineitem already mapped, you want to change it again')) {
    //     this.displayErrorDialog = true;
    //   }
    // } else {
    //   itemCodeArray.push(el);
    //   this.displayErrorDialog = true;
    // }
  }

  cancelSelectErrorRule() {
    this.displayErrorDialog = false;
  }

  updateLine() {
    this.exceptionService
      .updateLineItems(
        this.inv_itemcode,
        this.po_itemcode,
        1,
        this.vendorAcId
      )
      .subscribe(
        (data: any) => {
          this.displayErrorDialog = false;
          this.success("Line item updated successfully");
          this.getInvoiceFulldata('');
          this.readMappingData();
        },
        (error) => {
          this.error("Server error");
          this.displayErrorDialog = false;
        }
      );
  }

  readMappingData() {
    this.exceptionService.readMappedData().subscribe((data: any) => {
      this.mappedData = data?.description;
    });
  }
  selectReason(reasn) {
    if (reasn == 'Others') {
      this.addrejectcmtBool = true;
    } else {
      this.addrejectcmtBool = false;
    }
  }

  rejectKepup(val) {
    this.rejectionComments = val;
  }

  Reject() {
    if (!this.router.url.includes('GRN_approvals')) {
      let rejectionData = {
        documentdescription: this.rejectionComments,
        userAmount: 0,
      };
      this.uploadCompleted = true
      this.SharedService.vendorRejectInvoice(
        JSON.stringify(rejectionData)
      ).subscribe(
        (data: any) => {
          this.dataService.invoiceLoadedData = [];
          this.success("Rejection Notification sent to Vendor")
          this.displayrejectDialog = false;
          setTimeout(() => {
            this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          }, 1000);
        },
        (error) => {
          this.error("Server error");
        }
      );
    } else {
      this.SharedService.rejectGRN().subscribe((data: any) => {
        if (data?.status == 'success') {
          this.success(data.message)
        } else {
          this.error(data.message);
        }
        this.displayrejectDialog = false;
        setTimeout(() => {
          this.router.navigate([`${this.portalName}/GRN_approvals`]);
        }, 1000);
      })
    }
  }

  onChangeGrn(lineItem, val) {
    if (this.GRN_PO_Bool) {
      this.updateAmountExcTax(lineItem, val, 'UnitPrice', 'AmountExcTax', 'idDocumentLineItems');
    } else {
      this.updateAmountExcTax(lineItem, val, 'GRN - UnitPrice', 'GRN - AmountExcTax', 'invoice_itemcode');
    }
  }
  updateAmountExcTax(lineItem, newQuantity: number, TagName_u, TagName_a, field) {
    if (lineItem) {
      const unitPrice = this.lineDisplayData.find(item => item.TagName == TagName_u)
        .linedata.find(data => data[field] === lineItem[field]);
      const amountExcTax = (Number(unitPrice.Value) * newQuantity).toFixed(2);
      const amountExcTaxItem = this.lineDisplayData.find(item => item.TagName == TagName_a)
        .linedata.find(data => data[field] === lineItem[field]);

      if (amountExcTaxItem) {
        amountExcTaxItem.Value = amountExcTax;
      }
      this.GRN_line_total = 0;
      this.lineDisplayData.forEach(ele => {
        if (ele.TagName == TagName_a) {
          ele.linedata.forEach(v => this.GRN_line_total = this.GRN_line_total + Number(v.Value))
        }
      })
    }
  }

  deleteGrnLine(id) {
    if (confirm('Are you sure you want to delete this line?')) {
      this.lineDisplayData = this.lineDisplayData.map(record => {
        const newLinedata = record.linedata.filter(obj => obj?.idDocumentLineItems !== id);
        return { ...record, linedata: newLinedata };
      });
      this.GRN_line_total = 0;
      this.lineDisplayData.forEach(ele => {
        if (ele.TagName == "AmountExcTax") {
          ele.linedata.forEach(v => this.GRN_line_total = this.GRN_line_total + Number(v.Value))
        }
      })
      this.GRNObject = this.GRNObject.filter(val => {
        return val?.idDocumentLineItems != id
      })
      this.grnLineCount = this.lineDisplayData[0]?.linedata;
    }
  }

  delete_confirmation(id) {
    const drf: MatDialogRef<ConfirmationComponent> = this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: 'Are you sure you want to delete this line?', type: 'confirmation', heading: 'Confirmation', icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
    })

    drf.afterClosed().subscribe((bool) => {
      if (bool) {
        this.removeLine(id)
      }
    })
  }

  confirm_pop(grnQ, boolean, txt) {
    const drf: MatDialogRef<ConfirmationComponent> = this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: 'Kindly confirm the number of GRN lines.', type: 'confirmation', heading: 'Confirmation', icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
    })

    drf.afterClosed().subscribe((bool) => {
      if (bool) {
        this.onSave_submit(grnQ, boolean, txt);
      }
    })
  }

  onSave_submit(grnQ, boolean, txt) {
    if (this.descrptonBool) {
      this.GRNObjectDuplicate = this.GRNObject;
      if (this.GRN_PO_Bool) {
        this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
        this.GRNObjectDuplicate.forEach((val, i) => {
          if (val.is_mapped == 'Price' && grnQ[val?.idDocumentLineItems] != 0) {
            let obj = {
              Value: grnQ[val?.idDocumentLineItems] * val?.Value, ErrorDesc: '', idDocumentLineItems: val?.idDocumentLineItems, is_mapped: '', tagName: 'AmountExcTax'
            }
            this.GRNObjectDuplicate.splice(this.GRNObjectDuplicate.length + 1, 0, obj)
          }

        })
        // this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter((val, ind, arr) => ind == arr.findIndex(v => v.idDocumentLineItems == val.idDocumentLineItems && v.tagName == val.tagName));

      } else {
        this.validateInvPOUnitPrice();
      }
      let emptyBoolean: boolean = false;
      let commentBoolean = false;
      let errorMsg: string;
      this.GRNObjectDuplicate.forEach((ele, ind) => {
        if (ele.Value === '') {
          emptyBoolean = true;
          errorMsg = 'Fields should not be empty!';
        } else if (ele.Value != ele.old_value && !this.GRN_PO_Bool) {
          if (
            ele.ErrorDesc == null ||
            ele.ErrorDesc == '' ||
            ele.ErrorDesc == 'None' ||
            ele.ErrorDesc == 'none'
          ) {
            commentBoolean = true;
            errorMsg =
              'Kindly add Comments for lines that are Adjusted.';
          }
        } else if (ele.Value == 0) {
          if (this.GRN_PO_Bool) {
            if (ele.tagName == 'Quantity') {
              this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val?.idDocumentLineItems != ele?.idDocumentLineItems);
            }
            // this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val=> val.tagName != 'AmountExcTax');
          } else {
            commentBoolean = true;
            errorMsg =
              'Field Value cannot be Null!';
          }

        }
      });
      if (emptyBoolean == false && commentBoolean == false) {

        if (
          boolean == true
        ) {
          if (this.GRN_PO_Bool) {
            if (this.invoiceNumber) {
              this.grnDuplicateCheck();
            } else {
              this.error("Dear user, please add the invoice number.");
            }
          } else {
            setTimeout(() => {
              this.CreateGRNAPI(boolean, txt);
            }, 1000);
          }
        } else {
          if (!this.GRN_PO_Bool) {
            setTimeout(() => {
              this.CreateGRNAPI(false, 'GRN data saved successfully');
            }, 1000);
          } else {
            this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
          }
        }
      } else {
        this.error(errorMsg);
      }
    } else {
      this.error("Description Unavailable. Kindly Contact the Technical Team.");
    }
  }

  createGRNWithPO() {
    this.SpinnerService.show();
    let inv_number = '';
    if (this.invoiceNumber) {
      inv_number = `&inv_num=${this.invoiceNumber}`
    }
    this.SharedService.createGRNWithPO(inv_number, JSON.stringify(this.GRNObjectDuplicate)).subscribe((data: any) => {
      this.SpinnerService.hide();
      if (data.status == 'Posted') {
        this.success(data.message);

        setTimeout(() => {
          this.router.navigate(['/customer/Create_GRN_inv_list']);
        }, 2000);
      } else {
        this.progressDailogBool = true;
        this.p_width = '350px';
        this.headerpop = 'GRN Creation Status';
        this.APIResponse = data.message;
      }

    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })

  }

  grnDuplicateCheck() {
    if (this.GRNObjectDuplicate?.length > 0) {
      let arr = []
      this.GRNObjectDuplicate.forEach((ele) => {
        if (ele?.tagName == 'Quantity') {
          let obj = {
            line_id: ele?.idDocumentLineItems,
            quantity: ele?.Value
          }
          arr.push(obj)
        }
      })
      // const uniqarr = arr.filter((val,ind,arr)=> ind == arr.findIndex(v=>v.line_id == val.line_id && v.quantity == val.quantity));
      let duplicateAPI_response: string;
      let extra_param = '';
      if(this.router.url.includes('GRN_approvals')){
        extra_param = `&grn_id=${this.invoiceID}`
      } 
      this.SharedService.duplicateGRNCheck(JSON.stringify(arr),extra_param).subscribe((data: any) => {
        duplicateAPI_response = data?.result;
        this.SharedService.checkGRN_PO_balance(false).subscribe((data: any) => {
          let negativeData = [];
          let negKey = {};
          let bool: boolean;
          for (let key in data?.result) {
            let valuee = data.result[key];
            this.GRNObjectDuplicate.forEach((ele) => {
              if (ele?.tagName == 'Quantity' && ele?.idDocumentLineItems == key && (+valuee < +ele?.Value)) {
                negKey[key] = valuee;
                negativeData.push(valuee);
              }
            })
          }
          if (negativeData.length <= 0) {
            if (duplicateAPI_response == 'successful') {
              this.createGRNWithPO();
            } else {
              this.error(duplicateAPI_response);
            }
          } else {
            let str: string = JSON.stringify(negKey);
            this.error(`Please check available quantity in the line numbers (${str})`);
          }
        }, err => {
          this.error("Server error");
        })
      }, err => {
        this.error("Server error");
      })
    } else {
      alert('There are no lines to create GRN, if you are able to see the lines then please check the quantityy');
      this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
    }
  }

  CreateGRNAPI(boolean, txt) {
    if (this.validateUnitpriceBool) {
      if (confirm("Invoice 'unit-price' is not matching with PO. Do you want to proceed?")) {
        this.grnAPICall(boolean, txt);
      }
    } else {
      this.grnAPICall(boolean, txt);
    }

  }

  grnAPICall(boolean, txt) {
    this.SpinnerService.show();
    this.SharedService.saveGRNData(
      boolean,
      JSON.stringify(this.GRNObject)
    ).subscribe(
      (data: any) => {
        this.SpinnerService.hide();
        if (data.status == 'Posted') {
          this.success(data.message);

          setTimeout(() => {
            this.router.navigate(['/customer/Create_GRN_inv_list']);
          }, 2000);
        } else {
          this.progressDailogBool = true;
          this.p_width = '350px';
          this.headerpop = 'GRN Creation Status';
          this.APIResponse = data.message;
        }
      },
      (error) => {
        this.SpinnerService.hide();
        if (error.status == 403) {
          this.progressDailogBool = true;
          this.headerpop = 'GRN Creation Status';
          this.APIResponse = error.error.Error;
          this.error("Invoice quantity beyond threshold");
        } else {
          this.error("Server error");
        }
      }
    );
  }

  validateInvPOUnitPrice() {
    this.SharedService.validateUnitprice(JSON.stringify(this.validatePOInvUnit)).subscribe((data: any) => {
      if (data.result.length > 0) {
        this.validateUnitpriceBool = true;
      } else {
        this.validateUnitpriceBool = false;
      }
    })
  }

  async open_dialog_comp(str) {
    // let rejObj = {
    //   sendor: '',
    //   rejectTxt: this.rejectionComments
    // }
    let w = '70%';
    let h = '92vh';
    let response;
    if (str == 'Amend') {
      this.displayrejectDialog = false;
      w = '40%';
      h = '40vh';
    } else if (str == 'flip line') {
      try {
        const data: any = await this.exceptionService.getPOLines('').toPromise();
        response = { podata: data.Po_line_details, sub_total: this.invoice_subTotal };
      } catch (error) {
        console.error('Error fetching PO lines:', error);
        return;
      }
    }
    this.SpinnerService.show();
    const matdrf: MatDialogRef<PopupComponent> = this.mat_dlg.open(PopupComponent, {
      width: w,
      height: h,
      hasBackdrop: false,
      data: { type: str, resp: response, rejectTxt: this.rejectionComments }
    });
    this.SpinnerService.hide();
    if (str == 'Amend') {
      matdrf.afterClosed().subscribe((resp: any) => {
        this.rejectionComments = resp;
        if (resp) {
          this.Reject();
        }
      })
    }

  }

  open_dialog(str) {
    if (str == 'reject') {
      this.rejectModalHeader = 'ADD Rejection Comments';
    } else if (str == 'approve') {
      this.rejectModalHeader = 'Add Pre-approval Comments';
      if (this.preApproveBoolean == false) {
        this.rejectModalHeader = 'Add Approval Comments';
        this.isRejectCommentBoolean = false;
        this.isApproveCommentBoolean = true;
        this.isLCMSubmitBoolean = false;
      }
    } else {
      this.rejectModalHeader = "Check Item code availability";
    }
    this.displayrejectDialog = true;
  }
  addComments(val) {
    this.rejectionComments = val;
    if (this.rejectionComments.length > 9) {
      this.commentsBool = false;
    } else {
      this.commentsBool = true;
    }
  }
  removeLine(itemCode) {
    this.exceptionService.removeLineData(itemCode).subscribe((data: any) => {
      if (data.status == "deleted") {
        this.success("Line item deleted")

        this.displayrejectDialog = false;
        this.getInvoiceFulldata('');
      }
    }, err => {
      this.error("Server error");
      this.displayrejectDialog = false;
    })
  };

  CheckItemStatus(item) {
    this.exceptionService.checkItemCode(item).subscribe((data: any) => {
      if (data.status == "not exists") {
        let addLineData = {
          "documentID": this.invoiceID,
          "itemCode": item
        };
        this.exceptionService.addLineItem(JSON.stringify(addLineData)).subscribe((data: any) => {
          this.success("Line item Added")

          this.getInvoiceFulldata('');
        });
        this.displayrejectDialog = false;
      } else {
        this.error("Item code already exists, Please try with another item code.");
      }
    }, err => {
      this.error("Server error");
      this.displayrejectDialog = false;
    })
  }
  // getPO_lines(str) {
  //   this.exceptionService.getPOLines().subscribe((data: any) => {
  //     this.poLineData = data.Po_line_details;
  //     this.SpinnerService.hide();
  //   }, err => {
  //     this.AlertService.errorObject.detail = "Server error";
  //     this.messageService.add(this.AlertService.errorObject);
  //     this.SpinnerService.hide();
  //   })
  // }

  getGRNnumbers(po_num) {
    this.SharedService.checkGRN_PO_duplicates(po_num).subscribe((data: any) => {
      this.grnList = data?.result;
      this.filterGRNlist = this.grnList;
    })
  }
  ChangeGRNData() {
    if (this.selectedGRNList.length > 0) {
      this.progressDailogBool = false;
      this.SharedService.updateGRNnumber(JSON.stringify(this.selectedGRNList)).subscribe(data => {
        this.success("GRN Data Updated. Kindly click 'Next' button to send the invoice to the batch")

      }, err => {
        this.error("Server error");
      })
    }
  }

  // getGRNtabData() {
  //   this.SharedService.getGRNTabData().subscribe((data: any) => {
  //     this.GRNTabData = data?.result;
  //     this.grnTabDatalength = Object.keys(this.GRNTabData).length;
  //   })
  // }

  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }

  opengrnDailog() {
    this.GRNDialogBool = true;
    this.progressDailogBool = true;
    this.headerpop = 'Select GRN';
    this.p_width = '70vw';
  }

  getPODocId(po_num) {
    this.SharedService.get_poDoc_id(po_num).subscribe((data: any) => {
      this.poDocId = data.result;
      this.SharedService.po_doc_id = data.result;
    })
  }
  selectedGRN(event, grn_num) {
    this.updateInvoiceData = [];
    let bool: boolean = event.target.checked;
    this.readGRNLines(grn_num, bool);
  }
  readGRNLines(grn_num, bool) {
    this.SpinnerService.show();
    this.SharedService.getGRN_Lines(grn_num).subscribe((data: any) => {
      this.PO_GRN_Number_line = data.result;
      this.SpinnerService.hide();
      if (bool) {
        let data = [...this.PO_GRN_Number_line]
        this.selectedGRNList.push(grn_num);
        this.selectedGRNLines.push({ grnNumber: grn_num, linesData: data });
      } else {
        if (this.selectedGRNList.length > 0) {
          this.selectedGRNList = this.selectedGRNList.filter(grn => grn != grn_num);
          this.selectedGRNLines = this.selectedGRNLines.filter(grn => grn.grnNumber != grn_num);
        }
      }
      let total_arr = []
      this.selectedGRNLines.forEach(el=>{
        total_arr.push(el.linesData)
      })
      this.selected_GRN_total = total_arr.reduce((acc, arr) => {
        return acc + arr.reduce((subAcc, obj) => subAcc + parseFloat(obj.AmountExcTax), 0);
      }, 0);
    }, err => {
      this.error("Server error");
      this.SpinnerService.hide();
    })
  }
  // readPOLines() {
  //   this.exceptionService.getPOLines('').subscribe((data: any) => {
  //     this.poLineData = data.Po_line_details;
  //   }, err => {
  //     this.alertFun('Server error');
  //     this.SpinnerService.hide();
  //   })
  // }
  // refreshPO() {
  //   this.SpinnerService.show();
  //   this.SharedService.updatePO(this.poDocId).subscribe((data: any) => {
  //     this.readPOLines();
  //     this.SpinnerService.hide();
  //     this.successAlert('PO data updated.');
  //   }, err => {
  //     this.SpinnerService.hide();
  //     this.alertFun('Server error');
  //   })
  // }
  getPO_numbers(idVen) {
    this.SpinnerService.show();
    this.SharedService.getPo_numbers(idVen).subscribe((data: any) => {
      this.poNumbersList = data.result;
      this.filteredPO = data.result;
      this.SpinnerService.hide();
    })
  }

  poDailog(data) {
    this.progressDailogBool = true;
    this.headerpop = "Confirm PO number";
    this.p_width = '70vw';
    this.getPO_numbers(this.vendorId);
    this.searchPOArr = data
    this.getDate();
  }
  filterPOnumber(event) {
    let filtered: any[] = [];
    let query = event.query;
    if (this.poNumbersList?.length > 0) {
      for (let i = 0; i < this.poNumbersList?.length; i++) {
        let PO: any = this.poNumbersList[i];
        if (PO.PODocumentID.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(PO);
        }
        this.filteredPO = filtered;
      }
    }
  }
  POsearch(val) {
    if (this.headerpop == 'Confirm PO number') {
      this.poNumbersList = this.filteredPO;
      if (this.poNumbersList?.length > 0) {
        this.poNumbersList = this.poNumbersList.filter(el => {
          return el.Document.PODocumentID.toLowerCase().includes(val.toLowerCase())
        });
      }
    } else {
      this.grnList = this.filterGRNlist;
      if (this.grnList?.length > 0) {
        this.grnList = this.grnList.filter(el => {
          return el.GRNNumber.toLowerCase().includes(val.toLowerCase())
        });
      }
    }
  }
  selectedPO(id, event) {
    this.updateInvoiceData = [];
    let po_num_text = document.getElementById(id).innerHTML;
    let po_num = po_num_text.trim();
    this.poDate = this.poNumbersList.filter((val) => {
      return val.Document.PODocumentID == po_num
    });
    this.activePOId = po_num;
    this.SharedService.po_doc_id = po_num;
    this.SharedService.po_num = po_num;
    this.readPOLines(po_num)
  }

  readPOLines(po_num) {
    this.SpinnerService.show();
    this.SharedService.getPO_Lines(po_num).subscribe((data: any) => {
      this.PO_GRN_Number_line = data?.result;
      this.SpinnerService.hide();
    }, err => {
      this.error("Server error");
      this.SpinnerService.hide();
    })
  }

  confirmPO() {
    let updateValue = {
      documentDataID: this.searchPOArr.idDocumentData,
      OldValue: this.searchPOArr.Value || '',
      NewValue: this.SharedService.po_num,
    };
    this.updateInvoiceData.push(updateValue);
    this.saveChanges();
    this.progressDailogBool = false;
    setTimeout(() => {
      this.getInvoiceFulldata('');
    }, 1000);
  }
  getDate() {
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let today = new Date();
    let month = today.getMonth();
    this.selectedMonth = this.months[month];
    let year = today.getFullYear();
    this.lastYear = year - 2;
    this.displayYear = `${this.lastYear}:${year}`;
    let prevYear = year - 2;

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(prevYear);

    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear(year);
  }


  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      if (frmDate && toDate) {
        if (this.datePicker.overlayVisible) {
          this.datePicker.hideOverlay();
        }
        this.poNumbersList = this.filteredPO;
        this.poNumbersList = this.poNumbersList.filter((element) => {
          const dateF = this.datePipe.transform(element.DocumentData.Value, 'yyyy-MM-dd')
          return dateF >= frmDate && dateF <= toDate;
        });
      }
    } else {
      this.poNumbersList = this.filteredPO;
    }
  }
  clearDates() {
    this.filterByDate('');
  }

  status_dialog() {
    this.progressDailogBool = true;
    this.headerpop = "Please select the status";
    this.p_width = '350px';
    this.status_arr = [
      { name: 'Sent to ERP', st_obj: { status: '7', subStatus: '77' } },
      { name: 'Posted', st_obj: { status: '14', subStatus: '77' } }
    ];
  }
  status_change() {
    this.SpinnerService.show();
    let obj = {
      "documentStatusID": this.status_change_op.status,
      "documentsubstatusID": this.status_change_op.subStatus
    }
    this.SharedService.changeStatus(obj).subscribe((data: any) => {
      this.success(data.result);

      this.progressDailogBool = false;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }

  onOptionDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sampleLineData, event.previousIndex, event.currentIndex);
  }
  Approve_grn() {
    this.SpinnerService.show();
    this.exceptionService.approve_grn().subscribe((data: any) => {
      this.SpinnerService.hide();
      if (data.status?.toLowerCase() == 'posted') {
        this.success(data.message);

        setTimeout(() => {
          this._location.back();
        }, 1000);
      } else {
        this.error(data.message);
      }
    }, err => {
      this.SpinnerService.hide();
    })
  }
  canDeactivate(): boolean {
    if (!this.uploadCompleted) {
      return window.confirm(
        'Please click the "Next" button to process the document otherwise upload processs will terminate. Do you really want to leave?'
      );
    }
    return true;
  }
  onSelectFileApprove(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.uploadFileList.push(event.target.files[i]);
    }
    this.uploadSupport();
  }
  onSelectFile(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.uploadFileList.push(event.target.files[i]);

    }
  }
  removeUploadQueue(index) {
    this.uploadFileList.splice(index, 1);
  }

  uploadSupport() {
    this.progress = 1;
    const formData: any = new FormData();
    for (const file of this.uploadFileList) {
      formData.append('files', file, file.name);
    }
    this.SpinnerService.show()
    this.SharedService.uploadSupportDoc(formData)
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
            this.success("Supporting Documents uploaded Successfully");
            this.uploadFileList = [];
            event.body?.result?.forEach(ele => {
              this.support_doc_list.push(ele);
            })
            //  setTimeout(() => {
            //  this.getInvoiceFulldata();
            this.SpinnerService.hide()
          }
        }),
        catchError((err: any) => {
          this.progress = null;
          this.error("Server error");
          this.SpinnerService.hide()
          return throwError(err.message);
        })
      )
      .toPromise();
  }

  downloadDoc(doc_name, type) {
    let encodeString = encodeURIComponent(doc_name);
    this.SharedService.downloadSupportDoc(encodeString).subscribe(
      (response: any) => {
        let blob: any = new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        if (type == 'view') {
          const dailogRef: MatDialogRef<SupportpdfViewerComponent> = this.mat_dlg.open(SupportpdfViewerComponent, {
            width: '90vw',
            height: '95svh',
            hasBackdrop: true,
            data: { file: url }
          })
        } else {
          fileSaver.saveAs(blob, doc_name);
          this.success("Document downloaded successfully.");
        }

      },
      (err) => {
        this.error("Server error");
      }
    );
  }

  getEntity() {
    this.dataService.getEntity().subscribe((data: any) => {
      this.entityList = data;
      this.SharedService.selectedEntityId = this.dataService.entityID;
      this.entityList.forEach(val => {
        if (this.dataService.entityID == val.idEntity) {
          this.entityName = val.EntityName;
          this.EntityName = val.EntityName;
        }
      })
    });

  }

  readDepartment() {
    this.SharedService.getDepartment().subscribe((data: any) => {
      this.DepartmentList = data.department;
      let deparmrnt_id;
      if (this.tagService.batchProcessTab == 'editApproveBatch') {
        deparmrnt_id = this.dataService.editableInvoiceData.approverData.hierarchy_details.DepartmentID;
        this.DepartmentList.forEach(ele => {
          if (ele.idDepartment == deparmrnt_id) {
            this.selectedDepartment = ele?.DepartmentName;
          }
        })
      } else {
        deparmrnt_id = this.DepartmentList[0]?.idDepartment
        this.selectedDepartment = this.DepartmentList[0]?.DepartmentName;
      }
      this.approversSendData.push({
        EntityID: this.SharedService.selectedEntityId,
        DepartmentID: deparmrnt_id
      })
      this.readApproverData();
      // this.approversSendData[0].DepartmentID = this.DepartmentList[0]?.idDepartment ? this.DepartmentList[0]?.idDepartment : null;
      // this.entityDeptList = this.entityBodyList[0].department
    });
  }
  onSelectDepartment(val) {
    this.DepartmentList.forEach(ele => {
      if (ele.DepartmentName == val) {
        this.approversSendData[0].DepartmentID = ele.idDepartment
      }
    })
    this.readApproverData();
  }
  readCategoryData() {
    this.SharedService.readCategory().subscribe((data: any) => {
      this.categoryList = data;
    })
  }

  onSelectCategory(val) {
    this.approversSendData[0].categoryID = val;
  }

  readApproverData() {
    this.SpinnerService.show();
    this.approversSendData[0].approver = [];
    this.approverList = {}
    this.SharedService.readApprovers(JSON.stringify(this.approversSendData[0])).subscribe((data: any) => {
      let resultData = data?.result
      let array = [];
      let list = [];
      let count = 0;
      for (const item in resultData) {
        count = count + 1;
        list = resultData[item].sort((a, b) => a.userPriority - b.userPriority);
        this.approverList[`${item}_${count}`] = list;
        array.push(resultData[item][0]?.User?.idUser);
      }
      this.approversSendData[0].approver = array;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      if (err.status == 403) {
        this.error("Approvers are not available for this combination");
      } else {
        this.error("Server error");
      }

    })

  }

  onSelectApprovers(value, index) {
    this.approversSendData[0].approver[index] = value;
  }

  onSelectPreApprove(bool) {
    if (bool == true) {
      this.open_dialog('approve');
    }
  }

  onSubmitApprovers() {
    this.approversSendData[0].description = this.rejectionComments;
    if (this.preApproveBoolean == false) {
      this.sendApprovalAPI();
    } else {
      if (this.preApproveBoolean == true) {
        this.sendApprovalAPI();
      } else {
        this.error("Please add pre approval comments");
      }
    }
  }
  sendApprovalAPI() {
    this.SharedService.setApprovers(JSON.stringify(this.approversSendData[0]), this.preApproveBoolean).subscribe((data: any) => {
      if (data?.error_status) {
        this.error(data?.error_status)
      } else {
        this.success(data?.result);
        setTimeout(() => {
          this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
        }, 1000);
      }
    },
      (err) => {
        this.error("Server error");
      })
  }
  filterEnttity(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.entityList?.length; i++) {
      let country = this.entityList[i];
      if (
        country.EntityName.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredEnt = filtered;
  }
  // onSelectEnt(event){
  //   this.selectedEntity = event.EntityName;
  // }
  onSelectEntity(event) {
    this.entityList.forEach(val => {
      if (event == val.EntityName) {
        this.readPONumbersLCM(val.idEntity);
      }
      this.LCMObj.EntityName = this.EntityName;
      this.LCMLineForm.control.patchValue(this.LCMObj);
    })
  }
  readPONumbersLCM(ent_id) {
    this.SharedService.getLCMPOnum(ent_id).subscribe((data: any) => {
      this.POlist_LCM = data.LCMPoNumbers;
      this.LCMObj.EntityName = this.EntityName;
      this.LCMLineForm.control.patchValue(this.LCMObj);
    })
  }

  filterPOnumber_LCM(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.POlist_LCM?.length; i++) {
      let country = this.POlist_LCM[i];
      if (
        country.PODocumentID.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredPO = filtered;
  }

  selectedPO_lcm(value) {
    this.selectedPONumber = value.PODocumentID;
    this.readLCMLines(value.PODocumentID);
  }
  readLCMLines(po_num) {
    this.LCMItems = [];
    this.SpinnerService.show();
    this.SharedService.getLCMLines(po_num).subscribe((data: any) => {
      let LCMLineData = data.PoLineData;
      let count = 0;
      for (const item in LCMLineData) {
        count = count + 1;
        this.LCMItems.push({ PoLineDescription: item, id: count, values: LCMLineData[item] });
      }
      this.voyageList = data.VoyageNumbers;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }
  filterLCMLine(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.LCMItems?.length; i++) {
      let country = this.LCMItems[i];
      if (
        country.PoLineDescription.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredLCMLines = filtered;
  }
  OnSelectLine(event) {
    this.selectedLCMLine = event.PoLineDescription;
    this.itemId = event.values.ItemId;
    // this.selectedVoyage = event.values.Voyage;
    // this.act_val = event.values.ActualizedValue;
    // this.est_val = event.values.EstimatedValue;
    // this.max_allocation = event.values.AllocateRange;
    this.lineNumber = event.values.LineNumber;
    this.ContextTableId = event.values.ContextTableId;
    this.ContextRecId = event.values.ContextRecId;
    // this.AGIVesselNumber = event.values.AGIVesselNumber;
    this.readChargeCode(event.values.dataAreaId, this.ContextRecId, this.ContextTableId)
  }
  // filterVoyage(event){
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < this.voyageList.length; i++) {
  //     let country = this.voyageList[i];
  //     if (
  //       country.voyage_number.toLowerCase().indexOf(query.toLowerCase()) == 0
  //     ) {
  //       filtered.push(country);
  //     }
  //   }
  //   this.filteredVoyage = filtered;
  // }
  // onSelectVoyage(event){
  //   console.log(event)
  //   this.selectedVoyage = event.voyage_number;
  // }
  readChargeCode(dataArea, ContextRecId, ContextTableId) {
    this.SpinnerService.show();
    this.SharedService.getChargesCode(dataArea, ContextRecId, ContextTableId).subscribe((data: any) => {
      this.chargeList = data.value;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
  }
  filterCost(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.chargeList?.length; i++) {
      let country = this.chargeList[i];
      if (
        country.MarkupCode.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(country);
      }
    }
    this.filteredCost = filtered;
  }
  onSelectCost(event) {
    this.selectedCost = event.MarkupCode;
    this.MarkupTransRecId = event.MarkupTransRecId;
    this.SpinnerService.show();
    this.SharedService.getEstActValue(this.selectedPONumber, this.lineNumber, event.MarkupCode).subscribe((data: any) => {
      this.selectedVoyage = data.voyage;
      this.act_val = data.act_val;
      this.est_val = data.est_val;
      this.AGIVesselNumber = data.vessel_num;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
    })
  }
  AddLCMLine(value) {
    let Obj = {
      EntityName: this.EntityName,
      PoDocumentId: this.selectedPONumber,
      PoLineDescription: this.selectedLCMLine,
      PoLineNumber: this.lineNumber,
      VoyageNumber: this.selectedVoyage,
      CostCategory: this.selectedCost,
      EstimatedValue: this.est_val,
      ActualizedValue: this.act_val,
      Allocate: value.Allocate,
      ContextTableId: this.ContextTableId,
      ContextRecId: this.ContextRecId,
      AGIVesselNumber: this.AGIVesselNumber,
      MarkupTransRecId: this.MarkupTransRecId
    }

    this.SaveLCM(Obj);
  }
  deleteLCMLine(index) {
    this.LCMDataTable.splice(index, 1);
  }
  onChange(evt) {
    const formData = new FormData();
    formData.append("file", evt.target.files[0]);
    this.uploadExcel_LCM(formData)
  }
  uploadExcel_LCM(file) {
    this.SpinnerService.show();
    this.SharedService.uploadLCM_xl(file).subscribe((data: any) => {
      if (data?.data) {
        //         data.data.forEach(ele => {
        //           this.LCMDataTable.push(ele);
        //         })
        this.readSavedLCMLineData();
        this.success(data.data);
      } else if (data?.error) {
        let str = data.error.toString();
        this.error(str);
      }
      // this.LCMDataTable = data;
      // this.readSavedLCMLineData()
      // this.AlertService.addObject.detail="File Uploaded"
      // this.messageService.add(this.AlertService.addObject);
      // this.successAlert("File Uploaded");
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.error("Server error");
    })
    delete this.uploadExcelValue;
  }
  downloadLCMTemplate() {
    this.SharedService.downloadLCMTemplate('').subscribe((data: any) => {
      this.excelDownload(data, 'LCM upload template');
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
  readSavedLCMLineData() {
    this.SpinnerService.show()
    this.SharedService.getsavedLCMLineData().subscribe((data: any) => {
      this.LCMDataTable = data.data;
      const sum = this.LCMDataTable.reduce((accumulator, object) => {
        return accumulator + Number(object.Allocate);
      }, 0);
      this.allocateTotal = sum.toFixed(2);
      let bal: any = Number(this.invoiceTotal) - this.allocateTotal;
      this.balanceAmount = parseFloat(bal).toFixed(2);
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
    })
  }
  SaveLCM(obj) {
    this.SpinnerService.show();
    this.SharedService.saveLCMdata(JSON.stringify([obj]), true).subscribe((data: any) => {
      if (data?.result) {
        this.SpinnerService.hide();
        this.success(data?.result)
        this.LCMObj.EntityName = this.EntityName;
        this.LCMLineForm.control.patchValue(this.LCMObj);
        this.readSavedLCMLineData();
      } else if (data?.error) {
        this.SpinnerService.hide();
        this.error(data?.error);
      }
    }, err => {
      this.error('Server error');
    })
  }

  submitLCMLines() {
    this.SpinnerService.show();
    this.SharedService.saveLCMdata(JSON.stringify(this.LCMDataTable), false).subscribe((data: any) => {
      if (data?.result[2] == true) {
        this.success('LCM Lines added please select Approvers');
        this.isLCMCompleted = true;
        this.selectionTabBoolean = true;
        this.supportTabBoolean = true;
        this.isLCMInvoice = false;
        this.readDepartment();
        this.readCategoryData();
        this.getInvoiceFulldata('');
        this.currentTab = 'approver_selection';
      } else {
        this.success('LCM Lines created');
        setTimeout(() => {
          this._location.back();
        }, 1000);
      }
      this.displayrejectDialog = false;
      this.SpinnerService.hide();

    }, err => {
      this.displayrejectDialog = false;
      this.error('Server error');
      this.SpinnerService.hide();
    })

  }
  success(msg) {
    this.AlertService.success_alert(msg);
  }
  error(msg) {
    this.AlertService.error_alert(msg);
  }
  update(msg) {
    this.AlertService.update_alert(msg);
  }
  ngOnDestroy() {
    let sessionData = {
      session_status: false,
      "client_address": JSON.parse(sessionStorage.getItem('userIp'))
    };
    this.exceptionService
      .updateDocumentLockInfo(sessionData)
      .subscribe((data: any) => { });
    clearTimeout(this.callSession);
    this.AlertService.addObject.severity = 'success';
    this.tagService.financeApprovePermission = false;
    this.tagService.approveBtnBoolean = false;
    this.tagService.submitBtnBoolean = false;
    this.dataService.grnWithPOBoolean = false;
    this.dataService.poLineData = [];
    delete this.SharedService.fileSrc;
    this.mat_dlg.closeAll();
  }
}
