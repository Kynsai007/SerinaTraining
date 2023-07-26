import { SettingsService } from 'src/app/services/settings/settings.service';
import { AlertService } from './../../../services/alert/alert.service';
import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { AuthenticationService } from './../../../services/auth/auth-service.service';
import { DataService } from './../../../services/dataStore/data.service';
import { Subscription, throwError } from 'rxjs';
import { PermissionService } from './../../../services/permission.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
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
import { Location } from '@angular/common';
import { FormGroup, NgForm } from '@angular/forms';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import IdleTimer from '../../idleTimer/idleTimer';
import { catchError, map, take} from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import * as fileSaver from 'file-saver';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupComponent } from '../../popup/popup.component';
import { MultiPOComponent } from 'src/app/main-content/multi-po/multi-po.component';


export interface getApproverData {
  EntityID: number,
  EntityBodyID?: number,
  DepartmentID?: number,
  categoryID?: number,
  approver?: any[],
  description?: string
}
export interface saveLCM {
  EntityName: string,
  PoDocumentId: string,
  ItemNumber: string,
  VoyageNumber: string,
  CostCategory: string,
  EstimatedValue: string,
  ActualizedValue: string,
  Allocate: string,
  AGIVesselNumber: string
}

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewInvoiceComponent implements OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfViewer: PdfViewerComponent;
  ctx: CanvasRenderingContext2D;
  zoomX = 1;
  orgX = '0px';
  orgY = '0px';
  @ViewChild('pdfviewer') pdfviewer;
  vendorsSubscription: Subscription;
  isEditable: boolean;
  editable: boolean;
  rect: any;
  rectCoords: any;
  inputData = [];
  vendorDetails: FormGroup;
  isRect: boolean;
  isTagged: boolean = false;

  mergedArray: any;
  inputDisplayArray = [];
  vendorData = [];
  lineDisplayData: any;
  lineData = [];
  Itype: string;
  updateInvoiceData: any = [];
  imgArray: { id: string; url: string }[];
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

  vendorDetalilsEditBoolean: boolean = false;
  displayrejectDialog: boolean;
  rejectOption = { value: '' };
  rejectionComments: string = '';
  rejectReason: any;

  vendorUplaodBoolean: boolean;

  isPdfAvailable: boolean;
  userDetails: any;
  isServiceData: boolean;
  serviceData: any;
  showPdf: boolean;
  btnText = 'View PDF';
  isImgBoolean: boolean;
  zoomVal: number = 0.8;
  rotation = 0;
  readvendorsData: any;
  timer: any;
  callSession: any;
  GRNUploadID: any;
  reuploadBoolean = false;
  vendorName: any;
  invoiceNumber = '';
  rejectpopBoolean: boolean;
  supportTabBoolean: boolean;
  approval_selection_boolean: boolean;
  uploadFileList = [];
  progress: number;
  support_doc_list = [];
  selectionTabBoolean: boolean;

  entityList: any;
  entityName: string;
  comment_header: string;
  deletepopBoolean: boolean;
  checkItemBoolean: boolean;
  popUpHeader: string;
  lineTabBoolean: boolean;
  item_code: any;
  isRejectCommentBoolean: boolean;
  isApproveCommentBoolean: boolean;
  isLCMSubmitBoolean: boolean;
  BtnpopText: string;
  preApproveBoolean = false;
  approval_setting_boolean: boolean;
  DepartmentList: any;
  approversSendData: getApproverData[] = [];
  selectedDepartment: string;

  isLCMInvoice: boolean;
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
  poList: any;
  filteredPO: any[];
  approverList: any;
  categoryList: any;
  isLinenonEditable: boolean;
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
  isLCMCompleted: boolean;
  isLCMTab: boolean;
  POlist_LCM = [];
  filteredEnt: any[];
  filteredLCMLines: any[];
  filteredVoyage: any[];
  filteredCost: any[];
  selectedPONumber: any;
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
  documentType: string;
  allocateTotal: number;
  balanceAmount: any;
  invoiceTotal: any;
  uploadtime: string = "00:00";
  content_type: any;
  imageCanvas: HTMLImageElement;
  addrejectcmtBool: boolean;

  costAllocation = [];
  allocationFileds = [];
  ERP: string;
  documentTypeId: number
  ap_boolean: any;
  poLineData= [];
  isAdmin: boolean;
  polineTableData = [
    { TagName: 'LineNumber', linedata: [] },
    { TagName: 'ItemId', linedata: [] },
    { TagName: 'Name', linedata: [] },
    { TagName: 'ProcurementCategory', linedata: [] },
    { TagName: 'PurchQty', linedata: [] },
    { TagName: 'UnitPrice', linedata: [] },
    { TagName: 'DiscAmount', linedata: [] },
    { TagName: 'DiscPercent', linedata: [] }
  ]
  POlineBool: boolean;
  poDocId: any;
  multiPOBool = false;
  mutliplePOTableData = [];
  po_num: any;
  grnList: any[];
  selectedGRNList = [];
  currentTab = 'head';
  currentlyOpenedItemIndex = -1;
  GRNTabData:any;
  grnTabDatalength: number;
  progressDailogBool: boolean;
  batchData: any;
  portalName: string;
  isBatchTriggered: boolean;
  isAmtStr: boolean;
  subStatusId: any;
  flipEnabled: boolean;
  docType: number;
  constructor(
    private tagService: TaggingService,
    private router: Router,
    private authService: AuthenticationService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private SpinnerService: NgxSpinnerService,
    private permissionService: PermissionService,
    private dataService: DataService,
    private exceptionService: ExceptionsService,
    private AlertService: AlertService,
    private SharedService: SharedService,
    private _sanitizer: DomSanitizer,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private mat_dlg: MatDialog,
  ) {
    this.exceptionService.getMsg().pipe(take(2)).subscribe((msg)=>{
      if(msg == 'normal'){
      this.getInvoiceFulldata();
      }
    })
  }

  ngOnInit(): void {
    this.rejectReason = this.dataService.rejectReason;
    this.ap_boolean = this.dataService.ap_boolean;
    if(this.ap_boolean) {
      this.docType = 3
    } else {
      this.docType = 1
    }
    this.flipEnabled = this.dataService.configData.flipBool;
    this.ERP = this.dataService.configData.erpname;
    this.route.queryParams.subscribe(params => {
      this.uploadtime = params.uploadtime;
    })
    this.userDetails = this.authService.currentUserValue;
    if (this.userDetails.user_type == 'vendor_portal') {
      this.portalName = 'vendorPortal';
    } else {
      this.portalName = 'customer'
    }
    this.init();
    this.ERPCostAllocation();
    this.AddPermission();
    this.readVendors();
    this.isAdmin =  this.dataService.isAdmin;
    if (this.tagService.editable == true) {
      this.updateSessionTime();
      this.getEntity();
      this.approval_setting_boolean = this.settingsService.finaceApproveBoolean;
      this.idleTimer(180, 'Start');
      this.callSession = setTimeout(() => {
        this.updateSessionTime();
      }, 250000);
    }
  }
  init() {
    if (
      this.router.url.includes('invoice/InvoiceDetails/vendorUpload') ||
      this.router.url.includes('invoice/InvoiceDetails/CustomerUpload')
    ) {
      this.vendorUplaodBoolean = true;
    } else {
      this.vendorUplaodBoolean = false;
    }
    this.routeIdCapture = this.activatedRoute.params.subscribe((params) => {
      this.SharedService.invoiceID = params['id'];
      this.exceptionService.invoiceID = params['id'];
      this.invoiceID = params['id'];
      this.getInvoiceFulldata();
      this.readFilePath();
    });
    if (this.router.url.includes('InvoiceDetails')) {
      this.Itype = 'Invoice';
      
      this.getGRNtabData();
    } else if (this.router.url.includes('PODetails')) {
      this.Itype = 'PO';
    } else if (this.router.url.includes('SODetails')) {
      this.Itype = 'Sales Order';
    } else if (this.router.url.includes('GRNDetails')) {
      this.Itype = 'GRN';
    }
    
    this.onResize();
    // this.Itype = this.tagService.type;
    this.editable = this.tagService.editable;
    this.fin_boolean = this.tagService.financeApprovePermission;
    this.submitBtn_boolean = this.tagService.submitBtnBoolean;
    this.approveBtn_boolean = this.tagService.approveBtnBoolean;
    this.headerName = this.tagService.headerName;
    this.subStatusId = this.dataService.editableInvoiceData?.idDocumentSubstatus;
    this.userDetails = this.authService.currentUserValue;
    this.approval_selection_boolean =
      this.tagService.approval_selection_boolean;
    this.isLCMInvoice = this.tagService.LCM_boolean;
    this.documentType = this.tagService.documentType;
    this.documentTypeId = this.dataService.idDocumentType;
    this.routeOptions();

  }

  routeOptions(){
    if (this.documentType == 'lcm' || this.documentType == 'multipo') {
      if(this.documentType == 'multipo'){
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
      this.showPdf = true;
      this.btnText = 'Close';
      this.selectionTabBoolean = false;
    }
  }
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

  idleTimer(time, str) {
    this.timer = new IdleTimer({
      timeout: time, //expired after 180 secs
      clean: str,
      onTimeout: () => {
        if (this.router.url.includes('ExceptionManagement/InvoiceDetails')) {
          this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          this.errorTriger('Session Expired for Editing Invoice');
        }
      },
    });
  }

  updateSessionTime() {
    let sessionData = {
      session_status: true,
      "client_address": JSON.parse(localStorage.getItem('userIp'))
    };
    this.exceptionService
      .updateDocumentLockInfo(JSON.stringify(sessionData))
      .subscribe((data: any) => { });
  }

  readVendors() {
    this.vendorsSubscription = this.dataService
      .getVendorsData()
      .subscribe((data: any) => {
        this.readvendorsData = data;
      });
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
  getInvoiceFulldata() {
    this.SpinnerService.show();
    this.inputDisplayArray = [];
    this.lineData = [];
    this.SharedService.getInvoiceInfo().subscribe(
      (data: any) => {
        const pushedArrayHeader = [];
        data?.ok?.cost_alloc?.forEach(cost => {
          let merge = { ...cost.AccountCostAllocation }
          this.costAllocation.push(merge);
        })

        if (data?.ok?.uploadtime) {
          this.uploadtime = data.ok.uploadtime;
        }
        data.ok.headerdata.forEach((element) => {
          this.mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          this.mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(this.mergedArray);
        });
        this.inputData = pushedArrayHeader;
        let inv_num_data: any = this.inputData.filter((val) => {
          return (val.TagLabel == 'InvoiceId') || (val.TagLabel == 'bill_number');
        });
        this.invoiceNumber = inv_num_data[0]?.Value;
        let inv_total: any = this.inputData.filter((val) => {
          return (val.TagLabel == 'InvoiceTotal');
        });
        this.invoiceTotal = inv_total[0]?.Value;
        if (this.tagService.documentType == 'lcm') {
          this.readSavedLCMLineData();
        }
        let po_num_data = this.inputData.filter((val) => {
          return (val.TagLabel == 'PurchaseOrder');
        });
        this.po_num = po_num_data[0]?.Value;
        if(this.po_num && this.ap_boolean){
          this.getPODocId(this.po_num);
        }
        // this.getGRNnumbers(this.po_num);
        if (data.ok.vendordata) {
          this.isServiceData = false;
          this.vendorData = {
            ...data.ok.vendordata[0].Vendor,
            ...data.ok.vendordata[0].VendorAccount,
            ...data.ok.vendordata[0].VendorUser,
          };
          this.vendorName = this.vendorData['VendorName'];
        }
        if (data.ok.servicedata) {
          this.isServiceData = true;
          this.vendorData = {
            ...data.ok.servicedata[0].ServiceAccount,
            ...data.ok.servicedata[0].ServiceProvider,
          };
          this.vendorName = this.vendorData['ServiceProviderName'];
        }
        if(!this.isServiceData && this.Itype == 'Invoice' ){
          this.readPOLines();
        }
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
          this.lineDisplayData.unshift({
            TagName: 'S.No',
            idDocumentLineItemTags: 1,
          });
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
        this.support_doc_list = data.ok.support_doc?.files;
        if (this.support_doc_list == null) {
          this.support_doc_list = []
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorTriger('Server error');
      }
    );
  }

  readFilePath() {
    this.showInvoice = '';
    this.SpinnerService.show();
    this.SharedService.getInvoiceFilePath().subscribe(
      (data: any) => {
        this.content_type = data?.result?.content_type;
        if (
          data.result.filepath &&
          data.result.content_type == 'application/pdf'
        ) {
          this.isPdfAvailable = false;
          this.isImgBoolean = false;

          /*covert base64 to blob */
          this.byteArray = new Uint8Array(
            atob(data.result.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: 'application/pdf' })
          );
        } else if (data.result.content_type == 'image/jpg' || data.result.content_type == 'image/png') {
          let filetype = data.result.content_type
          this.isPdfAvailable = false;
          this.isImgBoolean = true;
          this.byteArray = new Uint8Array(
            atob(data.result.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: filetype })
          );
          this.loadImage();
        } else {
          this.isPdfAvailable = true;
          this.showInvoice = '';
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.errorTriger('Server error');
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
        (<HTMLDivElement>document.getElementById('canvas1')).style.transform =
          'scale(' + this.zoomVal + ')';
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
        this.canvasRef.nativeElement.width = window.innerWidth;
        this.canvasRef.nativeElement.height = window.innerHeight;
        this.drawImagein();
      }, 50);

    }
  }
  drawImagein() {

    // const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
    // canvas.height = window.innerHeight;
    // canvas.width = window.innerWidth;
    // const ctx = canvas.getContext('2d');
    this.imageCanvas = new Image();
    this.imageCanvas.src = this.showInvoice;
    let imageWidth, imageHeight;
    this.imageCanvas.onload = () => {
      // Calculate the aspect ratio of the image
      const imageAspectRatio = this.imageCanvas.width / this.imageCanvas.height;
      // Calculate the aspect ratio of the canvas
      const canvasAspectRatio = this.canvasRef.nativeElement.width / this.canvasRef.nativeElement.height;

      // Set the dimensions of the image to fit the canvas while maintaining the aspect ratio

      if (imageAspectRatio > canvasAspectRatio) {
        // The image is wider than the canvas, so set the width of the image to the width of the canvas
        // and scale the height accordingly
        imageWidth = this.canvasRef.nativeElement.width;
        imageHeight = imageWidth / imageAspectRatio;
      } else {
        // The image is taller than the canvas, so set the height of the image to the height of the canvas
        // and scale the width accordingly
        imageHeight = this.canvasRef.nativeElement.height;
        imageWidth = imageHeight * imageAspectRatio;
      }
      // Draw the image on the canvas
      this.ctx.drawImage(this.imageCanvas, 0, 0, imageWidth, imageHeight);

    };

  }


  onChangeValue(key, value, data) {
    // this.inputData[0][key]=value;
    if (key == 'InvoiceTotal' || key == 'SubTotal') { 
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true ;
      } else {
        this.isAmtStr = false ;
      }
    }
    let updateValue = {
      documentDataID: data.idDocumentData,
      OldValue: data.Value || '',
      NewValue: value,
    };
    this.updateInvoiceData.push(updateValue);
  }
  onChangeLineValue(key,value, data) {
    if (key == 'Quantity' || key == 'UnitPrice' || key == 'AmountExcTax') { 
      if (value == '' || isNaN(+value)) {
        this.isAmtStr = true ;
      } else {
        this.isAmtStr = false ;
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
    if(!this.isAmtStr){
      if (this.updateInvoiceData.length != 0) {
        this.SharedService.updateInvoiceDetails(
          JSON.stringify(this.updateInvoiceData)
        ).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Saved',
              detail: 'Changes saved successfully',
            });
  
            this.updateInvoiceData = [];
          },
          (err) => {
            this.updateInvoiceData = [];
            this.errorTriger('Server error or Please check the data');
          }
        );
      }
    } else {
      this.updateInvoiceData = [];
      this.errorTriger('Strings are not allowed in the amount and quantity fields.');
    }
  }
  onSubmitData() {

  }


  drawrectangleonHighlight() {
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

    // this.canvas.add(rect);
    // this.canvas.setActiveObject(rect);
    // document.getElementById(index + 1).scrollIntoView();
  }

  zoomin() {
    // this.isRect = false;
    // this.canvas.setZoom(this.canvas.getZoom() * 1.1);
    // this.panning();

    this.zoomVal = this.zoomVal + 0.2;
    this.zoomX = this.zoomX + 0.05;
    this.orgX = this.orgX + '50px';
    this.orgY = this.orgY + '50px';
    if (this.zoomVal >= 2.0 && this.zoomX >= 2.0) {
      this.zoomVal = 1;
      this.zoomX = 1;
      this.orgX = '0px';
      this.orgY = '0px';
    }
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `translate(${this.orgX},${this.orgY})`;
  }
  zoomout() {
    // this.isRect = false;
    // this.canvas.setZoom(this.canvas.getZoom() / 1.1);
    // this.panning();
    this.zoomVal = this.zoomVal - 0.2;
    this.zoomX = this.zoomX - 0.05;
    // this.orgX  = this.orgX - '50px';
    // this.orgY  = this.orgY - '50px';
    if (this.zoomVal <= 0.5 && this.zoomX <= 0.8) {
      this.zoomVal = 1;
      this.zoomX = 1;
      this.orgX = '0px';
      this.orgY = '0px';
    }
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
    (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `translate(${this.orgX},${this.orgY})`;
  }
  removeEvents() {
    // this.canvas.off('mouse:down');
    // this.canvas.off('mouse:up');
    // this.canvas.off('mouse:move');
  }

  panning() {
    // this.removeEvents();
    // let panning = false;
    // let selectable;
    // this.canvas.on('mouse:up', (e) => {
    //   panning = false;
    // });

    // this.canvas.on('mouse:down', (e) => {
    //   panning = true;
    //   selectable = false;
    // });
    // this.canvas.on('mouse:move', (e) => {
    //   if (panning && e && e.e) {
    //     selectable = false;
    //     var units = 10;
    //     var delta = new fabric.Point(e.e.movementX, e.e.movementY);
    //     this.canvas.relativePan(delta);
    //   }
    // });
  }

  addVendorDetails() {
  }
  onVerify(e) {
  }
  submitChanges() {
    if(this.documentTypeId == 3){
      if (this.isLCMInvoice == false) {
        this.getInvoiceFulldata();
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
          /* header Validation starts*/
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
                errorType = 'emptyHeader';
                count++;
              }
            }
          });
          /* header Validation end*/
  
          /* Line Details Validation starts*/
          this.lineDisplayData.forEach((element) => {
            if (
              element.TagName == 'Quantity' ||
              element.TagName == 'UnitPrice' ||
              element.TagName == 'AmountExcTax' ||
              element.TagName == 'Amount' ||
              element.TagName == 'Description' 
            ) {
              element.linedata.forEach((ele1) => {
                if (element.TagName != 'Description' &&
                  (ele1.DocumentLineItems?.Value == '' ||
                  isNaN(+ele1.DocumentLineItems?.Value))
                ) {
                  count++;
                  errorTypeLine = 'AmountLine';
                } else if(element.TagName == 'Description'){
                  if(ele1.DocumentLineItems?.Value == ''){
                    count++
                    errorTypeLine = 'description';
                  }
                }
  
                if (element.TagName == 'Quantity') {
                  if (
                    ele1.DocumentLineItems?.Value == 0
                  ) {
                    count++;
                    errorTypeLine = 'quntity';
                  }
                }
              });
            }
          });
          /* Line Details Validation end*/
  
          if (count == 0) {
            this.vendorSubmit();
          } else {
            /* Error reponse starts*/
            if (errorTypeHead == 'AmountHeader') {
              this.currentTab = 'head';
              setTimeout(() => {
                this.errorTriger('Please verify SubTotal and InvoiceTotal in Header details');
              }, 50);
            }
            if (errorType == 'emptyHeader') {
              this.currentTab = 'head';
              this.errorTriger('Please Check PO Number, Invoice Date, InvoiceId fileds in header details');
            }
            if (errorTypeLine == 'AmountLine') {
              setTimeout(() => {
                this.currentTab = 'line';
                this.errorTriger('Please verify Amount, Quntity, unitprice and AmountExcTax in Line details');
              }, 10);
            } else if (errorTypeLine == 'quntity') {
              setTimeout(() => {
                this.currentTab = 'line';
                this.errorTriger('Please check the Quntity in the Line details');
              }, 10);
            } else if(errorTypeLine == 'description') {
                this.currentTab = 'line';
                this.errorTriger('Please check the Description in the Line details');
            }
            /* Error reponse end*/
          }
        }, 2000);
      } else {
        if (this.LCMDataTable.length > 0) {
          this.captureComments('LCM', null);
        } else {
          this.errorTriger('Please add LCM lines');
        }
      }
    } else if(this.documentTypeId == 1) {
      this.getInvoiceFulldata();
      setTimeout(() => {
      this.vendorSubmitPO();
      }, 2000);
    }
  }

  errorTriger(error){
    this.AlertService.errorObject.detail = error;
    this.messageService.add(this.AlertService.errorObject);
  }
  SaveLCM(obj) {
    this.SharedService.saveLCMdata(JSON.stringify([obj]), true).subscribe((data: any) => {
      if (data?.result) {
        this.AlertService.addObject.detail = data?.result;
        this.messageService.add(this.AlertService.addObject);
        this.LCMObj.EntityName = this.EntityName;
        this.LCMLineForm.control.patchValue(this.LCMObj);
        this.readSavedLCMLineData();
      } else if (data?.error) {
        this.errorTriger(data?.error);
      }
    }, err => {
      this.errorTriger('Server error');
    })
  }

  submitLCMLines() {
    this.SpinnerService.show();
    this.SharedService.saveLCMdata(JSON.stringify(this.LCMDataTable), false).subscribe((data: any) => {
      if (data?.result[2] == true) {
        this.AlertService.addObject.detail = 'LCM Lines added please select Approvers';
        this.isLCMCompleted = true;
        this.selectionTabBoolean = true;
        this.supportTabBoolean = true;
        this.isLCMInvoice = false;
        this.readDepartment();
        this.readCategoryData();
        this.getInvoiceFulldata();
        this.currentTab = 'approver_selection';
      } else {
        this.AlertService.addObject.detail = 'LCM Lines created';
        setTimeout(() => {
          this._location.back();
        }, 1000);
      }
      this.displayrejectDialog = false;
      this.SpinnerService.hide();
      this.messageService.add(this.AlertService.addObject);

    }, err => {
      this.displayrejectDialog = false;
      this.errorTriger('Server error');
      this.SpinnerService.hide();
    })

  }

  vendorSubmit() {
    this.SharedService.vendorSubmit(this.reuploadBoolean, this.uploadtime).subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        if (this.router.url.includes('ExceptionManagement')) {
          this.AlertService.addObject.detail = 'send to batch successfully';
          this.AlertService.addObject.summary = 'sent';
          this.messageService.add(this.AlertService.addObject);
        } else {
          if (!this.GRNUploadID) {
            this.messageService.add({
              severity: 'success',
              summary: 'Uploaded',
              detail: 'Uploaded to serina successfully',
            });
          }
        }
        let query = '';
        if (this.GRNUploadID) {
          query = `?re_upload=${this.reuploadBoolean}&doctype=${this.docType}&grnreuploadID=${this.GRNUploadID}`;
        } else {
          query = `?re_upload=${this.reuploadBoolean}&doctype=${this.docType}`;
        }

        // this.SharedService.triggerBatch(query).subscribe((data: any) => {
        //   if (
        //     this.vendorUplaodBoolean == true &&
        //     this.reuploadBoolean == true
        //   ) {
        //     if (data[0] == 0) {
        //       this.messageService.add({
        //         severity: 'error',
        //         summary: 'Rejected',
        //         detail: data[1],
        //       });
        //     } else {
        //       this.messageService.add({
        //         severity: 'success',
        //         summary: 'Uploaded',
        //         detail: data[1],
        //       });
        //     }
        //   }

        //   this.dataService.reUploadData = [];
        // });
        this.SharedService.syncBatchTrigger(query).subscribe((data: any) => {
          this.progressDailogBool = true;
          this.batchData = data[this.invoiceID]?.complete_status;
          if (
            this.vendorUplaodBoolean == true &&
            this.reuploadBoolean == true
          ) {
            if (data[0] == 0) {
              this.errorTriger(data[1]);
            } else {
              this.messageService.add({
                severity: 'success',
                summary: 'Uploaded',
                detail: data[1],
              });
            }
          }

          this.dataService.reUploadData = [];
        })
        // setTimeout(() => {
        //   if (this.router.url.includes('ExceptionManagement')) {
        //     this._location.back();
        //   } else {
        //     if (this.userDetails.user_type == 'vendor_portal') {
        //       this.router.navigate(['vendorPortal/invoice/allInvoices']);
        //     } else {
        //       this.router.navigate(['customer/invoice/allInvoices']);
        //     }
        //   }
        // }, 4000);
      },
      (error) => {
        this.errorTriger('Server error');
      }
    );
  }

  routeToMapping() {
    this.isBatchTriggered = true;
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
    if (this.portalName == 'vendorPortal') {
      if (sub_status == 8 ||
        sub_status == 16 ||
        sub_status == 33||
        sub_status == 21||
        sub_status == 27) {
        this.router.navigate([
          `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${this.invoiceID}`,
        ]);
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    } else {
    if (sub_status == 8 ||
      sub_status == 16 ||
      sub_status == 17 ||
      sub_status == 33 ||
      sub_status == 21 ||
      sub_status == 27 ||
      sub_status == 75) {
      this.router.navigate([
        `${this.portalName}/ExceptionManagement/batchProcess/comparision-docs/${this.invoiceID}`,
      ]);
    } else if (sub_status == 34 || sub_status == 51 || sub_status == 54 || sub_status == 70 || sub_status == 71)  {
      if(sub_status == 34){
        this.AlertService.updateObject.summary = 'Suggestion';
        this.AlertService.updateObject.detail = 'Please compare the PO lines with invoices and we recommend PO flip method to solve this issues.';
      } else if(sub_status == 51) {
        this.AlertService.updateObject.summary = 'LCM Invoice';
        this.AlertService.updateObject.detail = 'Please add the lines for the LCM invoice.';
        this.currentTab = 'LCM';
      } else if(sub_status == 54) {
        this.AlertService.updateObject.summary = 'MultiPO Invoice';
        this.AlertService.updateObject.detail = 'Please Check the invoice total is not matching with the lines.';
        this.currentTab = 'line';
      } else if(sub_status == 70) {
        if(this.portalName == 'customer'){
          this.approval_selection_boolean = true;
          this.AlertService.updateObject.summary = 'Set Approval';
          this.AlertService.updateObject.detail = 'Please add the approvers';
          this.currentTab = 'approver_selection';
        } else {
          this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
        }
        
      } 
      // else if(sub_status == 71) {
      //   this.AlertService.updateObject.summary = 'Approval pending';
      //   this.AlertService.updateObject.detail = 'Please change the approvers if you have any issues.';
      // }
      this.routeOptions();
      this.messageService.add(this.AlertService.updateObject)
    } else if (sub_status == 7 || sub_status == 23 || sub_status == 10) {
      this.router.navigate([`${this.portalName}/ExceptionManagement`]);
    } else {
      this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
    }
    }
    this.progressDailogBool = false;
  }

  vendorSubmitPO() {
    this.SharedService.vendorSubmitPO(this.reuploadBoolean, this.uploadtime).subscribe(
      (data: any) => {
        this.SpinnerService.hide();
        // if (this.router.url.includes('ExceptionManagement')) {
          this.AlertService.addObject.detail = 'Document submitted successfully';
          this.AlertService.addObject.summary = 'sent';
          this.messageService.add(this.AlertService.addObject);
        // } 
         setTimeout(() => {
          if (this.router.url.includes('ExceptionManagement')) {
            this._location.back();
          } else {
            if (this.userDetails.user_type == 'vendor_portal') {
              this.router.navigate(['vendorPortal/invoice/allInvoices']);
            } else {
              this.router.navigate(['customer/invoice/allInvoices']);
            }
          }
        }, 2000);
      },
      (error) => {
        this.errorTriger('Server error');
      }
    );
  }
  serviceSubmit(){
    this.SharedService.serviceSubmit().subscribe((data:any)=>{
      this.AlertService.addObject.detail = 'send to batch successfully';
      this.AlertService.addObject.summary = 'sent';
      this.messageService.add(this.AlertService.addObject);
      setTimeout(() => {
        this._location.back();
      }, 1000);
    },err=>{
      this.errorTriger('Server error');
    })
  }

  approveChanges() {
    this.exceptionService.send_batch_approval().subscribe(
      (data: any) => {
        this.AlertService.addObject.detail = 'Send to batch successfully';
        this.messageService.add(this.AlertService.addObject);
        setTimeout(() => {
          this._location.back();
        }, 2000);
      },
      (error) => {
        this.errorTriger(error.statusText);
      }
    );
  }

  addComments(val) {
    this.rejectionComments = val;
    if (this.rejectionComments.length > 9) {
      this.commentslabelBool = false;
    } else {
      this.commentslabelBool = true;
    }
  }

  captureComments(reason, val) {
    this.displayrejectDialog = true;
    if (reason == 'reject') {
      this.comment_header = 'Add Rejection Comments';
      this.isRejectCommentBoolean = true;
      this.isApproveCommentBoolean = false;
      this.isLCMSubmitBoolean = false;
      this.deletepopBoolean = false;
      this.checkItemBoolean = false;
    } else if (reason == 'approve') {
      this.comment_header = 'Add Pre-approval Comments';
      if (this.preApproveBoolean == false) {
        this.comment_header = 'Add Approval Comments';
        this.isRejectCommentBoolean = false;
        this.isApproveCommentBoolean = true;
        this.isLCMSubmitBoolean = false;
        this.deletepopBoolean = false;
        this.checkItemBoolean = false;
      }
    } else if (reason == 'delete') {
      this.comment_header = ' Please confirm';
      this.BtnpopText = 'Are you sure you want to delete?';
      this.isRejectCommentBoolean = false;
      this.deletepopBoolean = true;
      this.checkItemBoolean = false;
      this.item_code = val.itemCode;
      this.isLCMSubmitBoolean = false;
      this.isRejectCommentBoolean = false;
      this.isApproveCommentBoolean = false;
    } else if (reason == 'AddLine') {
      this.comment_header = "Check Item code availability";
      this.isRejectCommentBoolean = false;
      this.deletepopBoolean = false;
      this.checkItemBoolean = true;
      this.isLCMSubmitBoolean = false;
      this.isRejectCommentBoolean = false;
      this.isApproveCommentBoolean = false;
    } else {
      this.comment_header = 'Please Confirm';
      this.BtnpopText = "Are you sure you want to submit? Once submit is done, you can not modify."
      this.isLCMSubmitBoolean = true;
      this.isRejectCommentBoolean = false;
      this.isApproveCommentBoolean = false;
      this.deletepopBoolean = false;
      this.checkItemBoolean = false;
    }

  }

  removeLine() {
    this.exceptionService.removeLineData(this.item_code).subscribe((data: any) => {
      if (data.status == "deleted") {
        this.AlertService.addObject.detail = "Line item deleted";
        this.messageService.add(this.AlertService.addObject);
        this.displayrejectDialog = false;
        if (this.isLCMInvoice) {
          this.readSavedLCMLineData();
        } else {
          this.getInvoiceFulldata();
        }
      }
    }, err => {
      this.errorTriger("Server error");
      this.displayrejectDialog = false;
    })
  };

  CheckItemStatus(item) {
    this.SpinnerService.show();
    this.exceptionService.checkItemCode(item).subscribe((data: any) => {
      if (data.status == "not exists") {
        let addLineData = {
          "documentID": this.invoiceID,
          "itemCode": item
        };
        this.exceptionService.addLineItem(JSON.stringify(addLineData)).subscribe((data: any) => {
          this.AlertService.addObject.detail = "Line item Added";
          this.messageService.add(this.AlertService.addObject);
          this.getInvoiceFulldata();
        });
        this.displayrejectDialog = false;
      } else {
        this.errorTriger('Item code already exist, Please try other item code');
      }
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.errorTriger('Server error');
      this.displayrejectDialog = false;
    })
  }

  financeApprove() {
    let desc = {
      "desp": this.rejectionComments
    }
    this.SharedService.financeApprovalPermission(JSON.stringify(desc)).subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: data.result,
        });
        this.displayrejectDialog = false;
        setTimeout(() => {
          this._location.back();
        }, 1000);
      },
      (error) => {
        this.errorTriger(error.statusText);
        this.displayrejectDialog = false;
      }
    );
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
    let rejectionData = {
      documentdescription: this.rejectionComments,
      userAmount: 0,
    };
    if (this.rejectOption.value == 'IT_reject') {
      this.SharedService.ITRejectInvoice(
        JSON.stringify(rejectionData)
      ).subscribe(
        (data: any) => {
          this.dataService.invoiceLoadedData = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Rejected',
            detail: 'Successfully send rejection for IT',
          });
          this.displayrejectDialog = false;
          setTimeout(() => {
            this._location.back();
          }, 1000);
        },
        (error) => {
          this.errorTriger("Server error");
        }
      );
    } else {
      this.SharedService.vendorRejectInvoice(
        JSON.stringify(rejectionData)
      ).subscribe(
        (data: any) => {
          this.dataService.invoiceLoadedData = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Rejected',
            detail: 'Successfully send rejection for Vendor',
          });
          this.displayrejectDialog = false;
          setTimeout(() => {
            this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          }, 1000);
        },
        (error) => {
          this.errorTriger("Something went wrong");
        }
      );
    }
  }

  backToInvoice() {
    if (this.vendorUplaodBoolean === false || this.isBatchTriggered) {
      this._location.back();
    } else {
      if (
        confirm(
          ` Are you sure you want cancel process ? \n if you click OK you will lost your document meta data.`
        )
      ) {
        this._location.back();
      }
    }
    // else {
    //   this._location.back();
    // }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerHeight = window.innerHeight;
    if (this.innerHeight > 550 && this.innerHeight < 649) {
      this.InvoiceHeight = 500;
    } else if (this.innerHeight > 650 && this.innerHeight < 700) {
      this.InvoiceHeight = 560;
    } else if (this.innerHeight > 750) {
      this.InvoiceHeight = 660;
    }
  }
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

  rotate(angle: number) {
    this.rotation += angle;
  }

  convertInchToPixel(arr: any) {
    // let diagonalpixel = Math.sqrt(Math.pow(window.screen.width,2)+Math.pow(window.screen.height,2));
    // let diagonalinch = diagonalpixel/72;
    // let ppi = diagonalpixel/diagonalinch;
    let ppi = 96;
    let Height = arr.Height * ppi;
    let Width = arr.Width * ppi;
    let Xcord = arr.Xcord * ppi;
    let Ycord = arr.Ycord * ppi;
    return [Height, Width, Xcord, Ycord];
  }
  viewPdf() {
    this.showPdf = !this.showPdf;
    if (this.showPdf != true) {
      this.btnText = 'View PDF';
    } else {
      this.btnText = 'Close';
    }
    this.loadImage();
  }
  hightlight(val) {
    let boundingBox = this.convertInchToPixel(val);
    let hgt: number = boundingBox[0];
    let wdt = boundingBox[1];
    let xa = boundingBox[2];
    let ya = boundingBox[3];
    var pageno = parseInt('1');
    var pageView = this.pdfViewer.pdfViewer._pages[pageno - 1];
    //datas - array returning from server contains synctex output values
    var left = xa;
    var top = ya;
    var width = wdt;
    var height = hgt;
    //recalculating top value
    top = pageView.viewport.viewBox[3] - top;
    var valueArray = [left, top, left + width, top + height];
    let rect = pageView.viewport.convertToViewportRectangle(valueArray);
    // rect       = PDFJS.disableTextLayer.normalizeRect(rect);
    var x = Math.min(rect[0], rect[2]),
      width = Math.abs(rect[0] - rect[2]);
    var y = Math.min(rect[1], rect[3]),
      height = Math.abs(rect[1] - rect[3]);
    const element = document.createElement('div');
    element.setAttribute('class', 'overlay-div-synctex');
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    element.style.position = 'absolute';
    element.style.backgroundColor = 'rgba(200,0,0,0.5)';
    $('*[data-page-number="' + pageno + '"]').append(element);
    this.pdfviewer.pdfViewer._scrollIntoView({
      pageDiv: pageView.div,
    });
  }

  onClick(e) {
    const textLayer = document.getElementsByClassName('TextLayer');
    const x =
      window.getSelection().getRangeAt(0).getClientRects()[0].left -
      textLayer[0].getBoundingClientRect().left;
    const y =
      window.getSelection().getRangeAt(0).getClientRects()[0].top -
      textLayer[0].getBoundingClientRect().top;
  }









  changeTab(val, currentTab) {
    this.isLCMTab = false;
    this.currentTab = currentTab;
    if (val === 'show') {
      this.showPdf = true;
      this.btnText = 'Close';
    } else {
      this.showPdf = false;
      this.btnText = 'View PDF';
    }
    if (currentTab === 'support') {
      this.supportTabBoolean = true;

    } else if (currentTab === 'approver_selection') {

      this.selectionTabBoolean = true;
      this.supportTabBoolean = true;
    } else {
      this.supportTabBoolean = false;
      this.selectionTabBoolean = false;
    }

    if (currentTab == 'LCM') {
      this.isLCMTab = true;
    }

    // if (currentTab == 'line') {
    //   this.lineTabBoolean = true;
    // } else {
    //   this.lineTabBoolean = false;
    // }
    this.loadImage();
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
            this.AlertService.addObject.detail = "Supporting Documents uploaded Successfully";
            this.messageService.add(this.AlertService.addObject);
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
          this.errorTriger("Server error");
          this.SpinnerService.hide()
          return throwError(err.message);
        })
      )
      .toPromise();
  }

  downloadDoc(doc_name) {
    let encodeString = encodeURIComponent(doc_name);
    this.SharedService.downloadSupportDoc(encodeString).subscribe(
      (response: any) => {
        let blob: any = new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, doc_name);
        this.AlertService.addObject.detail =
          'Document downloaded successfully.';
        this.messageService.add(this.AlertService.addObject);
      },
      (err) => {
        this.errorTriger("Server error");
      }
    );
  }
  getEntity() {
    this.dataService.getEntity().subscribe((data: any) => {
      this.entityList = data;

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
        this.errorTriger("Approvers are not available for this combination");
      } else {
        this.errorTriger("Server error");
      }

    })

  }

  onSelectApprovers(value, index) {
    this.approversSendData[0].approver[index] = value;
  }

  onSelectPerApprove(bool) {
    if (bool == true) {
      this.captureComments('approve', null);

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
        this.errorTriger("Please add pre approval comments");
      }
    }
  }
  sendApprovalAPI() {
    this.SharedService.setApprovers(JSON.stringify(this.approversSendData[0]), this.preApproveBoolean).subscribe((data: any) => {
      if (data?.error_status) {
        this.AlertService.errorObject.detail = data?.error_status;
        this.messageService.add(this.AlertService.errorObject);
      } else {
        this.AlertService.addObject.detail = data?.result;
        this.messageService.add(this.AlertService.addObject);
        setTimeout(() => {
          this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
        }, 1000);
      }
    },
      (err) => {
        this.errorTriger("Server error");
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

  filterPOnumber(event) {
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

  selectedPO(value) {
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
      this.errorTriger("Server error");
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
    this.selectedVoyage = event.values.Voyage;
    this.act_val = event.values.ActualizedValue;
    this.est_val = event.values.EstimatedValue;
    this.max_allocation = event.values.AllocateRange;
    this.lineNumber = event.values.LineNumber;
    this.ContextTableId = event.values.ContextTableId;
    this.ContextRecId = event.values.ContextRecId;
    this.AGIVesselNumber = event.values.AGIVesselNumber;
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
      this.errorTriger("Server error");
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
        this.readSavedLCMLineData()
        this.AlertService.addObject.detail = data.data;
        this.messageService.add(this.AlertService.addObject);
      } else if (data?.error) {
        let str = data.error.toString();
        this.errorTriger(str);
      }
      // this.LCMDataTable = data;
      // this.readSavedLCMLineData()
      // this.AlertService.addObject.detail="File Uploaded"
      // this.messageService.add(this.AlertService.addObject);
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.errorTriger("Server error");
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
  open_dialog_comp(str){
    let w = '60%';
    let h = '70vh'
    if(str == 'Amend'){
      this.displayrejectDialog = false;
      w = '40%';
      h = '40vh';
    }
    this.SpinnerService.show();
    const matdrf:MatDialogRef<PopupComponent> = this.mat_dlg.open(PopupComponent, {
      width: w,
      height: h,
      hasBackdrop: false,
      data: { type: str, resp: this.poLineData,rejectTxt: this.rejectionComments }
    });
    this.SpinnerService.hide();
    if(str == 'Amend') {
      matdrf.afterClosed().subscribe((resp:any)=>{
        this.rejectionComments = resp;
        if(resp){
          this.Reject();
        }
      })
    }
  }

  // getPO_lines(str) {
  //   this.exceptionService.getPOLines('').subscribe((data: any) => {
  //     let poLineData = data.Po_line_details;
  //     this.mat_dlg.open(PopupComponent,{ 
  //       width : '60%',
  //       height: '70vh',
  //       hasBackdrop: false,
  //       data : { type: str, comp:'ocr', resp: poLineData,grnLine:''}});
  //     this.SpinnerService.hide();
  //   },err=>{
  //     this.errorTriger("Server error");
  //     this.SpinnerService.hide();
  //   })
  // }
  readPOLines() {
    this.exceptionService.getPOLines('').subscribe((data: any) => {
      this.poLineData = data.Po_line_details;
      if(this.poLineData){
        if (Object?.keys(this.poLineData[0])?.length > 0) {
          this.POlineBool = true;
        } else {
          this.POlineBool = false;
        }
      }
      this.SpinnerService.hide();
    }, err => {
      this.errorTriger("Server error");
      this.SpinnerService.hide();
    })
  }

  getPODocId(po_num) {
    this.SharedService.get_poDoc_id(po_num).subscribe((data: any) => {
      this.poDocId = data.result;
    })
  }
  refreshPO(){
    this.SpinnerService.show();
    this.SharedService.updatePO(this.poDocId).subscribe((data:any)=>{
      this.readPOLines();
      this.SpinnerService.hide();
      this.AlertService.addObject.detail = 'PO data updated.';
      this.messageService.add(this.AlertService.addObject);
    },err=>{
      this.SpinnerService.hide();
      this.errorTriger("Server error");
    })
  }

  mutliPOEdit(str){
   const dailogRef: MatDialogRef<MultiPOComponent> =  this.mat_dlg.open(MultiPOComponent,{ 
      width : '85%',
      height: '85vh',
      hasBackdrop: false,
      data : {type:str, lines:this.mutliplePOTableData}});
      dailogRef.afterClosed().subscribe(result=>{
        this.mutliplePOTableData = result;
      })
  }
  getGRNtabData(){
    this.SharedService.getGRNTabData().subscribe((data:any)=>{
      this.GRNTabData = data?.result;
      this.grnTabDatalength =Object.keys(this.GRNTabData).length;
    })
  }

  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }
  
  setClosed(itemIndex) {
    if(this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
  ngOnDestroy() {
    let sessionData = {
      session_status: false,
      "client_address": JSON.parse(localStorage.getItem('userIp'))
    };
    this.exceptionService
      .updateDocumentLockInfo(sessionData)
      .subscribe((data: any) => { });
    clearTimeout(this.callSession);
    this.mat_dlg.closeAll();
    // this.tagService.financeApprovePermission = false;
    this.tagService.approveBtnBoolean = false;
    // this.tagService.submitBtnBoolean = false;
    this.tagService.approval_selection_boolean = false;
    this.tagService.LCM_boolean = false;
    // this.dataService.entityID = undefined;
    // this.SharedService.selectedEntityId = undefined;
    this.vendorsSubscription.unsubscribe();
  }
}
