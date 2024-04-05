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
    { erp: 'fixed' },
    { erp: 'dynamic' },
  ]
  progress: number;
  UploadDetails: string | Blob;
  selectedERPType: any;
  selectedFileType:string;
  fileChoosen = "No file chosen";
  sa_template_path:string;
  ca_template_path:string;
  uploadBool: boolean;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private spService: ServiceInvoiceService,
    private alert: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.displayErpBoolean = this.spService.displayErpBoolean;
    this.selectedERPType = this.dataService?.configData?.erpname
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
      const reader: FileReader = new FileReader();
      // reader.onload = (e: any) => {
      //   /* read workbook */
      //   const bstr: string = e.target.result;
      //   const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      //   /* grab first sheet */
      //   let index = wb.SheetNames.findIndex(ele => {
      //     return 'Master Template' == ele;
      //   });
      //   const wsname: string = wb.SheetNames[index];
      //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      //   /* grab second sheet */
      //   let index1 = wb.SheetNames.findIndex(ele => {
      //     return 'Cost Category Template' == ele;
      //   });
      //   const wsname1: string = wb.SheetNames[index1];
      //   const ws1: XLSX.WorkSheet = wb.Sheets[wsname1];

      //   /* save data */
      //   data = XLSX.utils.sheet_to_json(ws);
      //   data1 = XLSX.utils.sheet_to_json(ws1);
      // };

      reader.readAsBinaryString(target.files[0]);

      // reader.onloadend = (e) => {
      //   this.spinnerEnabled = false;
      //   this.keys = Object.keys(data[0]);
      //   this.keys1 = Object.keys(data1[0]);
      //   this.dataSheet.next(data)
      //   this.dataSheet1.next(data1)
      // }
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
    this.selectedFileType = val;
    this.erpSelectionBoolean = true;
  }
  downloadTemplate() {
    this.spService.downloadTemplate(this.selectedERPType,this.selectedFileType).subscribe((data: any) => {
      this.excelDownload(data,'Service_template_serina');

      // this.uploadSectionBoolean = true;
      // this.displayErpBoolean = false;
      // this.spService.displayErpBoolean = false;
      this.alert.success_alert('File Downloaded Successfully.');
    }, error => {
      this.alert.error_alert('Download failed, please try again.');
    })
  }
  excelDownload(data,type){
    let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    let d = new Date();
    let datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    fileSaver.saveAs(blob, `${type}-${this.selectedFileType}-(${datestring})`);
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

            // let result = event.body.Result.result.split(" ");
            // if(result[0] != "0"){
            //   this.alert.success_alert(event.body.Result.result);
            //   this.spService.downloadRejectRecords().subscribe(data => {
            //     this.excelDownload(data,'Rejected_accounts_serina');
            //   })
            //   setTimeout(() => {
            //     this.router.navigate([`/customer/serviceProvider`]);
            //   }, 4000);
            // } else if(result[0] == result[result.length-1]){
            //   this.alert.success_alert(event.body.Result.result);
            //   setTimeout(() => {
            //     this.router.navigate([`/customer/serviceProvider`]);
            //   }, 4000);
            // } else if(result[0] == "0") {
            //   this.spService.downloadRejectRecords().subscribe(data => {
            //     this.excelDownload(data,'Rejected_accounts_serina');
            //   })
            //   this.alert.error_alert("Accounts having some issue, please try again");
            // }
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
    this.spService.saveTemplate(obj,this.selectedFileType).subscribe((data:any)=>{
      if(data.status == 'success'){
        this.alert.success_alert(data.message);
      } else {
        this.alert.error_alert(data.message); 
      }
      this.uploadBool = true;
      this.spinner.hide();

    })
  }

  // uploadFile(e: any, filetype: any,type:string) {
  //   let data = e;
  //   if( type != 'drag'){
  //     data = e.target.files[0];
  //   }
  //   if (filetype == 'sa')
  //     this.uploadProgress = 0;
  //   else if (filetype == 'ca')
  //     this.uploadProgress1 = 0;
  //   else
  //     this.uploadProgress2 = 0;
  //   const formData = new FormData();
  //   formData.append('file', data);
  //   if (filetype == 'sa') {
  //     this.uploading = true;
  //   } else if (filetype == 'ca') {
  //     this.uploading1 = true;
  //   } else if(filetype == 'va') {
  //     this.uploading2 = true;
  //   } else{
  //     this.uploading3 = true;
  //   }
  //   this.http.post(
  //     `${environment.apiURL}/${environment.apiVersion}/util/uploadTemplate/${this.active_user}/${filetype}`,
  //     formData,
  //     {
  //       reportProgress: true,
  //       observe: 'events',
  //     }
  //   )
  //     .pipe(
  //       map((event: any) => {
  //         if (event.type == HttpEventType.UploadProgress) {
  //           if (filetype == 'sa') {
  //             this.uploadProgress = Math.round((100 / event.total) * event.loaded);
  //           } else if (filetype == 'ca') {
  //             this.uploadProgress1 = Math.round((100 / event.total) * event.loaded);
  //           } else if (filetype == 'va') {
  //             this.uploadProgress2 = Math.round((100 / event.total) * event.loaded);
  //           }
  //         } else if (event.type == HttpEventType.Response) {
  //           if (filetype == 'sa') {
  //             this.safilepath = event.body["filepath"];
  //             this.uploading = false;
  //           } else if (filetype == 'ca') {
  //             this.cafilepath = event.body["filepath"];
  //             this.uploading1 = false;
  //           } else if(filetype == 'va') {
  //             this.vafilepath = event.body["filepath"];
  //             this.uploading2 = false;
  //           } else if(filetype == 'ct'){
  //             this.ctfilepath = event.body["filepath"];
  //           }
  //           if (this.templates[0].selected && !this.templates[1].selected) {
  //             if (this.safilepath != '' && this.cafilepath != '') {
  //               this.filesuploaded = true;
  //             }
  //           }
  //           if (this.templates[1].selected && !this.templates[0].selected) {
  //             if (this.vafilepath != '') {
  //               this.filesuploaded = true;
  //             }
  //           }
  //           if (this.templates[1].selected && !this.templates[0].selected && this.doctypes[0].selected && this.doctypes[1].selected) {
  //             if (this.vafilepath != '' && this.ctfilepath != '') {
  //               this.filesuploaded = true;
  //             }
  //           }
  //           if (this.templates[1].selected && !this.templates[0].selected && !this.doctypes[0].selected && this.doctypes[1].selected) {
  //             if (this.ctfilepath != '') {
  //               this.filesuploaded = true;
  //             }
  //           }
  //           if (this.templates[0].selected && this.templates[1].selected && this.doctypes[1].selected) {
  //             if (this.safilepath != '' && this.cafilepath != '' && this.vafilepath != '' && this.ctfilepath != "") {
  //               this.filesuploaded = true;
  //             }
  //           }
  //           if (this.templates[0].selected && this.templates[1].selected && !this.doctypes[1].selected) {
  //             if (this.safilepath != '' && this.cafilepath != '' && this.vafilepath != '') {
  //               this.filesuploaded = true;
  //             }
  //           }
  //           if(this.filesuploaded){
  //             this.showcomplete = true;
  //           }
  //         }
  //       }),
  //       catchError((err: any) => {
  //         this.uploading = false;
  //         this.uploading1 = false;
  //         this.uploading2 = false;
  //         return throwError(err.message);
  //       })
  //     )
  //     .toPromise();
  // }


}
