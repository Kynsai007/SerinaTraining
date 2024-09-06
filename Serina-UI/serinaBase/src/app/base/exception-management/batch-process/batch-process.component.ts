import { SharedService } from 'src/app/services/shared.service';
import { PermissionService } from './../../../services/permission.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AlertService } from './../../../services/alert/alert.service';
import { ExceptionsService } from './../../../services/exceptions/exceptions.service';
import { ImportExcelService } from './../../../services/importExcel/import-excel.service';
import { TaggingService } from './../../../services/tagging.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe, Location } from '@angular/common';
import { DataService } from 'src/app/services/dataStore/data.service';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-batch-process',
  templateUrl: './batch-process.component.html',
  styleUrls: ['./batch-process.component.scss'],
})
export class BatchProcessComponent implements OnInit {
  ColumnsForBatch = [
    { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
    { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
    { dbColumnname: 'EntityName', columnName: 'Entity Name' },
    { dbColumnname: 'CreatedOn', columnName: 'Uploaded Date' },
    { dbColumnname: 'PODocumentID', columnName: 'PO number' },
    { dbColumnname: 'sender', columnName: 'Sender' },
    { dbColumnname: 'UploadDocTypeCategory', columnName: 'Category' },
    { dbColumnname: 'status', columnName: 'Status' },
    { dbColumnname: 'totalAmount', columnName: 'Amount' },
  ];
  serviceColumns = [
    { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
    { dbColumnname: 'ServiceProviderName', columnName: 'Serviceprovider Name' },
    { dbColumnname: 'Account', columnName: 'Serviceprovider A/C' },
    { dbColumnname: 'EntityName', columnName: 'Entity Name' },
    { dbColumnname: 'status', columnName: 'Status' },
    { dbColumnname: 'sourcetype', columnName: 'Source' },
    { dbColumnname: 'CreatedOn', columnName: 'Uploaded Date' },
    { dbColumnname: 'totalAmount', columnName: 'Amount' },
  ];
  columnsData = [];
  columnsDataPO = [];
  showPaginatorAllInvoice: boolean;
  columnsToDisplay = [];
  columnsToDisplayPO = [];

  ColumnsForBatchApproval = [
    { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
    { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
    { dbColumnname: 'Name', columnName: 'Rule' },
    // { dbColumnname: 'documentdescription', columnName: 'Description' },
    // { dbColumnname: 'All_Status', columnName: 'Status' },
    { dbColumnname: 'Approvaltype', columnName: 'Approval Type' },
    { dbColumnname: 'totalAmount', columnName: 'Amount' },
  ];
  columnsToDisplayBatchApproval = [];
  viewType: any;
  allSearchInvoiceString: any[];
  rangeDates: Date[];
  dataLength: number;
  columnsDataAdmin: any[];
  showPaginatorApproval = false;
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
  refreshBool:boolean;

  filteredVendor = [];
  statusData:any = [];
  vendorNameList:any = [];
  filteredStatusList = [];
  searchText:string;
  selected_status_obj;
  search_placeholder:string;
  @ViewChild('datePicker') datePicker: Calendar;
  pageNumber: any;
  page_supplier: string;
  isMobile: boolean;
  tableImportData: any;

  constructor(
    private tagService: TaggingService,
    private ImportExcelService: ImportExcelService,
    private ngxSpinner: NgxSpinnerService,
    private alertService: AlertService,
    public router: Router,
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
    this.isMobile = this.ds.isMobile;
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
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'EntityName', columnName: 'Entity Name' },
      { dbColumnname: 'status', columnName: 'Status' },
    ];
    this.serviceColumns = [
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'ServiceProviderName', columnName: 'Serviceprovider Name' },
      { dbColumnname: 'Account', columnName: 'Serviceprovider A/C' },
      { dbColumnname: 'status', columnName: 'Status' },
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
      this.page_supplier = 'Service';
      this.getServiceInvoiceData();
    } else if(this.router.url.includes(
      'ExceptionManagement/approvalPending'
    )){
      this.heading = 'Approval Pending';
      this.page_supplier = `${this.partytype}`;
      this.getApprovalBatchData();
    } else {
      this.heading = `${this.partytype} based Exception`;
      this.page_supplier = `${this.partytype}`;
      this.pageNumber = this.ds.excTabPageNumber;this.isVendorBoolean = true;
      this.getBatchInvoiceData();
      // if(this.apprveBool && this.portalName == 'customer'){
      //   this.getApprovalBatchData();
      // }

    }
    if (this.router.url.includes('home')) {
      this.dashboardViewBoolean = true;
    } else {
      this.dashboardViewBoolean = false;
    }
    this.prepareColumnsArray();
    this.search_placeholder = `Ex : By ${this.page_supplier},By Entity, Select Date range from the Calendar icon`;

  }
  // to prepare display columns array
  prepareColumnsArray() {
    if (this.dashboardViewBoolean == true) {
      this.ColumnsForBatch = this.ColumnsForBatch.filter((ele) => {
        return ele.columnName != 'Status';
      });
    } 
    this.ColumnsForBatch.filter((element) => {
      this.columnsToDisplay.push(element.dbColumnname);
      // this.invoiceColumnField.push(element.dbColumnname)
    });
    this.ColumnsForBatchApproval.filter((ele) => {
      this.columnsToDisplayBatchApproval.push(ele.dbColumnname);
    });

    this.batchProcessColumnLength = this.ColumnsForBatch.length + 1;
    this.approvalPageColumnLength = this.ColumnsForBatchApproval.length + 1;
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
    this.refreshBool = true;
    this.exceptionService.readBatchInvoicesData().subscribe(
      (data: any) => {
        const batchData = [];
        let mergedStatus = [{ id:0, name:'All'}];
        let vendorNameList = [];
        data.forEach((element) => {
          let mergeData = {
            ...element.Document,
            ...element.DocumentSubStatus,
            ...element.Entity,
            ...element.Vendor,
            ...element.DocumentHistoryLogs,
          };
          mergeData['substatus'] = element.substatus;
          if (element.Document?.documentsubstatusID == 70 && !this.ds.isAdmin) {
            return;  // Skip this iteration
          }
          if(element.Document?.UploadDocTypeCategory == 'credit'){
            mergeData['UploadDocTypeCategory'] = 'invoice'
          }
          batchData.push(mergeData);
          // this.vendorNameList.forEach(el=>{

          // })
          let status = element.DocumentSubStatus.status
          // vendorNameList.push(element.Vendor.VendorName)
          if(element.Document.documentsubstatusID == 40 || element.Document.documentsubstatusID == 32){
            status = element.substatus;
          }
          mergedStatus.push({id: element.Document.documentsubstatusID, name:status})
        });
        let statusData = mergedStatus.filter((obj,index)=>{
          return index == mergedStatus.findIndex(o=> obj.name === o.name )
        })
        // this.vendorNameList = new Set(vendorNameList);
        this.statusData = statusData;
        this.columnsData = batchData.sort((a,b)=>{
          let c = new Date(a.CreatedOn).getTime();
          let d = new Date(b.CreatedOn).getTime();
          return d-c });
          this.filterData = this.columnsData;
          
          setTimeout(() => {
            this.selected_status_obj = this.ds.vendor_exc_status;
            this.searchText = this.ds.vendor_exc_uniSearch;
            this.onSelectStatus(this.ds.vendor_exc_status);
            this.universalSearch(this.searchText);
          }, 1000);
        this.dataLength = this.columnsData.length;
        if (this.dataLength > 10) {
          this.showPaginatorAllInvoice = true;
        }
        this.ngxSpinner.hide();
        this.refreshBool = false;
      },
      (error) => {
        this.ngxSpinner.hide();
        this.error("Server error");
      }
    );
  }

  getApprovalBatchData() {
    this.ngxSpinner.show();
    this.exceptionService.readApprovalPendingData().subscribe(
      (data: any) => {
        const batchData = [];
        let mergedStatus = [{ id:0, name:'All'}];
        data.result.pending_approval_invoice.forEach((element) => {
          let mergeData = {
            ...element.Document,
            ...element.Entity,
            ...element.Vendor,
          };
          mergeData.status= element.docstatus;
          batchData.push(mergeData);
          // let status = element.DocumentSubStatus.status
          // // vendorNameList.push(element.Vendor.VendorName)
          // if(element.Document.documentsubstatusID == 40 || element.Document.documentsubstatusID == 32){
          //   status = element.substatus;
          // }
          // mergedStatus.push({id: element.Document.documentsubstatusID, name:status})
        });
        // let statusData = mergedStatus.filter((obj,index)=>{
        //   return index == mergedStatus.findIndex(o=> obj.name === o.name )
        // })
        // this.vendorNameList = new Set(vendorNameList);
        // this.statusData = statusData;
        this.columnsData = batchData.sort((a,b)=>{
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
        // this.alertService.errorObject.detail = error.statusText;
        // this.MessageService.add(this.alertService.errorObject);
        this.error("Server error");
      }
    );
  }
  getServiceInvoiceData() {
    this.ngxSpinner.show();
    this.sharedService.readEditedServiceInvoiceData().subscribe(
      (data: any) => {
        let mergedStatus = [{ id:0, name:'All'}];
        let invoiceArray = [];
        data.exception_service_invoices.forEach((element) => {
          let mergeData = {
            ...element.Document,
            ...element.DocumentSubStatus,
            ...element.Entity,
            ...element.ServiceProvider,
            ...element.ServiceAccount,
          };
          mergeData['substatus'] = element.DocumentSubStatus.status
          invoiceArray.push(mergeData);
          let status_text = element.DocumentSubStatus.status;
          // vendorNameList.push(element.Vendor.VendorName)
          // if(element.Document.documentsubstatusID == 40 || element.Document.documentsubstatusID == 32){
          //   status = element.substatus;
          // }
          mergedStatus.push({id: element.Document.documentsubstatusID, name:status_text})
        });
        let statusData = mergedStatus.filter((obj,index)=>{
          return index == mergedStatus.findIndex(o=> obj.name === o.name )
        })
        // this.vendorNameList = new Set(vendorNameList);
        this.statusData = statusData;
        this.columnsData = invoiceArray.sort((a,b)=>{
          let c = new Date(a.CreatedOn).getTime();
          let d = new Date(b.CreatedOn).getTime();
          return d-c });
        this.filterData = this.columnsData;
        setTimeout(() => {
          this.selected_status_obj = this.ds.service_exc_status;
          this.searchText = this.ds.service_exc_uniSearch;
          this.onSelectStatus(this.ds.service_exc_status);
          this.universalSearch(this.searchText);
        }, 1000);
        this.dataLength = this.columnsData.length;
        if (this.dataLength > 10) {
          this.showPaginatorAllInvoice = true;
        }
        this.ngxSpinner.hide();
      },
      (error) => {
        this.ngxSpinner.hide();
        this.error("Server error");
      }
    );
  }

  filterEmit(event) {
    this.tableImportData = event;
  }
  exportExcel() {
    let exportData = [];
    if(!this.tableImportData){
      if (this.tagService.batchProcessTab == 'normal') {
        exportData = this.columnsData;
      } else if (this.tagService.batchProcessTab == 'editApproveBatch') {
        exportData = this.columnsDataAdmin;
      }
    } else {
      exportData = this.tableImportData;
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
      this.search_placeholder = `From "${frmDate}" to "${toDate}"`;
        if(frmDate && toDate){
          if (this.datePicker.overlayVisible) {
            this.datePicker.hideOverlay();
          }
            this.columnsData = this.filterData;
            this.columnsData = this.columnsData.filter((element) => {
              const dateF = this.datePipe.transform(element.CreatedOn, 'yyyy-MM-dd')
              return dateF >= frmDate && dateF <= toDate;
            });
            this.dataLength = this.columnsData.length;
        }
    } else {
      this.search_placeholder = `Ex : By ${this.page_supplier},By Entity, Select Date range from the Calendar icon`;
      this.columnsData = this.filterData;
      this.dataLength = this.columnsData.length;
    }
  }
  clearDates() {
    this.filterByDate('');
  }

  removeDuplicates(array, property) {
    return array.filter((obj, index, self) =>
      index === self.findIndex((o) => o[property] === obj[property])
    );
  }

  onSelectVendor(event){

  }

  filterByVendorName(event) {

  }

  onSelectStatus(event) {
    this.ngxSpinner.show();
    if(event.id != 0) {
      this.columnsData = this.filterData;
      this.columnsData = this.columnsData.filter(ele=>{
        return event.name.toLowerCase() == ele.status.toLowerCase();
      })
    } else {
      this.columnsData = this.filterData;
      this.dataLength = this.columnsData?.length;
    }
    this.ds.vendor_exc_status = event;
    this.ngxSpinner.hide();
    this.search_placeholder = `Ex : By ${this.page_supplier},By Entity, Select Date range from the Calendar icon`;
  }
  filterByStatus(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.statusData.length; i++) {
      let status = this.statusData[i];
      if (
        status.name.toLowerCase().includes(query.toLowerCase())
      ) {
        filtered.push(status);
      }
    }
    this.filteredStatusList = filtered;
  }
  universalSearch(txt){
      if(this.router.url.includes('ExceptionManagement/Service_ExceptionManagement')){
        this.ds.service_exc_uniSearch = txt;
      } else {
        this.ds.vendor_exc_uniSearch = txt;
      }
      this.columnsData = this.filterData;
      this.columnsData = this.ds.searchFilter(txt,this.filterData);
  }
  // universalSearch(value){

  //   // this.ngxSpinner.show();
  //   //   this.columnsData = this.filterData;
  //   //   this.columnsData = this.columnsData.filter(ele=>{
  //   //     return (ele.status.toLowerCase() || 
  //   //     ele.EntityName.toLowerCase() ||  
  //   //     ele.PODocumentID.toLowerCase() || 
  //   //     ele.VendorName.toLowerCase() || 
  //   //     ele.docheaderID.toLowerCase() || 
  //   //     ele.sender.toLowerCase()).includes(value.toLowerCase());
  //   //   })
    
  //   // console.log(this.columnsData);
  //   // this.ngxSpinner.hide();
  // }
  success(msg) {
    this.alertService.success_alert(msg);
  }
  error(msg) {
   this.alertService.error_alert(msg);
  }
  paginate(event){
    this.ds.excTabPageNumber = event.pageNumber;
  }
}
