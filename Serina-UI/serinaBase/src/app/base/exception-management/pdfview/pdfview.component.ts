import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/services/shared.service';
import * as fileSaver from 'file-saver';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.scss','../../invoice/view-invoice/view-invoice.component.scss']
})
export class PDFviewComponent implements OnInit {
  isImgBoolean;
  isLoaded:boolean;
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  zoomX = 1;
  orgX = '0px';
  orgY = '0px';
  @ViewChild('pdfviewer') pdfviewer;
  showInvoice: string;
  content_type: any;
  imageCanvas: HTMLImageElement;
  isPdfAvailable: boolean;
  zoomVal: number = 0.8;
  rotation = 0;
  @Input() vendorName: any;
  @Input() invoiceNumber: any;
  showPdf: boolean;
  @Input() btnText;
  zoomdata: number = 1;
  page: number = 1;
  totalPages: number;
  @Output() public boolEmit: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() PdfBtnClick: EventEmitter<boolean> =
  new EventEmitter<boolean>();
  isDesktop: any;

  constructor(private SpinnerService: NgxSpinnerService,
    private SharedService : SharedService,
    private elementRef : ElementRef,
    private ds : DataService) { }

  ngOnInit(): void {
    this.isDesktop = this.ds.isDesktop;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.SharedService.invoiceID && !this.SharedService.fileSrc){
      this.readFilePath();
    } else {
      this.showInvoice = this.SharedService.fileSrc;
    }
   }

  readFilePath() {
    this.showInvoice = '';
    this.SpinnerService.show();
    this.SharedService.getInvoiceFilePath().subscribe(
      (data: any) => {
        this.content_type = data?.result?.content_type;
        let byteArray ;
        if (
          data.result.filepath &&
          data.result.content_type == 'application/pdf'
        ) {
          this.isPdfAvailable = false;
          this.isImgBoolean = false;

          /*covert base64 to blob */
          byteArray = new Uint8Array(
            atob(data.result.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([byteArray], { type: 'application/pdf' })
          );
          this.SharedService.fileSrc = this.showInvoice;
        } else if (data.result.content_type == 'image/jpg' || data.result.content_type == 'image/png') {
          let filetype = data.result.content_type
          this.isPdfAvailable = false;
          this.isImgBoolean = true;
          byteArray = new Uint8Array(
            atob(data.result.filepath)
              .split('')
              .map((char) => char.charCodeAt(0))
          );
          this.showInvoice = window.URL.createObjectURL(
            new Blob([byteArray], { type: filetype })
          );
          this.SharedService.fileSrc = this.showInvoice;
          this.loadImage();
        } else {
          this.isPdfAvailable = true;
          this.showInvoice = '';
        }
        this.boolEmit.emit(this.isPdfAvailable)
        this.SpinnerService.hide();
      },
      // (error) => {
      //   this.SpinnerService.hide();
      //   this.errorTriger('Server error');
      // }
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
    if(this.isImgBoolean){
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
    } else {
      this.zoomdata = this.zoomdata + 0.1;
    }
  }

  zoomOut() {
    if(this.isImgBoolean) {
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
    } else {
      this.zoomdata = this.zoomdata - 0.1;
    }
  }
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  viewPdf() {
    this.showPdf = !this.showPdf;
    if (this.showPdf != true) {
      this.btnText = 'View PDF';
    } else {
      this.btnText = 'Close';
    }
    this.loadImage();
    this.PdfBtnClick.emit(this.showPdf);
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

}
