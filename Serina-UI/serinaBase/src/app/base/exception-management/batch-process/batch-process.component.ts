import { SharedService } from 'src/app/services/shared.service';
import { PermissionService } from './../../../services/permission.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlertService } from './../../../services/alert/alert.service';
import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { ImportExcelService } from './../../../services/importExcel/import-excel.service';
import { TaggingService } from './../../../services/tagging.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, Location } from '@angular/common';
import { DataService } from 'src/app/services/dataStore/data.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';

@Component({
  selector: 'app-batch-process',
  templateUrl: './batch-process.component.html',
  styleUrls: ['./batch-process.component.scss'],
})
export class BatchProcessComponent implements OnInit {
  ColumnsForBatch = [
    { field: 'docheaderID', header: 'Invoice Number' },
    { field: 'VendorName', header: 'Vendor Name' },
    { field: 'EntityName', header: 'Entity Name' },
   
    { field: 'CreatedOn', header: 'Uploaded Date' },
    { field: 'PODocumentID', header: 'PO number' },
    { field: 'sender', header: 'Sender' },
    { field: 'status', header: 'Status' },
    { field: 'totalAmount', header: 'Amount' },
  ];
  ColumnsForBatchPO = [
    // { field: 'docheaderID', header: 'Invoice Number' },
    { field: 'VendorName', header: 'Customer Name' },
    { field: 'EntityName', header: 'Entity Name' },
   
    { field: 'CreatedOn', header: 'Uploaded Date' },
    { field: 'PODocumentID', header: 'PO number' },
    { field: 'sender', header: 'Sender' },
    { field: 'status', header: 'Status' },
    { field: 'totalAmount', header: 'Amount' },
  ];
  serviceColumns = [
    { field: 'docheaderID', header: 'Invoice Number' },
    { field: 'ServiceProviderName', header: 'Serviceprovider Name' },
    { field: 'Account', header: 'Serviceprovider A/C' },
    { field: 'EntityName', header: 'Entity Name' },
    { field: 'status', header: 'Status' },
    { field: 'sourcetype', header: 'Source' },
    { field: 'CreatedOn', header: 'Uploaded Date' },
    { field: 'totalAmount', header: 'Amount' },
  ];
  columnsData = [];
  columnsDataPO = [];
  showPaginatorAllInvoice: boolean;
  columnsToDisplay = [];
  columnsToDisplayPO = [];

  ColumnsForBatchApproval = [
    { field: 'docheaderID', header: 'Invoice Number' },
    { field: 'VendorName', header: 'Vendor Name' },
    { field: 'Name', header: 'Rule' },
    // { field: 'documentdescription', header: 'Description' },
    // { field: 'All_Status', header: 'Status' },
    { field: 'Approvaltype', header: 'Approval Type' },
    { field: 'totalAmount', header: 'Amount' },
  ];
  columnsToDisplayBatchApproval = [];
  viewType: any;
  allSearchInvoiceString: any[];
  rangeDates: Date[];
  dataLength: number;
  columnsDataAdmin: any[];
  showPaginatorApproval: boolean;
  dataLengthAdmin: number;
  batchProcessColumnLength: number;
  approvalPageColumnLength: number;
  batchProcessPOColumnLength : number
  dashboardViewBoolean: boolean;
  heading: string;
  partytype:string;
  isVendorBoolean:boolean;
  apprveBool: any;
  invoceDoctype: boolean;
  datalengthPO: number;
  showPaginatorAllPO: boolean;
  filterData: any[];
  minDate: Date;
  maxDate: Date;
  portalName:string;

  isDesktop: boolean;

  constructor(
    private tagService: TaggingService,
    private ImportExcelService: ImportExcelService,
    private ngxSpinner: NgxSpinnerService,
    private MessageService: MessageService,
    private alertService: AlertService,
    private router: Router,
    private exceptionService: ExceptionsService,
    private permissionService : PermissionService,
    private sharedService :SharedService,
    private ds: DataService,
    private datePipe :DatePipe,
    private dateFilterService :DateFilterService
  ) {}

  ngOnInit(): void {
    this.apprveBool = this.ds.configData?.enableApprovals;
    this.portalName = this.ds.portalName;
    this.isDesktop = this.ds.isDesktop;
    if(this.permissionService.excpetionPageAccess == true){
      if(this.ds.ap_boolean){
        this.invoceDoctype = true;
        this.partytype ='Vendor';
        this.tagService.batchProcessTab = 'normal';
        this.viewType = 'normal';
      } else {
        this.partytype ='Customer';
        this.tagService.batchProcessTab = 'PODoc';
        this.viewType = 'PODoc';
      }
      // if(!this.tagService.batchProcessTab){
      //   if(this.invoceDoctype){
      //     this.viewType = 'normal';
      //   } else {
      //     this.viewType = 'PODoc';
      //   }
      //   console.log(this.viewType)
      //   this.tagService.batchProcessTab = this.viewType

      // } else {
      //   this.viewType = this.tagService.batchProcessTab;
      //   console.log(this.viewType)
      // }
      if(!this.isDesktop){
        this.mob_columns();
      }
      this.findRoute();
      this.dateRange();
    } else{
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }

  }
  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  mob_columns() {
    this.ColumnsForBatch = [
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'VendorName', header: 'Vendor Name' },
      { field: 'EntityName', header: 'Entity Name' },
      { field: 'status', header: 'Status' },
    ];
    this.ColumnsForBatchPO = [
      { field: 'VendorName', header: 'Customer Name' },
      { field: 'EntityName', header: 'Entity Name' },
      { field: 'PODocumentID', header: 'PO number' },
      { field: 'status', header: 'Status' },
    ];
    this.serviceColumns = [
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'ServiceProviderName', header: 'Serviceprovider Name' },
      { field: 'Account', header: 'Serviceprovider A/C' },
      { field: 'status', header: 'Status' },
    ];
  }

  findRoute() {
    if (
      this.router.url.includes(
        'ExceptionManagement/Service_ExceptionManagement'
      )
    ) {
      this.heading = 'Service based OCR Exceptions';
      this.viewType = 'normal';
      this.isVendorBoolean = false;
      this.ColumnsForBatch = this.serviceColumns;
      this.getServiceInvoiceData();
    } else {
      this.heading = `${this.partytype} based Exception`;
      this.isVendorBoolean = true;
      this.getBatchInvoiceData();
      if(this.apprveBool && this.portalName == 'customer'){
        this.getApprovalBatchData();
      }

    }
    if (this.router.url.includes('home')) {
      this.dashboardViewBoolean = true;
    } else {
      this.dashboardViewBoolean = false;
    }
    this.prepareColumnsArray();
  }
  // to prepare display columns array
  prepareColumnsArray() {
    if (this.dashboardViewBoolean == true) {
      this.ColumnsForBatch = this.ColumnsForBatch.filter((ele) => {
        return ele.header != 'Status';
      });
    } 
    this.ColumnsForBatch.filter((element) => {
      this.columnsToDisplay.push(element.field);
      // this.invoiceColumnField.push(element.field)
    });
    this.ColumnsForBatchPO.filter((element) => {
      this.columnsToDisplayPO.push(element.field);
      // this.invoiceColumnField.push(element.field)
    });
    this.ColumnsForBatchApproval.filter((ele) => {
      this.columnsToDisplayBatchApproval.push(ele.field);
    });

    this.batchProcessColumnLength = this.ColumnsForBatch.length + 1;
    this.approvalPageColumnLength = this.ColumnsForBatchApproval.length + 1;
    this.batchProcessPOColumnLength = this.ColumnsForBatchPO.length + 1;
  }

  chooseEditedpageTab(value) {
    this.viewType = value;
    this.tagService.batchProcessTab = value;
    this.allSearchInvoiceString = [];
  }

  searchInvoiceDataV(value) {
    // this.allSearchInvoiceString = []
    this.allSearchInvoiceString = value.filteredValue;
  }

  getBatchInvoiceData() {
    this.ngxSpinner.show();
    this.exceptionService.readBatchInvoicesData().subscribe(
      (data: any) => {
        const batchData = [];
        data.forEach((element) => {
          let mergeData = {
            ...element.Document,
            ...element.DocumentSubStatus,
            ...element.Entity,
            ...element.Vendor,
          };
          batchData.push(mergeData);
        });
        // this.columnsData = batchData.sort((a,b)=>{
        //   let c = new Date(a.CreatedOn).getTime();
        //   let d = new Date(b.CreatedOn).getTime();
        //   return d-c });
        batchData.forEach(ele=>{
          if(ele.idDocumentType == 3){
            this.columnsData.push(ele);
            this.filterData = this.columnsData;
          } else if (ele.idDocumentType == 1){
            this.columnsDataPO.push(ele);
            this.filterData = this.columnsDataPO;
          }
        })
        this.dataLength = this.columnsData.length;
        if (this.dataLength > 10) {
          this.showPaginatorAllInvoice = true;
        }

        this.datalengthPO = this.columnsDataPO.length;
        if (this.datalengthPO > 10) {
          this.showPaginatorAllPO = true;
        }
        this.ngxSpinner.hide();
      },
      (error) => {
        this.ngxSpinner.hide();
        this.alertService.errorObject.detail = error.statusText;
        this.MessageService.add(this.alertService.errorObject);
      }
    );
  }

  getApprovalBatchData() {
    this.ngxSpinner.show();
    this.exceptionService.readApprovalPendingData().subscribe(
      (data: any) => {
        const batchData = [];
        data.result.pending_approval_invoice.forEach((element) => {
          let mergeData = {
            ...element.Document,
            ...element.Entity,
            ...element.Vendor,
          };
          mergeData.status= element.docstatus;
          batchData.push(mergeData);
        });
        this.columnsDataAdmin = batchData;
        this.dataLengthAdmin = this.columnsDataAdmin.length;
        if (this.dataLengthAdmin > 10) {
          this.showPaginatorApproval = true;
        }
        this.ngxSpinner.hide();
      },
      (error) => {
        this.ngxSpinner.hide();
        this.alertService.errorObject.detail = error.statusText;
        this.MessageService.add(this.alertService.errorObject);
      }
    );
  }
  getServiceInvoiceData() {
    this.ngxSpinner.show();
    this.sharedService.readEditedServiceInvoiceData().subscribe(
      (data: any) => {
        let invoiceArray = [];
        data.exception_service_invoices.forEach((element) => {
          let invoices = {
            ...element.Document,
            ...element.DocumentSubStatus,
            ...element.Entity,
            ...element.ServiceProvider,
            ...element.ServiceAccount,
          };
          invoiceArray.push(invoices);
        });
        this.columnsData = invoiceArray.sort((a,b)=>{
          let c = new Date(a.CreatedOn).getTime();
          let d = new Date(b.CreatedOn).getTime();
          return d-c });
        this.filterData = this.columnsData;
        this.dataLength = this.columnsData.length;
        if (this.dataLength > 10) {
          this.showPaginatorAllInvoice = true;
        }
        this.ngxSpinner.hide();
      },
      (error) => {
        this.ngxSpinner.hide();
        this.alertService.errorObject.detail = error.statusText;
        this.MessageService.add(this.alertService.errorObject);
      }
    );
  }
  exportExcel() {
    let exportData = [];
    if (this.tagService.batchProcessTab == 'normal') {
      exportData = this.columnsData;
    } else if (this.tagService.batchProcessTab == 'editApproveBatch') {
      exportData = this.columnsDataAdmin;
    }
    if (this.allSearchInvoiceString && this.allSearchInvoiceString.length > 0) {
      this.ImportExcelService.exportExcel(this.allSearchInvoiceString);
    } else if (exportData && exportData.length > 0) {
      this.ImportExcelService.exportExcel(exportData);
    } else {
      alert('No Data to import');
    }
  }
  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
        this.columnsData = this.filterData;
        this.columnsData = this.columnsData.filter((element) => {
          const dateF = this.datePipe.transform(element.CreatedOn, 'yyyy-MM-dd')
          return dateF >= frmDate && dateF <= toDate;
        });
        this.dataLength = this.columnsData.length;
    } else {
      this.columnsData = this.filterData;
      this.dataLength = this.columnsData.length;
    }
  }
  clearDates() {
    this.filterByDate('');
  }

}
