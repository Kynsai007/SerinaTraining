
import { SharedService } from './../../services/shared.service';
import { PermissionService } from './../../services/permission.service';
import { Router } from '@angular/router';
import { TaggingService } from './../../services/tagging.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';
import { Table } from 'primeng/table';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: [
    './approve.component.scss',
  ],
})
export class ApproveComponent implements OnInit {
  invoiceListBoolean: boolean = true;
  editPermissionBoolean: boolean;

  @ViewChild('approve') approve: Table;

  users;
  approvedData: any[];
  approvedDataSP: any[];
  ApprovedColumn = [
    { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
    { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
    { dbColumnname: 'Account', columnName: 'Vendor A/C' },
    // { dbColumnname: 'documentdescription', columnName: 'Description' },
    // { dbColumnname: 'Approvaltype', columnName: 'Approval type' },
    { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
    { dbColumnname: 'UpdatedOn', columnName: 'Last Modified' },
    { dbColumnname: 'totalAmount', columnName: 'Amount' },
  ];
  ApprovedColumnSP = [
    { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
    { dbColumnname: 'ServiceProviderName', columnName: 'Service provider Name' },
    { dbColumnname: 'Account', columnName: 'Service provider A/C' },
    { dbColumnname: 'documentdescription', columnName: 'Description' },
    { dbColumnname: 'documentDate', columnName: 'Invoice Date' },
    { dbColumnname: 'UpdatedOn', columnName: 'Last Modified' },
    { dbColumnname: 'totalAmount', columnName: 'Amount' },
  ];
  approvedColumnHeader = [];
  approvedColumnField = [];
  showPaginatorApproved: boolean;
  approvedDataLength: number;
  approvedColumnHeaderSP = [];
  approvedColumnFieldSP = [];
  showPaginatorApprovedSP: boolean;
  approvedDataLengthSP: number;
  allSearchInvoiceString: any = [];

  rangeDates: Date[];
  minDate: Date;
  maxDate: Date;
  viewType: any;
  first: any;
  rows: any;
  first_service: any;
  rows_service: any;
  ColumnLengthVendor: number;
  ColumnLengthSP: number;
  dashboardViewBoolean: boolean;
  ap_boolean: any;
  isDesktop: boolean;
  searchText:string;
  search_placeholder = 'Ex : By Vendor. By PO';
  pageNumber: any;
  filterData: any[];

  constructor(
    private tagService: TaggingService,
    private router: Router,
    private sharedService: SharedService,
    private dateFilterService: DateFilterService,
    private SpinnerService: NgxSpinnerService,
    private ds: DataService,
    private permissionService: PermissionService,
    private ImportExcelService: ImportExcelService
  ) {}

  ngOnInit(): void {
    this.init();
    this.readInvoiceApprovedData();
    this.readServiceInvoiceData();
    this.findColumns();
    this.dateRange();

  }

  init() {
    this.editPermissionBoolean = this.permissionService.editBoolean;
    this.ap_boolean = this.ds.ap_boolean;
    this.isDesktop = this.ds.isDesktop;
    this.pageNumber = this.ds.approvalPageNumber;
    if(!this.isDesktop) {
      this.mob_columns();
    }
    this.tagService.headerName = 'Approve';
    this.viewType = this.tagService.aprrovalPageTab;
    this.first = this.ds.approvalVendorPaginationFirst;
    this.rows = this.ds.approvalVendorPaginationRowLength;
    this.first_service = this.ds.approvalServicePaginationFirst;
    this.rows_service = this.ds.approvalServicePaginationRowLength;
    if (this.router.url.includes('home')) {
      this.dashboardViewBoolean = true;
    } else {
      this.dashboardViewBoolean = false;
    }
  }

  mob_columns(){
    this.ApprovedColumn = [
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      { dbColumnname: 'EntityName', columnName: 'Entity' },
      // { dbColumnname: 'documentdescription', columnName: 'Description' },
      // { dbColumnname: 'Approvaltype', columnName: 'Approval type' },
      { dbColumnname: 'PODocumentID', columnName: 'PO Number' },
      // { dbColumnname: 'UpdatedOn', columnName: 'Last Modified' },
      // { dbColumnname: 'totalAmount', columnName: 'Amount' },
    ];
  }

  findColumns() {
    this.ApprovedColumn.forEach((e) => {
      this.approvedColumnHeader.push(e.columnName);
      this.approvedColumnField.push(e.dbColumnname);
    });
    this.ApprovedColumnSP.forEach((e) => {
      this.approvedColumnHeaderSP.push(e.columnName);
      this.approvedColumnFieldSP.push(e.dbColumnname);
    });
    this.ColumnLengthVendor = this.ApprovedColumn.length + 1;
    this.ColumnLengthSP = this.ApprovedColumnSP.length + 1;
  }

  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxDate = this.dateFilterService.maxDate;
  }

  chooseApprovalpageTab(value) {
    this.viewType = value;
    this.tagService.aprrovalPageTab = value;
    this.allSearchInvoiceString = [];
  }

  viewInvoice(e) {
    this.router.navigate(['customer/approved/InvoiceDetails/' + e.idDocument]);
    this.invoiceListBoolean = false;
    this.tagService.editable = false;
  }
  editInvoice(e) {
    if (this.permissionService.financeApproveBoolean == true) {
      this.router.navigate([
        'customer/approved/InvoiceDetails/' + e.idDocument,
      ]);
      this.invoiceListBoolean = false;
      this.tagService.editable = true;
      this.tagService.financeApprovePermission = true;
      this.sharedService.invoiceID = e.idDocument;
    } else {
      alert('Do not have access to approve');
    }
  }
  backToInvoice() {
    this.invoiceListBoolean = true;
  }
  readInvoiceApprovedData() {
    this.SpinnerService.show();
    this.sharedService.readApprovedInvoiceData().subscribe(
      (data: any) => {
        let approvedArray = [];
        data?.result?.approved.forEach((element) => {
          let mergeArray = {
            ...element.Entity,
            ...element.EntityBody,
            ...element.FinancialApproval,
            ...element.Document,
            ...element.User,
            ...element.Vendor,
            ...element.VendorAccount,
          };
          mergeArray.documentdescription = element.documentdescription;
          mergeArray.Approvaltype = element.Approvaltype;
          approvedArray.push(mergeArray);
        });
        this.approvedData = approvedArray;
        this.approvedDataLength = this.approvedData.length;
        this.filterData = this.approvedData;
        setTimeout(() => {
          this.searchText = this.ds.grn_aprve_uniSearch;
          this.universalSearch(this.searchText);
      }, 1000);
        if (this.approvedData.length > 10) {
          this.showPaginatorApproved = true;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }

  readServiceInvoiceData() {
    this.SpinnerService.show();
    this.sharedService.readApprovedSPInvoiceData().subscribe(
      (data: any) => {
        let approvedArray = [];
        data?.approved?.forEach((element) => {
          let mergeArray = {
            ...element.Entity,
            ...element.EntityBody,
            ...element.Document,
            ...element.User,
            ...element.ServiceProvider,
            ...element.ServiceAccount,
          };
          mergeArray.documentdescription = element.documentdescription;
          approvedArray.push(mergeArray);
        });
        this.approvedDataSP = approvedArray;
        this.approvedDataLengthSP = this.approvedDataSP.length;
        if (this.approvedDataLengthSP > 10) {
          this.showPaginatorApprovedSP = true;
        }
        this.SpinnerService.hide();
      },
      (error) => {
        this.SpinnerService.hide();
      }
    );
  }
  universalSearch(txt){
    this.ds.approval_uniSearch = txt;
    this.approvedData = this.filterData;
    this.approvedData = this.ds.searchFilter(txt,this.filterData);
}
  paginateService(event) {
    this.first_service = event.first;
    this.ds.approvalServicePaginationFirst = this.first_service;
    this.ds.approvalServicePaginationRowLength = event.rows;
  }

  paginateVendor(event) {
    this.first = event.first;
    this.ds.approvalVendorPaginationFirst = this.first;
    this.ds.approvalVendorPaginationRowLength = event.rows;
  }

  searchImport(value) {
    this.allSearchInvoiceString = this.approve.filteredValue;
  }
  exportExcel() {
    let exportData = [];
    if (this.tagService.aprrovalPageTab == 'vendorInvoice') {
      exportData = this.approvedData;
    } else {
      exportData = this.approvedDataSP;
    }
    if (this.allSearchInvoiceString && this.allSearchInvoiceString.length > 0) {
      this.ImportExcelService.exportExcel(this.allSearchInvoiceString);
    } else if (exportData && exportData.length > 0) {
      this.ImportExcelService.exportExcel(exportData);
    } else {
      alert('No Data to import');
    }
  }

  paginate(event){
    this.pageNumber = event.pageNumber;
    this.ds.approvalPageNumber = event.pageNumber;
  }
}
