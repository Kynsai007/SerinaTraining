
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  poLoadedData = [];
  invoiceLoadedData = [];
  GRNLoadedData = [];
  receiptLoadedData = [];

  VendorPortalpoLoadedData = [];
  VendorPortalinvoiceLoadedData = [];
  VendorPortalGRNLoadedData = [];
  VendorPortalreceiptLoadedData = [];

  // all invoices paagination variables
  allPaginationFirst = 0;
  allPaginationRowLength = 10;
  poPaginationFisrt = 0;
  poPaginationRowLength = 10;
  GRNPaginationFisrt = 0;
  GRNPaginationRowLength = 10;
  paymentPaginationFisrt = 0;
  paymentPaginationRowLength = 10;
  archivedPaginationFisrt = 0;
  archivedPaginationRowLength = 10;
  rejectedPaginationFisrt = 0;
  rejectedPaginationRowLength = 10;
  servicePaginationFisrt = 0;
  servicePaginationRowLength = 10;

  // Edited page pagination variables
  editInvoicesPaginationFisrt = 0;
  editInvoicesPaginationRowLength = 10;
  inProgressPaginationFisrt = 0;
  inProgressPaginationRowLength = 10;
  tobeApprovedPaginationFisrt = 0;
  tobeApprovedPaginationRowLength = 10;

  // Finance approval page pagination variables
  financePaginationFisrt = 0;
  financePaginationRowLength = 10;

  // vendor page
  vendorPaginationFirst = 0;
  vendorPaginationRowLength = 10;

  // serviceProvider page
  SPPaginationFirst = 0;
  SPPaginationRowLength = 10;
  updateColumns: any[];
  invoiceColumns: any[];
  columnstodisplayInvoice: any[];
  allColumns: any[];


  bgColorCode = [
    { id:0, name :'All', bgcolor: '#FEF9EC', textColor :'#F3BC45'},
    { id:1, name :'System Check In - Progress', bgcolor: '#FEF9EC', textColor :'#F3BC45'},
    { id:2, name :'Processing Document', bgcolor: '#F3F4FF', textColor :'#747BC8'},
    { id:3, name :'Approval Pending', bgcolor: '#E0FFEF', textColor :'#1EAC60'},
    { id:4, name :'Need To Review', bgcolor: '#FEFFD6', textColor :'#CDD100'},
    { id:5, name :'Edit in Progress', bgcolor: '#FFE8FD', textColor :'#AE5BA7'},
    { id:6, name :'Awaiting Edit Approval', bgcolor: '#F7FFC8', textColor :'#8EA01F'},
    { id:7, name :'Sent to ERP', bgcolor: '#d0fbdd', textColor :'#14bb12'},
    { id:8, name :'Payment Cleared', bgcolor: '#ECF9ED', textColor :'#3EB948'},
    { id:9, name :'Payment Partially Paid', bgcolor: '#F1EBFF', textColor :'#6A5894'},
    { id:10, name :'Invoice Rejected', bgcolor: '#FFE8E8', textColor :'#FF3C3C'},
    { id:11, name :'Payment Rejected', bgcolor: '#FFE8E8', textColor :'#FF3C3C'},
    { id:12, name :'PO Open', bgcolor: '#ECF9ED', textColor :'#3EB948'},
    { id:13, name :'PO Closed', bgcolor: '#E9E9E9', textColor :'#4D4A4A'},
    { id:16, name :'ERP Exception', bgcolor: '#fff3e0', textColor :'#b7925b'},
    { id:15, name :'Mismatch value/s', bgcolor: '#ddebc5', textColor :'#818549'},
    { id:14, name :'Posted In ERP', bgcolor: '#d0fbdd', textColor :'#14bb12'},
    { id:24, name :'Set Approval', bgcolor: '#ECF9ED', textColor :'#3EB948'},
  ]
  serviceinvoiceLoadedData = [];
  approvalServicePaginationRowLength = 10;
  approvalServicePaginationFirst = 0;
  approvalVendorPaginationFirst = 0;
  approvalVendorPaginationRowLength = 10;
  exc_batch_edit_page_first = 0;
  exc_batch_edit_page_row_length = 10;
  exc_batch_approve_page_first = 0;
  exc_batch_approve_page_row_length = 10;
  entityData = new BehaviorSubject<any>([]);
  VendorsReadData = new BehaviorSubject<any>([]);
  NonPOvendorPaginationFirst = 0;
  NonPOvendorPaginationRowLength = 10;
  entityID: any;
  editableInvoiceData: any;
  vendorNameList = new BehaviorSubject<any>([]);
  vendorsListData = [];
  offsetCount = 1;
  pageCountVariable: number = 0;
  POtableLength: any;
  GRNTableLength: any;
  archivedDisplayData = [];
  ARCTableLength: any;
  rejectedDisplayData = [];
  rejectTableLength: number;
  GRNExceptionPaginationFisrt = 0;
  GRNExceptionPaginationRowLength= 10;
  GRNExcpDispalyData = [];
  GRNExcpTableLength: number;
  reUploadData: any;
  create_GRN_page_first = 0;
  create_GRN_page_row_length = 10;
  searchTextException: any;
  configData: any;
  subStatusId: number;

  rejectReason = [
    { id:1, reason: 'Invoice already posted in Dynamics, no action required'},
    { id:2, reason: 'Item Descriptions do not match LPO, please correct invoice & re-upload'},
    { id:3, reason: 'Invoice Quantities do not match LPO, please correct invoice & re-upload'},
    { id:4, reason: 'Invoice Price do not match LPO, please correct invoice & re-upload'},
    { id:5, reason: 'Uploaded under wrong Entity, please re-upload under correct entity'},
    { id:6, reason: 'Incorrect details on Invoice (LPO No, date, vendor name, TRN, etc..) , please correct invoice & re-upload'},
    { id:7, reason: 'Multiple invoices uploaded, please upload invoice separately'},
    { id:8, reason: 'Others'}
  ]
  invoiceGlobe = '';
  serviceGlobe = '';
  exception_G_S = '';
  exception_A_G_S = '';
  createGrn_G_S = '';

  offsetCountPO = 1;
  pageCountVariablePO = 0;
  offsetCountGRN = 1;
  pageCountVariableGRN = 0;
  offsetCountArc = 1;
  pageCountVariableArc = 0;
  offsetCountRej = 1;
  pageCountVariableRej = 0;

  searchPOStr = '';
  searchGRNStr = '';
  searchArcStr = '';
  searchRejStr = '';
  portalName: string;
  isAdmin: boolean;
  ipAddress: string;
  grnWithPOBoolean: boolean;
  GRN_PO_Data = [];
  idDocumentType: number;
  ap_boolean:any;
  doc_status_tab: any;
  searchSOStr = '';
  SODisplayData = [];
  soArrayLength: any;
  SOPaginationFisrt = 1;
  SOPaginationRowLength = 10;
  offsetCountSO = 1;
  pageCountVariableSO = 0;
  poLineData = [];
  arenaMasterData: any;
  isDesktop: boolean;
  vendorId: any;
  posted_inv_type = '';
  invTabColumns: any;
  poTabColumns: any;
  arcTabColumns: any;
  serTabColumns: any;
  constructor(
  ) { 
    // this.ap_boolean = sessionStorage.getItem("ap_boolean");
    // console.log(this.ap_boolean)
  }

  getEntity():Observable<any>{
    return this.entityData.asObservable();
   } 

   getVendorsData():Observable<any>{
    return this.VendorsReadData.asObservable();
  }

  getVendorNamesData():Observable<any>{
    return this.vendorNameList.asObservable();
  }
}
