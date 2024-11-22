import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ImportExcelService {

  constructor(private router: Router) { }

  exportExcel(data) {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      let filename = "InvoiceData"
      if(this.router.url.includes('roles')){
        filename = "userReport"
      }
      this.saveAsExcelFile(excelBuffer,filename );
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
