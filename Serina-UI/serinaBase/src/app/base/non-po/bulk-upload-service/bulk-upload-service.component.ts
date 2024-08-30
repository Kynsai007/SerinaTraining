import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceInvoiceService } from 'src/app/services/serviceBased/service-invoice.service';
import { environment } from 'src/environments/environment.prod';
import * as XLSX from 'xlsx';
import * as fileSaver from 'file-saver';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { DatePipe } from '@angular/common';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-bulk-upload-service',
  templateUrl: './bulk-upload-service.component.html',
  styleUrls: ['./bulk-upload-service.component.scss']
})
export class BulkUploadServiceComponent implements OnInit {
  spinnerEnabled = false;
  btnEnabled = false;
  keys: string[];
  dataSheet = new Subject();
  dataSheet1 = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  keys1: string[];
  erpSelectionBoolean: boolean;
  uploadSectionBoolean: boolean;
  displayErpBoolean;
  ERPList = [
    { erp: 'Fixed'},
    { erp: 'Dynamic' },
  ]
  progress: number;
  UploadDetails: string | Blob;
  selectedERPType: any;
  selectedFileType:string;
  fileChoosen = "No file chosen";
  sa_template_path:string;
  ca_template_path:string;
  uploadBool: boolean;

  displayYear;
  minDate: Date;
  maxDate: Date;
  lastYear: number;
  selectedMonth: Date;
  client_name:string;
  currentTab: string = 'bulk';

  columnsData = [];
  showPaginatorAllInvoice: boolean;
  columnsToDisplayInvoke = [];
  selectedEntityId: any;
  erpTriggerBoolean: boolean;

  totalTableData = [];
  columnsForTotal = [];
  totalColumnHeader = [];
  totalColumnField = [];
  ColumnLengthtotal: any;
  showPaginatortotal: boolean;
  entity: any;
  dataLength: number;
  showInvokeBtnBoolean: boolean;
  isTableView: boolean;
  isReupload: boolean = false;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private spService: ServiceInvoiceService,
    private alert: AlertService,
    private dataService: DataService,
    private datePipe : DatePipe,
    private mat_dlg: MatDialog,
    private exceptionService: ExceptionsService) {
      this.dataService.isTableView.subscribe(bool => {
        this.isTableView = bool;
      });
     }

  ngOnInit(): void {
    this.displayErpBoolean = this.spService.displayErpBoolean;
    this.selectedERPType = this.dataService?.configData?.erpname;
    this.getDate();
    this.prepareColumns();
    // this.readBatchData();
    this.tableDataForBatch();
    this.getEntitySummary();
    this.client_name = this.dataService.configData.client_name;
  }

  onChange(evt) {
    this.UploadDetails = evt.target.files[0];
    this.fileChoosen = evt.target.files[0].name;
    let data, data1, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.uploadXlFile();
      this.spinnerEnabled = true;
    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  removeData() {
    this.btnEnabled = false;
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.dataSheet1.next(null);
    this.keys = null;
    this.keys1 = null;
  }

  selectedErp(val) {
    this.selectedFileType = val.toLowerCase();
    this.erpSelectionBoolean = true;
  }
  downloadTemplate() {
    let monthInfo = '';
    let datestr = this.datePipe.transform(this.selectedMonth, "MM-yyyy");

    if(this.selectedFileType == 'dynamic'){
      monthInfo = `?monthyear=${datestr}`
    }
    this.spService.downloadTemplate(this.selectedERPType,this.selectedFileType,monthInfo).subscribe((data: any) => {
      this.excelDownload(data,'Service_template_serina');
      this.alert.success_alert('File Downloaded Successfully.');
    }, error => {
      this.alert.error_alert('Download failed, please try again.');
    })
  }
  excelDownload(data,type){
    let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
    let datestr = this.datePipe.transform(this.selectedMonth, "MMM-yyyy");
    fileSaver.saveAs(blob, `${type}-${this.selectedFileType}-(${datestr})`);
  }
  uploadXlFile() {
    this.spinner.show();
    this.progress = 1;
    const formData = new FormData();
    formData.append("file", this.UploadDetails);

    this.http
      .post(`${environment.apiUrl}/${environment.apiVersion}/SP/uploadTemplate/${this.spService.userId}`, formData, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);

          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
            this.sa_template_path = event.body.filepath;
            this.btnEnabled = true;
            this.uploadBool = true;
          }
          this.spinner.hide();

        }),
        catchError((err: any) => {
          this.progress = null;
          this.spinner.hide();
          this.alert.error_alert("Upload failed, please try again");
          return throwError(err.message);
        })
      )
      .toPromise();
  }

  uploadFiles(){
    this.spinner.show();
    this.uploadBool = false;
    let obj = {
      "sa_template_path": this.sa_template_path
    }
    this.spService.saveTemplate(obj,this.selectedFileType,this.isReupload).subscribe((data:any)=>{
      if(data.status == 'success'){
        this.alert.success_alert(data.message);
        delete this.UploadDetails ;
        delete this.fileChoosen;
        this.btnEnabled = false;
        this.inputFile.nativeElement.value = '';
      } else {
        this.alert.error_alert(data.message); 
      }
      this.uploadBool = true;
      this.spinner.hide();

    })
  }

  reuploadConfirm(bool){
    if(bool){
      const drf: MatDialogRef<ConfirmationComponent> = this.confirmFun('Are you sure you want to re-upload?','confirmation','Confirmation')

      drf.afterClosed().subscribe((bool:boolean) => {
        this.isReupload = bool;
      })
    }
  }
  confirmFun(body,type,head){
    return this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body:body , type: type, heading: head, icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
    })
  }
  getDate() {
    // this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let today = new Date();
    let month = today.getMonth();
    // this.selectedMonth = this.months[month];
    let year = today.getFullYear();
    this.lastYear = year - 5;
    this.displayYear = `${this.lastYear}:${year}`;
    let prevYear = year - 5;

    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(prevYear);

    this.maxDate = new Date();
    this.maxDate.setMonth(month);
    this.maxDate.setFullYear(year);
  }
  changeTab(val:string){
    this.currentTab = val
  }
    // to prepare display columns array
    prepareColumns() {
      this.columnsForTotal = [
        // { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
        // { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
        // { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
        { dbColumnname: 'EntityName', columnName: 'Entity' },
        { dbColumnname: 'started_on', columnName: 'Started time' },
        { dbColumnname: 'compeleted_on', columnName: 'End time' },
        { dbColumnname: 'status', columnName: 'Batch Status' },
      ];
  
      this.columnsForTotal.forEach((e) => {
        this.totalColumnHeader.push(e.columnName);
        this.totalColumnField.push(e.dbColumnname);
      });
  
      this.ColumnLengthtotal = this.columnsForTotal.length;
    }
    readBatchData() {
      this.spinner.show();
      this.exceptionService.readInvokeBatchData().subscribe(
        (data: any) => {
          const batchData = [];
          data.forEach((element) => {
            let mergeData = {
              ...element.Document,
              ...element.DocumentSubStatus,
              ...element.Rule,
              ...element.Vendor,
            };
            batchData.push(mergeData);
          });
          this.columnsData = batchData;
          this.dataLength = this.columnsData.length;
          if (this.dataLength > 10) {
            this.showPaginatorAllInvoice = true;
          }
          if (this.dataLength > 0) {
            this.showInvokeBtnBoolean = true;
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alert.error_alert("Server error");
        }
      );
    }
  
  
    getEntitySummary() {
      this.spService.getSummaryEntity().subscribe((data: any) => {
        this.entity = data.result;
      });
    }
  
    selectEntity(value){
      this.selectedEntityId = value;
      this.erpTriggerBoolean = true;
    }
  
    triggerBatch(){
      let triggerData = {
        "entity_ids": [
          this.selectedEntityId
        ]
      }
      this.spService.triggerBatch(triggerData).subscribe(data=>{
        this.alert.success_alert(data.result);
      },err=>{
        this.alert.error_alert("Server error");
      })
    }
  
    tableDataForBatch(){
      this.spService.triggerBatchHistory().subscribe((data:any)=>{
        const batchData = [];
          data.result.forEach((element) => {
            let mergeData = {
              ...element.BatchTriggerHistory
            };
            mergeData.EntityName = element.EntityName
            batchData.push(mergeData);
          });
          this.totalTableData = batchData;
          if (this.totalTableData.length > 10) {
            this.showPaginatortotal = true;
          }
      })
    }
}
