import { AlertService } from './../../../services/alert/alert.service';
import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { AuthenticationService } from './../../../services/auth/auth-service.service';
import { DataService } from './../../../services/dataStore/data.service';
import { Subscription } from 'rxjs';
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
import { Location } from '@angular/common';
import { FormBuilder, NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { FormCanDeactivate } from '../../can-deactivate/form-can-deactivate';
import { SettingsService } from 'src/app/services/settings/settings.service';
import IdleTimer from '../../idleTimer/idleTimer';
import * as fileSaver from 'file-saver';
import { PopupComponent } from '../../popup/popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';

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
  implements OnInit {
  // @ViewChild('canvas') canvas;
  // zoomX = 1;
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
  // innerHeight: number;
  // InvoiceHeight: number = 560;
  // zoomdata: number = 1;
  // showInvoice: any;
  // page: number = 1;
  // totalPages: number;
  // isLoaded: boolean = false;
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
  showPdf: boolean = false;
  btnText = 'View PDF';
  selectedPONumber;
  poList = [];
  filteredPO: any[];

  lineCount = [];
  currentTab = 'vendor';
  lineItems: any;
  inv_itemcode: any;
  po_itemcode: any;
  vendorAcId: any;
  mappedData: any;
  // zoomVal: number = 0.8;

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
  // rotation = 0;
  addrejectcmtBool: boolean;
  ap_boolean: boolean;
  // poLineData = [];
  isAdmin: boolean;
  GRN_PO_Bool: boolean;
  GRN_PO_Data = [];
  GRN_PO_tags = [
    { TagName: 'Description', linedata: [] },
    { TagName: 'PO Qty', linedata: [] },
    // { TagName: 'PO Balance Qty', linedata: [] },
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
  currentlyOpenedItemIndex = -1;
  // GRNTabData: any;
  // grnTabDatalength: number;
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
  constructor(
    fb: FormBuilder,
    private tagService: TaggingService,
    public router: Router,
    private authService: AuthenticationService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private exceptionService: ExceptionsService,
    private AlertService: AlertService,
    private messageService: MessageService,
    private SpinnerService: NgxSpinnerService,
    private permissionService: PermissionService,
    private dataService: DataService,
    private settingService: SettingsService,
    private SharedService: SharedService,
    private mat_dlg: MatDialog,
    private elementRef: ElementRef
  ) {
    super();
    this.exceptionService.getMsg().pipe(take(2)).subscribe((msg) => {
      if (msg == 'mapping') {
        this.getInvoiceFulldata();
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
    this.AddPermission();
    if (this.ap_boolean) {
      this.partytype = 'vendor';
      this.docType = 3;
      this.lineTxt1 = 'IN';
      this.lineTxt2 = 'PO';
    } else {
      this.partytype = 'customer';
      this.docType = 1;
      this.lineTxt1 = 'PO';
      this.lineTxt2 = 'SO';
    }
    if (this.userDetails.user_type == 'vendor_portal') {
      this.portalName = 'vendorPortal';
    } else {
      this.portalName = 'customer'
    }
    this.initialData();
    this.boolFunc();
    // this.readFilePath();

    this.isAdmin = this.dataService.isAdmin;
    this.currentTab = 'line';

  }

  getPdfBool(event) {
    this.isPdfAvailable = event;
  }
  doc_view() {
    this.showPdf = true;
    this.documentViewBool = !this.documentViewBool
  }

  boolFunc(){
    if(this.router.url.includes('comparision-docs')|| this.router.url.includes('SO_generate')){
      this.isPdfAvailable = false;
    } else {
      this.isPdfAvailable = true;
    }
  }

  idleTimer(time, str) {
    this.timer = new IdleTimer({
      timeout: time, //expired after 180 secs
      clean: str,
      onTimeout: () => {
        if (this.router.url.includes('comparision-docs') || this.router.url.includes('SO_generate')) {
          this.router.navigate([`${this.portalName}/ExceptionManagement`]);
        }
        this.alertFun("Session Expired for Editing Invoice");
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
    this.routeIdCapture = this.activatedRoute.params.subscribe((params) => {
      this.SharedService.invoiceID = params['id'];
      this.exceptionService.invoiceID = params['id'];
      this.invoiceID = params['id'];
    });
    this.Itype = this.tagService.type;

    if (this.ap_boolean) {
      if (this.router.url.includes('Create_GRN_inv_list')|| this.GRN_PO_Bool) {
        if (this.permissionService.GRNPageAccess == true) {
          this.grnCreateBoolean = true;
          if (this.GRN_PO_Bool) {
            this.tagService.headerName = 'Create GRN With PO';
            this.getInvoiceFulldata_po();
            this.get_PO_GRN_Lines();

          } else {
            this.tagService.headerName = 'Create GRN';
            this.readGRNInvData();
            // this.readPOLines();
          }
          if (this.grnCreateBoolean) {
            this.currentTab = 'line'
          }
        } else {
          alert('Sorry!, you do not have access');
          this.router.navigate(['customer/invoice/allInvoices']);
        }
      } else {
        this.getInvoiceFulldata();
        // this.getRulesData();
        if (this.ap_boolean) {
          this.getPOs();
          // this.readPOLines();
          this.readLineItems();
          this.readErrorTypes();
          this.readMappingData();
          // this.getGRNtabData();
        }
        if (this.tagService.editable == true && this.grnCreateBoolean == false) {
          this.updateSessionTime();
          this.idleTimer(180, 'Start');
          this.callSession = setTimeout(() => {
            this.updateSessionTime();
          }, 250000);
        }
      }
    } else {
      this.readDocumentData();
      this.headerName = 'PO';
      this.Itype = 'PO';
      if (this.tagService.editable == true && this.grnCreateBoolean == false) {
        this.updateSessionTime();
        this.idleTimer(180, 'Start');
        this.callSession = setTimeout(() => {
          this.updateSessionTime();
        }, 250000);
      }
    }
    // this.onResize();
    this.editable = this.tagService.editable;
    this.fin_boolean = this.tagService.financeApprovePermission;
    this.submitBtn_boolean = this.tagService.submitBtnBoolean;
    this.approveBtn_boolean = this.tagService.approveBtnBoolean;
    this.headerName = this.tagService.headerName;
    this.userDetails = this.authService.currentUserValue;
    this.financeapproveDisplayBoolean =
      this.settingService.finaceApproveBoolean;
    this.subStatusId = this.dataService.subStatusId;
    
    // this.showInvoice = "/assets/New folder/MEHTAB 9497.pdf"
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
    if (val == 'line' || val == 'poline' || val == 'grn') {
      this.showPdf = false;
      this.btnText = 'View PDF';
    } else {
      this.showPdf = true;
      this.btnText = 'Close';
    }
  }

  readDocumentData() {
    this.SpinnerService.show();
    this.exceptionService.getDocumentDetails().subscribe((data: any) => {
      this.poLinedata = data.polinedata;
      this.soLinedata = data.solinedata;
      this.so_id = data.so_id;
      const pushedArrayHeader = [];
      data.headerdata.forEach((element) => {
        let mergedArray = {
          ...element.DocumentData,
          ...element.DocumentTagDef,
        };
        mergedArray.DocumentUpdates = element.DocumentUpdates;
        pushedArrayHeader.push(mergedArray);
      });
      this.inputData = pushedArrayHeader;
      this.vendorData = {
        ...data.customerdata[0].Vendor,
        ...data.customerdata[0].VendorAccount,
        ...data.customerdata[0].VendorUser,
      };
      let inv_num_data: any = this.inputData.filter((val) => {
        return (val.TagLabel == 'InvoiceId') || (val.TagLabel == 'bill_number');
      });
      this.invoiceNumber = inv_num_data[0]?.Value;
      this.vendorAcId = this.vendorData['idVendorAccount'];
      this.vendorName = this.vendorData['VendorName'];
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
      this.alertFun("Server error");
    })
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
        let inv_num_data: any = this.inputData.filter((val) => {
          return (val.TagLabel == 'InvoiceId') || (val.TagLabel == 'bill_number');
        });
        this.invoiceNumber = inv_num_data[0]?.Value;
        let po_num_data = this.inputData.filter((val) => {
          return (val.TagLabel == 'PurchaseOrder' || val.TagLabel ==  'PurchId');
        });
        this.po_num = po_num_data[0]?.Value;
        this.getPODocId(this.po_num);
        if (data.ok.vendordata) {
          this.vendorData = {
            ...data.ok.vendordata[0].Vendor,
            ...data.ok.vendordata[0].VendorAccount,
            ...data.ok.vendordata[0].VendorUser,
          };
          this.vendorName = this.vendorData['VendorName'];
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.alertFun("Server error");
      }
    );
  }

  getInvoiceFulldata() {
    this.SpinnerService.show();
    this.inputDisplayArray = [];
    this.exceptionService.getInvoiceInfo_map(this.docType).subscribe(
      (data: any) => {
        this.lineDisplayData = data.linedata.Result;
        this.lineDisplayData.forEach((element, index, arr) => {
          this.lineCount = arr[0].items
        });

        const pushedArrayHeader = [];
        data.headerdata.forEach((element) => {
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
        this.po_num = po_num_data[0]?.Value;
        this.getPODocId(this.po_num);
        if (this.docType == 3) {
          this.getGRNnumbers(this.po_num);
        }
        this.vendorData = {
          ...data.Vendordata[0].Vendor,
          ...data.Vendordata[0].VendorAccount,
          ...data.Vendordata[0].VendorUser,
        };
        this.vendorAcId = this.vendorData['idVendorAccount'];
        this.vendorName = this.vendorData['VendorName'];

        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.alertFun("Server error");
      }
    );
  }

  getPOs() {
    this.exceptionService.getInvoicePOs().subscribe(((data: any) => {
      this.poList = data;
    }))
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
              v.TagName.includes('UnitPrice') ||
              v.TagName.includes('AmountExcTax')
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
        this.invoiceNumber = inv_num_data[0].Value;
        let po_num_data = this.inputData.filter((val) => {
          return (val.TagLabel == 'PurchaseOrder');
        });
        this.po_num = po_num_data[0]?.Value;
        this.getPODocId(this.po_num);
        this.vendorData = {
          ...data.ok.vendordata[0].Vendor,
          ...data.ok.vendordata[0].VendorAccount,
        };
        this.vendorAcId = this.vendorData['idVendorAccount'];
        this.vendorName = this.vendorData['VendorName'];
        // this.poList = data.all_pos;
        this.isGRNDataLoaded = true;
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.alertFun("Server error");
      }
    );
  }

  // readFilePath() {
  //   this.showInvoice = '';
  //   this.SpinnerService.show();
  //   this.exceptionService.readFilePath().subscribe(
  //     (data: any) => {
  //       this.content_type = data?.content_type;
  //       if (data.filepath && data.content_type == 'application/pdf') {
  //         this.isPdfAvailable = false;
  //         this.isImgBoolean = false;
  //         this.byteArray = new Uint8Array(
  //           atob(data.filepath)
  //             .split('')
  //             .map((char) => char.charCodeAt(0))
  //         );
  //         this.showInvoice = window.URL.createObjectURL(
  //           new Blob([this.byteArray], { type: 'application/pdf' })
  //         );
  //       } else if (data.content_type == 'image/jpg' || data.content_type == 'image/png') {
  //         this.isPdfAvailable = false;
  //         this.isImgBoolean = true;
  //         this.byteArray = new Uint8Array(
  //           atob(data.filepath)
  //             .split('')
  //             .map((char) => char.charCodeAt(0))
  //         );
  //         this.showInvoice = window.URL.createObjectURL(
  //           new Blob([this.byteArray], { type: data.content_type })
  //         );
  //         // this.loadImage();
  //       } else {
  //         this.isPdfAvailable = true;
  //         this.showInvoice = '';
  //       }
  //       this.SpinnerService.hide();
  //     },
  //     (error) => {
  //       this.SpinnerService.hide();
  //       this.alertFun("Server error");
  //     }
  //   );
  // }

  // DownloadPDF() {
  //   let extension;
  //   if (this.content_type == 'application/pdf') {
  //     extension = '.pdf';
  //   } else if (this.content_type == 'image/jpg') {
  //     extension = '.jpg';
  //   } else if (this.content_type == 'image/png') {
  //     extension = '.png';
  //   }
  //   fileSaver.saveAs(this.showInvoice, `${this.vendorName}_${this.invoiceNumber}${extension}`);
  // }

  // loadImage() {
  //   if (this.isImgBoolean == true) {
  //     setTimeout(() => {
  //       this.zoomVal = 1;
  //       (<HTMLDivElement>document.getElementById('parentDiv')).style.transform =
  //         'scale(' + this.zoomVal + ')';

  //       const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
  //       canvas.height = window.innerHeight;
  //       canvas.width = window.innerWidth;
  //       const ctx = canvas.getContext('2d');
  //       let image = new Image();
  //       image.src = this.showInvoice;
  //       image.onload = function () {
  //         // Calculate the aspect ratio of the image
  //         const imageAspectRatio = image.width / image.height;
  //         // Calculate the aspect ratio of the canvas
  //         const canvasAspectRatio = canvas.width / canvas.height;

  //         // Set the dimensions of the image to fit the canvas while maintaining the aspect ratio
  //         let imageWidth, imageHeight;
  //         if (imageAspectRatio > canvasAspectRatio) {
  //           // The image is wider than the canvas, so set the width of the image to the width of the canvas
  //           // and scale the height accordingly
  //           imageWidth = canvas.width;
  //           imageHeight = imageWidth / imageAspectRatio;
  //         } else {
  //           // The image is taller than the canvas, so set the height of the image to the height of the canvas
  //           // and scale the width accordingly
  //           imageHeight = canvas.height;
  //           imageWidth = imageHeight * imageAspectRatio;
  //         }

  //         // Draw the image on the canvas
  //         ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
  //       };
  //     }, 50);
  //   }
  // }

  onChangeValue(key, value, data) {
    // this.inputData[0][key]=value;
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
    }else if(key == 'Description') {
      if(value == ''){
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
            this.messageService.add({
              severity: 'success',
              summary: 'Saved',
              detail: 'Changes saved successfully',
            });

            this.updateInvoiceData = [];
          },
          (err) => {
            this.updateInvoiceData = [];
            this.alertFun("Server error or Please check the data");
          }
        );
      }
    } else {
      this.updateInvoiceData = [];
      if(this.isAmtStr){
        this.alertFun('Strings are not allowed in the amount and quantity fields.')
      } else if(this.isEmpty){
        this.alertFun('Please check, Description field should not be empty.')
      }
     
    }
  }

  // zoomin() {
  //   this.zoomVal = this.zoomVal + 0.2;
  //   this.zoomX = this.zoomX + 0.05;
  //   if (this.zoomVal >= 2.0 && this.zoomX >= 2.0) {
  //     this.zoomVal = 1;
  //     this.zoomX = 1;
  //   }
  //   (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
  // }

  // zoomout(index) {
  //   this.zoomVal = this.zoomVal - 0.2;
  //   this.zoomX = this.zoomX - 0.05;
  //   if (this.zoomVal <= 0.5 && this.zoomX <= 0.8) {
  //     this.zoomVal = 1;
  //     this.zoomX = 1;
  //   }
  //   (<HTMLDivElement>document.getElementById('canvas1')).style.transform = `scale(${this.zoomX},${this.zoomVal})`;
  // }

  beforeBatchTrigger() {
    this.getInvoiceFulldata();
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

      if (this.docType == 3) {
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
                  ele1?.invline[0].DocumentLineItems?.Value == '' ||
                  isNaN(+ele1?.invline[0].DocumentLineItems?.Value)
                ) {
                  count++;
                  errorTypeLine = 'AmountLine';
                }

                if (element.tagname == 'Quantity') {
                  if (
                    ele1?.invline[0].DocumentLineItems?.Value == 0
                  ) {
                    count++;
                    errorTypeLine = 'quntity';
                  }
                }
              });
            });
          }
        });
      }
      if (count == 0) {
        this.sendToBatch();
      } else {
        /* Error reponse starts*/
        if (errorTypeHead == 'AmountHeader') {
          setTimeout(() => {
            this.alertFun('Please verify SubTotal and InvoiceTotal in Header details');
          }, 50);
        }
        if (errorType == 'emptyHeader') {
          this.alertFun("Please Check PO Number, Invoice Date, InvoiceId fileds in header details");
        }
        if (errorTypeLine == 'AmountLine') {
          setTimeout(() => {
            this.alertFun('Please verify Amount, Quntity, unitprice and AmountExcTax in Line details');
          }, 10);
        } else if (errorTypeLine == 'quntity') {
          setTimeout(() => {
            this.alertFun("Please check the Quntity in the Line details")
          }, 10);
        }
        /* Error reponse end*/
      }
    }, 2000);
  }

  sendToBatch() {
    this.exceptionService.send_batch_approval().subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        this.successAlert('send to batch successfully');
        this.SharedService.syncBatchTrigger(`?re_upload=false&doctype=${this.docType}`).subscribe((data: any) => {
          this.headerpop = 'Batch Progress'
          this.progressDailogBool = true;
          this.GRNDialogBool = false;
          if (this.docType == 3) {
            this.batchData = data[this.invoiceID]?.complete_status;
          } else if (this.docType == 1) {
            this.batchData = data.batchresp;
          }
        });
        // setTimeout(() => {
        //   if (this.router.url.includes('ExceptionManagement')) {
        //     this._location.back();
        //   }
        // }, 3000);

      },
      (error) => {
        this.alertFun("Server error");
      }
    );
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
    if(!sub_status){
      sub_status = this.batchData[this.batchData.length-1].sub_status;
    }
    this.subStatusId = sub_status;
    this.dataService.subStatusId = sub_status;
    if (this.portalName == 'vendorPortal') {
      if (sub_status == 8 ||
        sub_status == 16 ||
        sub_status == 33 ||
        sub_status == 21 ||
        sub_status == 27) {
        this.updateAlert('Suggestion', 'Please check the values in the document.');
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
        this.updateAlert('Suggestion', 'Please check the values in the document.');
      } else if (sub_status == 34) {
        this.updateAlert('Suggestion', 'Please compare the PO lines with invoices and we recommend PO flip method to solve this issues.')
      } else if (sub_status == 7 || sub_status == 23 || sub_status == 10 || sub_status == 35) {
        this.router.navigate([`${this.portalName}/ExceptionManagement`])
      } else if (sub_status == 70) {
        this.tagService.approval_selection_boolean = true;
        this.router.navigate([`${this.portalName}/ExceptionManagement/InvoiceDetails/${this.invoiceID}`]);
        this.updateAlert('Set Approval', 'Please add the approvers');
        this.currentTab = 'approver_selection';
      } else {
        this.router.navigate([`${this.portalName}/invoice/allInvoices`]);
      }
    }
    this.progressDailogBool = false;
  }

  updateAlert(txt, cmt) {
    this.AlertService.updateObject.summary = txt;
    this.AlertService.updateObject.detail = cmt;
    this.messageService.add(this.AlertService.updateObject);
  }

  financeApprove() {
    // this.SharedService.financeApprovalPermission().subscribe(
    //   (data: any) => {
    //     this.dataService.invoiceLoadedData = [];
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Approved',
    //       detail: data.result,
    //     });
    //     setTimeout(() => {
    //       this._location.back();
    //     }, 1000);
    //   },
    //   (error) => {
    // this.alertFun("Server error");
    //   }
    // );
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
  // zoomIn() {
  //   this.zoomdata = this.zoomdata + 0.1;
  // }
  // zoomOut() {
  //   this.zoomdata = this.zoomdata - 0.1;
  // }
  // afterLoadComplete(pdfData: any) {
  //   this.totalPages = pdfData.numPages;
  //   this.isLoaded = true;
  // }

  // nextPage() {
  //   this.page++;
  // }

  // prevPage() {
  //   this.page--;
  // }

  viewPdf() {
    this.showPdf = !this.showPdf;
    if (this.showPdf != true) {
      this.btnText = 'View PDF';
    } else {
      this.btnText = 'Close';
    }
    if (this.isImgBoolean == true) {
      // this.loadImage();
    }
  }
  // rotate(angle: number) {
  //   this.rotation += angle;
  // }

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
          this.successAlert('PO Number updated successfully');
          this.getInvoiceFulldata();
        },
        (error) => {
          this.alertFun(error.statusText);
        }
      );
    }
  }

  readLineItems() {
    this.exceptionService.readLineItems().subscribe((data: any) => {
      this.lineItems = data.description;
    });
  }
  filterPOLine(event){
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
    if (itemCodeArray.length > 1) {
      presetBoolean = itemCodeArray.includes(el);
    }
    if (this.mappedData?.length > 0) {
      let presetArray = this.mappedData?.filter((ele1) => {
        return ele1.ItemMetaData?.itemcode == el;
      });
      if (presetArray.length > 0) {
        presetBoolean = true;
      }
    }
    if (presetBoolean) {
      if (confirm('Lineitem already mapped, you want to change it again')) {
        this.displayErrorDialog = true;
      }
    } else {
      itemCodeArray.push(el);
      this.displayErrorDialog = true;
    }
  }

  cancelSelectErrorRule() {
    this.displayErrorDialog = false;
  }

  updateLine() {
    this.exceptionService
      .updateLineItems(
        this.inv_itemcode,
        this.po_itemcode,
        this.SelectErrorOption,
        this.vendorAcId
      )
      .subscribe(
        (data: any) => {
          this.displayErrorDialog = false;
          this.successAlert('Line item updated successfully');
          this.getInvoiceFulldata();
          this.readMappingData();
        },
        (error) => {
          this.alertFun(error.statusText);
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
    let rejectionData = {
      documentdescription: this.rejectionComments,
      userAmount: 0,
    };

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
          if (this.router.url.includes('ExceptionManagement')) {
            this.router.navigate([`${this.portalName}/ExceptionManagement`]);
          } else {
            this.router.navigate([`${this.portalName}/Create_GRN_inv_list`]);
          }
        }, 1000);
      },
      (error) => {
        this.alertFun("Server error");
      }
    );
  }

  deleteGrnLine(id) {
    if (confirm('Are you sure you want to delete this line?')) {
      this.lineDisplayData = this.lineDisplayData.map(record => {
        const newLinedata = record.linedata.filter(obj => obj.idDocumentLineItems !== id);
        return { ...record, linedata: newLinedata };
      });
      this.GRNObject = this.GRNObject.filter(val => {
        return val.idDocumentLineItems != id
      })
      this.grnLineCount = this.lineDisplayData[0]?.linedata;
    }
  }

  confirm_pop(grnQ, boolean, txt){
    const drf:MatDialogRef<ConfirmationComponent> = this.mat_dlg.open(ConfirmationComponent,{ 
      width : '30%',
      height: '38vh',
      hasBackdrop: false,
      data : { body: 'Have you verified the GRN qty lines? Please confirm'}})

      drf.afterClosed().subscribe((bool)=>{
        if(bool){
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
          if (val.is_mapped == 'Price' && grnQ[val.idDocumentLineItems] != 0) {
            let obj = {
              Value: grnQ[val.idDocumentLineItems] * val.Value, ErrorDesc: '', idDocumentLineItems: val.idDocumentLineItems, is_mapped: '', tagName: 'AmountExcTax'
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
      this.GRNObjectDuplicate.forEach((ele, ind) => {
        if (ele.Value === '') {
          emptyBoolean = true;
          this.AlertService.errorObject.detail = 'Fields should not be empty!';
        } else if (ele.Value != ele.old_value && !this.GRN_PO_Bool) {
          if (
            ele.ErrorDesc == null ||
            ele.ErrorDesc == '' ||
            ele.ErrorDesc == 'None' ||
            ele.ErrorDesc == 'none'
          ) {
            commentBoolean = true;
            this.AlertService.errorObject.detail =
              'Please add comments for the Line which you adjusted.';
          }
        } else if (ele.Value == 0) {
          if (this.GRN_PO_Bool) {
            if (ele.tagName == 'Quantity') {
              this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.idDocumentLineItems != ele.idDocumentLineItems);
            }
            // this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val=> val.tagName != 'AmountExcTax');
          } else {
            commentBoolean = true;
            this.AlertService.errorObject.detail =
              'Please check the fileds, it sholud not be 0 anywhere';
          }
        }
      });
      if (emptyBoolean == false && commentBoolean == false) {

        if (
          boolean == true
        ) {
          if (this.GRN_PO_Bool) {
            this.grnDuplicateCheck()
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
        this.messageService.add(this.AlertService.errorObject);
      }
    } else {
      this.alertFun('Description in not available, Please check with the technical team.');
    }
  }

  createGRNWithPO() {
    this.SpinnerService.show();
    this.SharedService.createGRNWithPO(JSON.stringify(this.GRNObjectDuplicate)).subscribe((data: any) => {
      this.SpinnerService.hide();
      if(data.status == 'Posted'){
      this.successAlert("GRN Created Successfully");
      setTimeout(() => {
        this.router.navigate(['/customer/Create_GRN_inv_list']);
      }, 2000);
    } else {
      this.progressDailogBool = true;
      this.headerpop = 'GRN Creation Status';
      this.APIResponse = data.message;
    }
    }, err => {
      this.alertFun('Server error');
    })
  }

  grnDuplicateCheck() {
    if (this.GRNObjectDuplicate.length > 0) {
      let arr = []
      this.GRNObjectDuplicate.forEach((ele) => {
        if (ele.tagName == 'Quantity') {
          let obj = {
            line_id: ele.idDocumentLineItems,
            quantity: ele.Value
          }
          arr.push(obj)
        }
      })
      // const uniqarr = arr.filter((val,ind,arr)=> ind == arr.findIndex(v=>v.line_id == val.line_id && v.quantity == val.quantity));
      let duplicateAPI_response: string;
      this.SharedService.duplicateGRNCheck(JSON.stringify(arr)).subscribe((data: any) => {
        duplicateAPI_response = data.result;
        this.SharedService.checkGRN_PO_balance(false).subscribe((data: any) => {
          let negativeData = [];
          let negKey = {};
          for (let key in data?.result) {
            let valuee = data.result[key];
            this.GRNObjectDuplicate.forEach((ele) => {
              
              if (ele.tagName == 'Quantity' && ele.idDocumentLineItems == key && (+valuee < +ele.Value)) {
                negKey[key] = valuee;
                negativeData.push(valuee);
              }
            })
          }
          if (negativeData.length <= 0) {
            if (duplicateAPI_response == 'successful') {
              this.createGRNWithPO();
            } else {
              this.alertFun(duplicateAPI_response);
            }
          } else {
            let str: string = JSON.stringify(negKey);
            this.alertFun(`Please check available quantity in the line numbers (${str})`);
          }
        }, err => {
          this.alertFun('Server error');
        })
      }, err => {
        this.alertFun('Server error');
      })
    } else {
      alert('There is no lines to create GRN, if you are able to see the lines then please check the quantity');
      this.GRNObjectDuplicate = this.GRNObjectDuplicate.filter(val => val.tagName != 'AmountExcTax');
    }
  }

  CreateGRNAPI(boolean, txt) {
    if (this.validateUnitpriceBool) {
      if (confirm('Invoice unitprice is not matching with PO. still you want to proceed?')) {
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
        if(data.status == 'Posted'){
          this.AlertService.addObject.detail = data.message;
          this.messageService.add(this.AlertService.addObject);
          setTimeout(() => {
            this.router.navigate(['/customer/Create_GRN_inv_list']);
          }, 2000);
        } else {
          this.progressDailogBool = true;
          this.headerpop = 'GRN Creation Status';
          this.APIResponse = data.message;
        }
      },
      (error) => {
        this.SpinnerService.hide();
        if (error.status == 403) {
          this.alertFun('Invoice quantity beyond threshold');
        } else {
          this.alertFun('Server error');
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

  async open_dialog_comp(str, line_num) {
    let w = '60%';
    let h = '80vh';
    let response;
    if (str == 'Amend') {
      this.displayrejectDialog = false;
      w = '40%';
      h = '40vh';
    } else if (str == 'flip line') {
      try {
        const data: any = await this.exceptionService.getPOLines('').toPromise();
        response = data.Po_line_details;
      } catch (error) {
        console.error('Error fetching PO lines:', error);
        return;
      }
    } else if (str == 'poMaster') {
      let obj = {
        v_a_id: this.vendorAcId,
        itemCode: +line_num,
        so_id : this.so_id
      }
      response = obj;
    }
    this.SpinnerService.show();
    const matdrf: MatDialogRef<PopupComponent> = this.mat_dlg.open(PopupComponent, {
      width: w,
      height: h,
      hasBackdrop: false,
      data: { type: str, resp: response, rejectTxt: this.rejectionComments }
    });
    this.SpinnerService.hide();

    matdrf.afterClosed().subscribe((resp: any) => {
      if (str == 'Amend') {
        this.rejectionComments = resp;
        if (resp) {
          this.Reject();
        }
      } else if(str == 'poMaster'){
        if(resp){
          this.readDocumentData();
        }
      }

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
  editGRNData() {
    this.getGrnData();
    this.displayRuleDialog = true;
  }
  getGrnData() {
    this.SpinnerService.show();
    this.exceptionService.get_grn_data().subscribe((data: any) => {
      this.PO_GRN_Number_line = data;
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
    })
  }
  deleteGRNEdit(index, data) {
    this.PO_GRN_Number_line.splice(index, 1)
  }

  ChangeGRNData() {
    let grnNumberList = [];
    this.PO_GRN_Number_line.forEach(el => {
      grnNumberList.push(el.PackingSlip)
    })
    grnNumberList = [...new Set(grnNumberList)]
    let obj = {
      "MultiPoList": this.PO_GRN_Number_line,
      "grn_documentID": grnNumberList.toString()
    }
    if (confirm("Are you sure you want to change GRN data?")) {
      this.SpinnerService.show();
      this.exceptionService.update_GRN_data(obj).subscribe((data: any) => {
        this.SpinnerService.hide();
        this.successAlert("GRN Data updated")
        this.displayRuleDialog = false;
      }, err => {
        this.SpinnerService.hide();
        this.alertFun('Please try after sometime');
        this.displayRuleDialog = false;
      })
    }
  }

  ChangeGRNDataR() {
    if (this.selectedGRNList.length > 0) {
      this.progressDailogBool = false;
      let arr = [];
      this.selectedGRNList.forEach(el => {
        arr.push(el.docheaderID)
      })
      this.SharedService.updateGRNnumber(JSON.stringify(arr)).subscribe(data => {
        this.successAlert("GRN Data Updated, please send the invoice to batch");
      }, err => {
        this.alertFun('Server error');
      })
    }
  }
  getGRNnumbers(po_num) {
    this.SharedService.checkGRN_PO_duplicates(po_num).subscribe((data: any) => {
      data?.result?.forEach((val)=>{
        this.grnList.push({docheaderID : val})
      })
    })
  }
  // ChangeGRNData(){
  //   if(this.selectedGRNList.length > 0 && confirm('Please confirm, the selected GRN is correct or not')) {
  //     let arr = [];
  //     this.selectedGRNList.forEach(el=>{
  //       arr.push(el.docheaderID)
  //     })
  //     this.SharedService.updateGRNnumber(JSON.stringify(arr)).subscribe(data=>{
  //       this.AlertService.addObject.detail = "GRN Data Updated, please send the invoice to batch";
  //       this.messageService.add(this.AlertService.addObject);
  //     },err=>{
  // this.alertFun('Server error');
  //     })
  //   }
  // }

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
    this.headerpop = 'Select GRN'
  }

  getPODocId(po_num) {
    this.SharedService.get_poDoc_id(po_num).subscribe((data: any) => {
      this.poDocId = data.result;
      this.SharedService.po_doc_id = data.result;
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
  // toggleFullScreen() {
  //   const viewerContainer = this.elementRef.nativeElement.querySelector('.docContaner');
  //   if (document.fullscreenElement) {
  //     document.exitFullscreen();
  //   } else {
  //     if (viewerContainer.requestFullscreen) {
  //       viewerContainer.requestFullscreen();
  //     } else if (viewerContainer.mozRequestFullScreen) { /* Firefox */
  //       viewerContainer.mozRequestFullScreen();
  //     } else if (viewerContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
  //       viewerContainer.webkitRequestFullscreen();
  //     } else if (viewerContainer.msRequestFullscreen) { /* IE/Edge */
  //       viewerContainer.msRequestFullscreen();
  //     }
  //   }
  // }
  alertFun(txt) {
    this.AlertService.errorObject.detail = txt;
    this.messageService.add(this.AlertService.errorObject);
  }
  successAlert(txt) {
    this.AlertService.addObject.severity = 'success';
    this.AlertService.addObject.detail = txt;
    this.messageService.add(this.AlertService.addObject);
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
    delete this.dataService.arenaMasterData;
    delete this.SharedService.fileSrc;
    this.mat_dlg.closeAll();
  }
}
