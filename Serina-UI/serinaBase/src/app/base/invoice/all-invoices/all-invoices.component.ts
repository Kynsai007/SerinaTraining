import { AlertService } from './../../../services/alert/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';
import { TaggingService } from './../../../services/tagging.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { MessageService } from 'primeng/api';
import * as fileSaver from 'file-saver';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';

export interface statusArray {
  name:string;
}

@Component({
  selector: 'app-all-invoices',
  templateUrl: './all-invoices.component.html',
  styleUrls: ['./all-invoices.component.scss'],
})
export class AllInvoicesComponent implements OnInit, OnChanges {
  @Input() tableData;
  @Input() invoiceColumns;
  @Input() columnsToDisplay;
  @Input() showPaginatorAllInvoice;
  @Input() columnLength;
  @Output() public searchInvoiceData: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() public filterDataEmit: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() public sideBarBoolean: EventEmitter<boolean> =
    new EventEmitter<boolean>();
    @Output() public paginationEvent: EventEmitter<any> =
    new EventEmitter<boolean>();
  showPaginator: boolean;
  // columnsToDisplay =[];
  _selectedColumns: any[];
  visibleSidebar2;
  cols;
  status = {};

  @ViewChild('allInvoice', { static: true }) allInvoice: Table;
  hasSearch: boolean = false;
  statusId: any;
  displayStatus: any;
  previousAvailableColumns: any[];
  select: any;
  userType: string;
  first = 0;
  last: number;
  rows = 10;
  bgColorCode;
  FilterData = [];
  selectedStatus = '';
  statusData: any;
  checkstatusPopupBoolean:boolean;
  statusText:string;
  statusText1: string;
  portal_name: string;
  selectedFields1:any;
  stateTable:any;
  triggerBoolean: boolean;
  invoiceID: any;
  globalSearch:string;
  isAdmin: boolean;
  ERP: string;
  invoceDoctype = false;
  docType:any;
  isDesktop: boolean;
  drilldownarray = [];
  drillBool: boolean;
  docId;
  ap_boolean :boolean;
  fst: number = 0;
  // mob_bg_tr = [
  //   { id:4, name:'Need To Review', borderClr:'#DBD51C', bgClr: '#FEFFD6'},
  //   { id:2, name: 'Processing Document', borderClr:'#7C83CF', bgClr: '#F3F4FF'},
  //   { id:1, name: 'System Check In - Progress', borderClr:'#F3BC45', bgClr: '#FEF9EC'},
  //   { id:4, borderClr:'', bgClr: ''},
  //   { id:7, name :'Sent to ERP', bgcolor: '#d0fbdd', textColor :'#14bb12'},
  //   { id:8, name :'Payment Cleared', bgcolor: '#ECF9ED', textColor :'#3EB948'},
  //   { id:9, name :'Payment Partially Paid', bgcolor: '#F1EBFF', textColor :'#6A5894'},
  //   { id:10, name :'Invoice Rejected', bgcolor: '#FFE8E8', textColor :'#FF3C3C'},
  //   { id:11, name :'Payment Rejected', bgcolor: '#FFE8E8', textColor :'#FF3C3C'},
  //   { id:12, name :'PO Open', bgcolor: '#ECF9ED', textColor :'#3EB948'},
  //   { id:13, name :'PO Closed', bgcolor: '#E9E9E9', textColor :'#4D4A4A'},
  //   { id:16, name :'ERP Exception', bgcolor: '#fff3e0', textColor :'#b7925b'},
  //   { id:15, name :'Mismatch value/s', bgcolor: '#ddebc5', textColor :'#818549'},
  //   { id:14, name :'Posted In ERP', bgcolor: '#d0fbdd', textColor :'#14bb12'},
  //   { id:24, name :'Set Approval', bgcolor: '#ECF9ED', textColor :'#3EB948'},
  // ]

  constructor(
    private tagService: TaggingService,
    public router: Router,
    private authService: AuthenticationService,
    private ds: DataService,
    private sharedService: SharedService,
    private AlertService :AlertService,
    private messageService :MessageService,
    private spinnerService : NgxSpinnerService,
    private md: MatDialog
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tableData && changes.tableData.currentValue && changes.tableData.currentValue.length > 0) {
      this.FilterData = this.tableData;
      let mergedStatus = [ 'All'];
      this.tableData.forEach(ele=>{
        mergedStatus.push(ele.docstatus)
      })
      this.statusData = new Set(mergedStatus);
    }

  }

  ngOnInit(): void {
    this.userType = this.authService.currentUserValue['user_type'];
    let userRole = this.authService.currentUserValue['permissioninfo'].NameOfRole.toLowerCase();
    this.isDesktop = this.ds.isDesktop;
    this.ap_boolean = this.ds.ap_boolean;
    if(!this.isDesktop) {
      this.showPaginatorAllInvoice = false;
    } 
    if(userRole == 'customer super admin' || userRole == 'ds it admin'){
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    if(this.ap_boolean){
      this.invoceDoctype = true;
      this.docType = 3;
    }else{
      this.docType = 1;
    }
    this.bgColorCode = this.ds.bgColorCode;
    this.visibleSidebar2 = this.sharedService.sidebarBoolean;
    this.getRowsData();
    // this.getColumnData();
    if (this.tableData) {
      if (this.tableData.length > 10) {
        this.showPaginator = true;
      }
      if (this.statusId) {
        this.displayStatus = this.status[this.statusId];
      }
    }
    if (this.userType == 'customer_portal') {
      this.portal_name = 'customer';
    } else if (this.userType == 'vendor_portal') {
      this.portal_name = 'vendorPortal';
      
    }
  }

  getRowsData() {
    
    if (this.router.url.includes('allInvoices')) {
      this.first = this.ds.allPaginationFirst;
      this.rows = this.ds.allPaginationRowLength;
      this.stateTable = 'allInvoices';
      this.filter('All')
      let stItem:any = JSON.parse(sessionStorage?.getItem('allInvoices'));
      if(stItem){
        this.globalSearch = stItem?.filters?.global?.value;
        this.selectedStatus = stItem?.filters?.docstatus?.value;
      } else {
        this.globalSearch = this.ds.invoiceGlobe;
      }
    } 
    else if (this.router.url.includes('PO') ) {
      this.first = this.ds.poPaginationFisrt;
      this.rows = this.ds.poPaginationRowLength;
      this.stateTable = 'PO';
      let stItem:any = JSON.parse(sessionStorage?.getItem('PO'));
      if(stItem){
        this.globalSearch = stItem?.filters?.global?.value;
        this.selectedStatus = stItem?.filters?.docstatus?.value;
      }
    }
    else if (this.router.url.includes('archived')) {
      this.first = this.ds.archivedPaginationFisrt;
      this.rows = this.ds.archivedPaginationRowLength;
      this.stateTable = 'Archived';
      let stItem:any = JSON.parse(sessionStorage?.getItem('Archived'));
      if(stItem){
        this.globalSearch = stItem?.filters?.global?.value;
        this.selectedStatus = stItem?.filters?.docstatus?.value;
      }
    } 
    else if (this.router.url.includes('rejected')) {
      this.first = this.ds.rejectedPaginationFisrt;
      this.rows = this.ds.rejectedPaginationRowLength;
      this.stateTable = 'rejected';
      let stItem:any = JSON.parse(sessionStorage?.getItem('rejected'));
      if(stItem){
        this.globalSearch = stItem?.filters?.global?.value;
      }
    } 
    else if (this.router.url.includes('ServiceInvoices')) {
      this.first = this.ds.servicePaginationFisrt;
      this.rows = this.ds.servicePaginationRowLength;
      this.stateTable = 'Service';
      let stItem:any = JSON.parse(sessionStorage?.getItem('Service'));
      if(stItem){
        this.globalSearch = stItem?.filters?.global?.value;
        this.selectedStatus = stItem?.filters?.docstatus?.value;
      } else {
        this.globalSearch = this.ds.serviceGlobe;
      }
    } 
  }
  

  trackAllInvoice(index, allInvoice) {
    return allInvoice ? allInvoice.idDocument : undefined;
  }
  viewInvoiceDetails(e) {
    let route:string;
    if(this.router.url.includes('PO')){
      route = 'PODetails';
    } else if(this.router.url.includes('SO')){
      route = 'SODetails';
    }  else if(this.router.url.includes('GRN') && !this.router.url.includes('GRNExceptions')){
      route = 'GRNDetails';
    } else {
      route = 'InvoiceDetails';      
    }
    if (this.userType == 'vendor_portal') {
      this.router.navigate([
        `/vendorPortal/invoice/${route}/${e.idDocument}`,
      ]);
    } else if (this.userType == 'customer_portal') {
      if(this.ap_boolean){
        if(e.documentsubstatusID != 30 ){
          this.router.navigate([`customer/invoice/${route}/${e.idDocument}`]);
        } else {
          this.router.navigate([`customer/invoice/comparision-docs/${e.idDocument}`]);
        }
      } else {
        if(e.documentsubstatusID != 29 && route == 'PODetails') {
          this.router.navigate([`customer/ExceptionManagement/batchProcess/SO_generate/${e.idDocument}`]);
        } else {
          this.router.navigate([`customer/invoice/${route}/${e.idDocument}`]);
        }
      }
    }
    this.tagService.createInvoice = true;
    this.tagService.displayInvoicePage = false;
    this.tagService.editable = false;
    this.sharedService.invoiceID = e.idDocument;
    // if (this.router.url.includes('/customer/invoice/PO')) {
    //   this.tagService.type = 'PO';
    // } else {
    //   this.tagService.type = 'Invoice';
    // }
  }
  filter(value) {
    this.tableData = this.FilterData;
    if (value != 'All') {
      this.tableData = this.tableData.filter(
        (val) => value == val.docstatus
      );
      this.first = 0
      this.filterDataEmit.emit(this.tableData);
    }
  }
  filteredData(evnt){
    this.filterDataEmit.emit(this.allInvoice?.filteredValue);
  }
  viewStatusPage(e) {
    this.sharedService.invoiceID = e.idDocument;
    this.ds.subStatusId = e.documentsubstatusID;
    this.router.navigate([`${this.portal_name}/invoice/InvoiceStatus/${e.idDocument}`]);
   
  }
  showSidebar() {
    this.sideBarBoolean.emit(true);
  }

  paginate(event) {
    console.log(event)
    this.paginationEvent.emit(event);
  }

  searchInvoice(value) {
    if (this.router.url.includes('allInvoices')) {
      this.ds.invoiceGlobe = this.globalSearch;
    } else if (this.router.url.includes('ServiceInvoices')) {
      this.ds.serviceGlobe  = this.globalSearch;
    } 
    this.searchInvoiceData.emit(this.allInvoice);
  }

  checkStatus(e){
    this.spinnerService.show();
    let urlStr = ''
    if(this.router.url.includes('payment-details-vendor')){
      urlStr = 'InvoicePaymentStatus';
    } else {
      urlStr = 'InvoiceStatus';
    }
    this.sharedService.checkInvStatus(e.idDocument,urlStr).subscribe((data:any)=>{

      if(urlStr == 'InvoiceStatus'){
        this.statusText = data.Message;
        if(data.IsPosted == 'Yes'){
          this.statusText1 = 'Posted to ERP'
        } else {
          this.statusText1 = 'Not Posted to ERP'
        }
      } else if(urlStr == 'InvoiceStatus' && this.ERP == 'JDE'){
        // this.statusText = data.Message;
        if(data.ErrCode == 'S'){
          this.statusText = data.JDEInvoiceNo;
          this.statusText1 = data.Remarks;
        } else {
          this.statusText = data.ErrMessage;
          this.statusText1 = data.Remarks;
        }
      } else {
        this.statusText = data['Payment Status'];
        this.statusText1 = `Payment date : ${data['Payment Date']}`;
      }
      this.checkstatusPopupBoolean = true;
      this.spinnerService.hide();
    }, (err)=>{
      this.spinnerService.hide();
      this.AlertService.errorObject.detail = 'Server error';
      this.messageService.add(this.AlertService.errorObject);
    })
  }

  changeStatus(id){
    this.spinnerService.show();
    this.invoiceID = id;
    this.sharedService.invoiceID = id;
    let obj = {
      "documentStatusID": 4,
      "documentsubstatusID": 29
    }
    this.sharedService.changeStatus(obj).subscribe((data:any)=>{
      this.AlertService.addObject.detail = data.result;
      this.messageService.add(this.AlertService.addObject);
      window.location.reload();
      this.spinnerService.hide();
    },err=>{
      this.spinnerService.hide();
      this.AlertService.errorObject.detail = 'Server error';
      this.messageService.add(this.AlertService.errorObject);
    })
  }

  reUpload(val){
    this.router.navigate([`/${this.portal_name}/uploadInvoices`]);
    this.ds.reUploadData = val;
  }

  triggerBatch(id){
    const drf:MatDialogRef<ConfirmationComponent> = this.md.open(ConfirmationComponent,{ 
      width : '30%',
      height: '35vh',
      hasBackdrop: false,
      data : { body: 'Are you sure you want to re-trigger the batch for the Invoice?'}})

      drf.afterClosed().subscribe((bool)=>{
        if(bool){
          this.triggerBoolean = true;
          let query = `?re_upload=false&doctype=${this.docType}`;
          this.invoiceID = id;
          this.sharedService.invoiceID = id;
          this.sharedService.syncBatchTrigger(query).subscribe((data:any)=>{
            let sub_status = null;
            
            if(data){
              this.triggerBoolean = false;
              for (const el of data[this.invoiceID]?.complete_status) {
                if (el.status == 0) {
                  sub_status = el.sub_status;
                }
              };
            }
            if(sub_status != 1){
              window.location.reload();
            } else {
              this.AlertService.errorObject.detail = 'Hey, we are facing some issue so, our technical team will handle this Document';
              this.messageService.add(this.AlertService.errorObject)
            }
          },(error => {
            this.triggerBoolean = false;
          }))
        }
      })

  }

  updatePO(e){
    this.spinnerService.show();
    this.sharedService.updatePO(e.idDocument).subscribe((data:any)=>{
      this.spinnerService.hide();
      this.AlertService.addObject.detail = 'PO data updated.';
      this.messageService.add(this.AlertService.addObject);
    },err=>{
      this.spinnerService.hide();
      this.AlertService.errorObject.detail = 'Server error';
      this.messageService.add(this.AlertService.errorObject);
    })
  }
  downloadJSON(e){
    this.sharedService.invoiceID = e.idDocument;
    let invoiceNumber = e.docheaderID
    this.sharedService.downloadJSON().subscribe((response:any)=>{
      fileSaver.saveAs(response, `Invoice#${invoiceNumber}_JSON`);
      this.AlertService.addObject.summary="Success";
      this.AlertService.addObject.detail = "Document Downloaded successfully";
      this.messageService.add(this.AlertService.addObject);
    }
      ,err=>{
        this.AlertService.errorObject.detail = "Server error";
        this.messageService.add(this.AlertService.errorObject);
      })
  }

  clickDrildown(data) {
    this.drillBool = !this.drillBool;
    this.docId = data.idDocument;
    if(this.router.url.includes('allInvoices')) {
      this.drilldownarray = [
        { header: 'Upload Date', field: data.CreatedOn },
        { header: 'Amount', field: data.totalAmount },
        { header: 'Status', field: data.docstatus },
        { header: 'Sender', field: data.sender }
      ]
    } else if (this.router.url.includes('GRN')){
      this.drilldownarray = [
        { header: 'Received Date', field: data.CreatedOn },
        { header: 'Created By', field: data.firstName },
        { header: 'Entity', field: data.EntityName },
        { header: 'Source', field: data.grn_type }
      ]
    } else if (this.router.url.includes('archived')){
      this.drilldownarray = [
        { header: 'Entity', field: data.EntityName },
        { header: 'Amount', field: data.totalAmount },
        { header: 'Due Date', field: data.DueDate },
        { header: 'Payment Date', field: data.PaymentDate },
        { header: 'Type of Payment', field: data.TypeOfPayment },
      ]
    } else if (this.router.url.includes('rejected')){
      this.drilldownarray = [
        { header: 'Description', field: data.documentdescription },
        { header: 'Amount', field: data.totalAmount },
        { header: 'Uploaded Date', field: data.CreatedOn }
      ]
    } else if(this.router.url.includes('ServiceInvoices')) {
      this.drilldownarray = [
        { header: 'Upload Date', field: data.CreatedOn },
        { header: 'Amount', field: data.totalAmount },
        { header: 'Status', field: data.docstatus },
        { header: 'Invoice Date', field: data.documentDate }
      ]
    }
    
  }
  onScroll(){
    this.fst+10;
    let evnt = {
      first: this.fst,
      rows : 50
    }
    if(!this.isDesktop){
       this.paginate(evnt);
       console.log('scrolled, Mobile mode');
    } else {
      console.log('Desktop mode');
    }
  }
}
