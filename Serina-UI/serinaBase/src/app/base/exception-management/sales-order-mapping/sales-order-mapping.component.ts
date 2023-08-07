import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { SharedService } from 'src/app/services/shared.service';
import { TaggingService } from 'src/app/services/tagging.service';
import { FormCanDeactivate } from '../../can-deactivate/form-can-deactivate';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from './../../../services/alert/alert.service';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { PermissionService } from 'src/app/services/permission.service';
import IdleTimer from '../../idleTimer/idleTimer';
import * as fileSaver from 'file-saver';
import { DataService } from 'src/app/services/dataStore/data.service';
@Component({
  selector: 'app-sales-order-mapping',
  templateUrl: './sales-order-mapping.component.html',
  styleUrls: ['./sales-order-mapping.component.scss','../../invoice/view-invoice/view-invoice.component.scss']
})
export class SalesOrderMappingComponent extends FormCanDeactivate implements OnInit {
  
  @ViewChild('canvas') canvas;
  @ViewChild('form')
  form: NgForm;
  editable:boolean;
  submitBtn_boolean:boolean;
  isPdfAvailable:boolean;
  showPdf:boolean = true;
  isImgBoolean:boolean;
  currentTab = 'customer';
  masterDialog:boolean;
  rejectDialog:boolean;
  rejectionComments:string;
  customerData:any;
  headerData:any;
  invoiceID: any;
  btnText = 'Close';
  lineTable = [
    { header: 'Description', field: 'Description'},
    { header: 'Unit', field: 'Unit'},
    { header: 'Price', field: 'UnitPrice'},
    { header: 'Quantity', field: 'Quantity'},
    { header: 'Amount', field: 'amount'}
  ];
  zoomVal: number = 0.8;
  fileSrc: any;
  byteArray: BlobPart;
  content_type: any;
  headerName = 'Edit PO';
  innerHeight: number;
  InvoiceHeight: number = 560;
  zoomdata: number = 1;
  showInvoice: any;
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  rotation = 0;
  poLinedata = [];
  soLinedata = [];
  userDetails: any;
  portalName: string;
  vendorName: any;
  invoiceNumber: any;
  isAmtStr: boolean;
  updateInvoiceData = [];
  timer: any;
  callSession: any;
  headerpop: string;
  progressDailogBool: boolean;
  GRNDialogBool: boolean;
  batchData: any;
  docType = 3;

  constructor(private Es: ExceptionsService,
    private SharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private tagService: TaggingService,
    private SpinnerService: NgxSpinnerService,
    private AlertService: AlertService,
    private messageService: MessageService,
    private _location : Location,
    private elementRef: ElementRef,
    private authService : AuthenticationService,
    private mat_dlg: MatDialog,
    private router : Router,
    private permissionService : PermissionService,
    private dataService : DataService) { 
      super();
    }

  ngOnInit(): void {
    this.userDetails = this.authService.currentUserValue;
    if (this.userDetails.user_type == 'vendor_portal') {
      this.portalName = 'vendorPortal';
    } else {
      this.portalName = 'customer'
    }
    this.editable = this.tagService.editable;
    this.submitBtn_boolean = this.tagService.submitBtnBoolean;
    const routeIdCapture = this.activatedRoute.params.subscribe((params) => {
      this.SharedService.invoiceID = params['id'];
      this.Es.invoiceID = params['id'];
      this.invoiceID = params['id'];
    });
    this.readDocumentData();
    this.readFilePath();
  }

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
  initialData(){
    this.updateSessionTime();
    this.idleTimer(180, 'Start');
    this.callSession = setTimeout(() => {
      this.updateSessionTime();
    }, 250000);
  }
  idleTimer(time, str) {
    this.timer = new IdleTimer({
      timeout: time, //expired after 180 secs
      clean: str,
      onTimeout: () => {
        if (this.router.url.includes('comparision-docs')) {
          this.router.navigate([`${this.portalName}/ExceptionManagement`]);
        }
        this.alertFun("Session Expired for Editing Invoice");
      },
    });
  }
  updateSessionTime() {
    let sessionData = {
      session_status: true,
      "client_address": JSON.parse(localStorage.getItem('userIp'))
    };
    this.Es
      .updateDocumentLockInfo(JSON.stringify(sessionData))
      .subscribe((data: any) => { });
  }
  
  AddPermission() {
    // if (
    //   this.permissionService.editBoolean == true &&
    //   this.permissionService.changeApproveBoolean == false &&
    //   this.permissionService.financeApproveBoolean == false
    // ) {
    //   this.editPermissionBoolean = true;
    // } else if (
    //   this.permissionService.editBoolean == true &&
    //   this.permissionService.changeApproveBoolean == true &&
    //   this.permissionService.financeApproveBoolean == false
    // ) {
    //   this.changeApproveBoolean = true;
    // } else if (
    //   this.permissionService.editBoolean == true &&
    //   this.permissionService.changeApproveBoolean == true &&
    //   this.permissionService.financeApproveBoolean == true
    // ) {
    //   this.financeApproveBoolean = true;
    // }
  }
  changeTab(val) {
    this.currentTab = val;
    if(val== 'line'){
      this.showPdf = false;
      this.btnText = 'View PDF';
    } else {
      this.showPdf = true;
      this.btnText = 'Close';
    }
  }

  readDocumentData(){
    this.Es.getDocumentDetails().subscribe((data:any)=>{
      console.log(data)
      this.poLinedata = data.polinedata;
      this.soLinedata = data.solinedata;
      const pushedArrayHeader = [];
        data.headerdata.forEach((element) => {
          let mergedArray = {
            ...element.DocumentData,
            ...element.DocumentTagDef,
          };
          mergedArray.DocumentUpdates = element.DocumentUpdates;
          pushedArrayHeader.push(mergedArray);
        });
        this.headerData = pushedArrayHeader;
        this.customerData = {
          ...data.customerdata[0].Vendor,
          ...data.customerdata[0].VendorAccount,
          ...data.customerdata[0].VendorUser,
        };
        let inv_num_data: any = this.headerData.filter((val) => {
          return (val.TagLabel == 'InvoiceId') || (val.TagLabel == 'bill_number');
        });
        this.invoiceNumber = inv_num_data[0]?.Value;
        // this.vendorAcId = this.vendorData['idVendorAccount'];
        this.vendorName = this.customerData['VendorName'];
    })
  }

  readFilePath() {
    this.fileSrc = '';
    this.SpinnerService.show();
    this.Es.readFilePath().subscribe(
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
          this.fileSrc = window.URL.createObjectURL(
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
          this.fileSrc = window.URL.createObjectURL(
            new Blob([this.byteArray], { type: data.content_type })
          );
          this.loadImage();
        } else {
          this.isPdfAvailable = true;
          this.fileSrc = '';
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
        this.alertFun("Server error");
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
        image.src = this.fileSrc;
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
    }
    let updateValue = {
      documentLineItemID: data.idDocumentLineItems,
      OldValue: data.Value || '',
      NewValue: value,
    };
    this.updateInvoiceData.push(updateValue);
  }

  saveChanges() {
    if (!this.isAmtStr) {
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
      this.alertFun('Strings are not allowed in the amount and quantity fields.')
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

  approveChangesBatch() {
    this.readDocumentData();
    setTimeout(() => {
      let count = 0;
      let errorType: string;
      let errorTypeHead: string;
      let errorTypeLine: string;
      this.headerData.forEach((data: any) => {
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

      // this.poLinedata.forEach((element) => {
      //   if (
      //     element.tagname == 'Quantity' ||
      //     element.tagname == 'UnitPrice' ||
      //     element.tagname == 'AmountExcTax' ||
      //     element.tagname == 'Amount'
      //   ) {
      //     element.items.forEach((ele) => {
      //       ele.linedetails.forEach((ele1) => {
      //         if (
      //           ele1.invline[0].DocumentLineItems?.Value == '' ||
      //           isNaN(+ele1.invline[0].DocumentLineItems?.Value)
      //         ) {
      //           count++;
      //           errorTypeLine = 'AmountLine';
      //         }

      //         if (element.tagname == 'Quantity') {
      //           if (
      //             ele1.invline[0].DocumentLineItems?.Value == 0
      //           ) {
      //             count++;
      //             errorTypeLine = 'quntity';
      //           }
      //         }
      //       });
      //     });
      //   }
      // });
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
    this.Es.send_batch_approval().subscribe(
      (data: any) => {
        this.dataService.invoiceLoadedData = [];
        this.SpinnerService.hide();
        this.successAlert('send to batch successfully');
        this.SharedService.syncBatchTrigger(`?re_upload=false&doctype=${this.docType}`).subscribe((data: any) => {
          this.headerpop = 'Batch Progress'
          this.progressDailogBool = true;
          this.GRNDialogBool = false;
          this.batchData = data[this.invoiceID]?.complete_status;
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
    this.Es.invoiceID = this.invoiceID;
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
        sub_status == 33 ||
        sub_status == 21 ||
        sub_status == 27) {
        this.updateAlert('Suggestion', 'Please check the values in invoice.');
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
        this.updateAlert('Suggestion', 'Please check the values in invoice.');
      } else if (sub_status == 34) {
        this.updateAlert('Suggestion', 'Please compare the PO lines with invoices and we recommend PO flip method to solve this issues.')
      } else if (sub_status == 7 || sub_status == 23 || sub_status == 10) {
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
    this._location.back();
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

  toggleFullScreen() {
    const viewerContainer = this.elementRef.nativeElement.querySelector('.docContaner');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (viewerContainer.requestFullscreen) {
        viewerContainer.requestFullscreen();
      } else if (viewerContainer.mozRequestFullScreen) { /* Firefox */
        viewerContainer.mozRequestFullScreen();
      } else if (viewerContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        viewerContainer.webkitRequestFullscreen();
      } else if (viewerContainer.msRequestFullscreen) { /* IE/Edge */
        viewerContainer.msRequestFullscreen();
      }
    }
  }

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
      "client_address": JSON.parse(localStorage.getItem('userIp'))
    };
    this.Es
      .updateDocumentLockInfo(sessionData)
      .subscribe((data: any) => { });
    clearTimeout(this.callSession);
    this.AlertService.addObject.severity = 'success';
    this.tagService.financeApprovePermission = false;
    this.tagService.approveBtnBoolean = false;
    this.tagService.submitBtnBoolean = false;
    this.dataService.grnWithPOBoolean = false;
    this.mat_dlg.closeAll();
  }
}
