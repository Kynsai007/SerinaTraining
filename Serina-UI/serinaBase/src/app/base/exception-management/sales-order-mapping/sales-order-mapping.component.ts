import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { SharedService } from 'src/app/services/shared.service';
import { TaggingService } from 'src/app/services/tagging.service';
import { FormCanDeactivate } from '../../can-deactivate/form-can-deactivate';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from './../../../services/alert/alert.service';
import { Location } from '@angular/common';

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
  btnText = 'View PDF';
  lineTable = [
    { header: 'Description', field: 'description'},
    { header: 'Unit Price', field: 'unitprice'},
    { header: 'Quantity', field: 'quantity'},
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

  constructor(private Es: ExceptionsService,
    private SharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private tagService: TaggingService,
    private SpinnerService: NgxSpinnerService,
    private AlertService: AlertService,
    private messageService: MessageService,
    private _location : Location) { 
      super();
    }

  ngOnInit(): void {
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

  changeTab(val) {
    this.currentTab = val;
    if(val== 'line'){
      this.showPdf = false;
    } else {
      this.showPdf = true;
    }
  }

  readDocumentData(){
    this.Es.getDocumentDetails().subscribe((data:any)=>{
      console.log(data)
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
        // this.vendorAcId = this.vendorData['idVendorAccount'];
        // this.vendorName = this.vendorData['VendorName'];
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
  backToInvoice() {
    this._location.back();
  }
  alertFun(txt) {
    this.AlertService.errorObject.detail = txt;
    this.messageService.add(this.AlertService.errorObject);
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

}
