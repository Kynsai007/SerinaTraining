
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
  poPaginationFirst = 0;
  poPaginationRowLength = 10;
  GRNPaginationFirst = 0;
  GRNPaginationRowLength = 10;
  paymentPaginationFisrt = 0;
  paymentPaginationRowLength = 10;
  archivedPaginationFirst = 0;
  archivedPaginationRowLength = 10;
  rejectedPaginationFirst = 0;
  rejectedPaginationRowLength = 10;
  servicePaginationFirst = 0;
  servicePaginationRowLength = 10;

  invTabPageNumber:number = 1;
  poTabPageNumber:number = 1;
  arcTabPageNumber:number = 1;
  rejTabPageNumber:number = 1;  
  grnTabPageNumber:number = 1;
  serviceTabPageNumber:number = 1;
  excTabPageNumber:number = 1;
  crGRNTabPageNumber:number = 1;
  aprTabPageNumber:number = 1;

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
    { id:0, sub_id:0, name :'All', bgcolor: 'inherit', textColor :'#F3BC45'},
    { id:1, sub_id:1, name :'System Check In - Progress', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:2, sub_id:2, name :'Processing Document', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:3, sub_id:3, name :'Finance Approval Completed', bgcolor: 'inherit', textColor :'#14BB12'},
    { id:4, sub_id:4, name :'Need To Review', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:4, sub_id:4, name :'Under Review', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:4, sub_id:35, name :'Waiting For GRN Creation', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:4, sub_id:39, name :'GRN Created in Serina', bgcolor: 'inherit', textColor :'#14BB12'},
    { id:4, sub_id:100, name :'GRN Attachment not Found', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:5, sub_id:5, name :'Edit in Progress', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:6, sub_id:6, name :'Awaiting Edit Approval', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:7, sub_id:7, name :'Sent to ERP', bgcolor: 'inherit', textColor :'#14BB12'},
    { id:8, sub_id:8, name :'Payment Cleared', bgcolor: 'inherit', textColor :'#14BB12'},
    { id:9, sub_id:9, name :'Payment Partially Paid', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:10, sub_id:10, name :'Invoice Rejected', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:11, sub_id:11, name :'Payment Rejected', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:12, sub_id:12, name :'PO Open', bgcolor: 'inherit', textColor :'#14bb12'},
    { id:13, sub_id:13, name :'PO Closed', bgcolor: 'inherit', textColor :'#B2B2B2'},
    { id:16, sub_id:16, name :'ERP Exception', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:15, sub_id:15, name :'Mismatch value/s', bgcolor: 'inherit', textColor :'#F1932F'},
    { id:14, sub_id:14, name :'Posted In ERP', bgcolor: 'inherit', textColor :'#14BB12'},
    { id:24, sub_id:70, name :'Set Approval', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:2, sub_id:37, name :'GRN successfully created in ERP', bgcolor: 'inherit', textColor :'#14BB12'},
    { id:3, sub_id:70, name :'Approval Pending', bgcolor: 'inherit', textColor :'#358DC0'},
    { id:4, sub_id:81, name :'GRN Approval Pending', bgcolor: 'inherit', textColor :'#358DC0'},
  ]

  // bgColorCode = [
  //   { id:0, sub_id:0, name :'All', bgcolor: '#FEF9EC', textColor :'#000000',icon:''},
  //   { id:1,sub_id:1, name :'System Check In - Progress', bgcolor: '#EA4335', textColor :'#000000',icon:'assets/Serina Assets/Group 29.png'},
  //   { id:2, sub_id:2,name :'Processing Document', bgcolor: '#F19B44', textColor :'#000000',icon:'assets/Serina Assets/Group 28.png'},
  //   { id:3, sub_id:3,name :'Finance Approval Completed', bgcolor: '#E0FFEF', textColor :'#000000',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:4, sub_id:4, name :'Need To Review', bgcolor: '#FBBC05', textColor :'#000000',icon:'assets/Serina Assets/Group 27.png'},
  //   { id:4, sub_id:35, name :'Ready for GRN creation', bgcolor: '#8EB719', textColor :'#000000',icon:'assets/Serina Assets/Group 69.png'},
  //   { id:4, sub_id:39, name :'GRN Created in serina', bgcolor: '#8F00FF', textColor :'#000000',icon:'assets/Serina Assets/Group 62.png'},
  //   { id:5, sub_id:5,name :'Edit in Progress', bgcolor: '#FFE8FD', textColor :'#AE5BA7',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:6,sub_id:6, name :'Awaiting Edit Approval', bgcolor: '#F7FFC8', textColor :'#8EA01F',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:7,sub_id:7, name :'Sent to ERP', bgcolor: '#5ABB74', textColor :'##000000',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:8, sub_id:8,name :'Payment Cleared', bgcolor: '#ECF9ED', textColor :'#3EB948',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:9, sub_id:9,name :'Payment Partially Paid', bgcolor: '#F1EBFF', textColor :'#6A5894',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:10, sub_id:10,name :'Invoice Rejected', bgcolor: '#FFE8E8', textColor :'#FF3C3C',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:11, sub_id:11,name :'Payment Rejected', bgcolor: '#FFE8E8', textColor :'#FF3C3C',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:12, sub_id:12,name :'PO Open', bgcolor: '#ffffff', textColor :'#000000',icon:'assets/Serina Assets/Group 43.png'},
  //   { id:13, sub_id:13,name :'PO Closed', bgcolor: '#ffffff', textColor :'#000000',icon:'assets/Serina Assets/Group 51.png'},
  //   { id:16, sub_id:16,name :'ERP Exception', bgcolor: '#fff3e0', textColor :'#b7925b',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:15, sub_id:15,name :'Mismatch value/s', bgcolor: '#ddebc5', textColor :'#818549',icon:'assets/Serina Assets/Group 26.png'},
  //   { id:14, sub_id:14,name :'Posted In ERP', bgcolor: '#d0fbdd', textColor :'#14bb12',icon:'assets/Serina Assets/Group 26.png'},
  // ]
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
    { id:8, reason: 'PO is closed or fully booked.'},
    { id:9, reason: 'Others'}
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
  documentType:string;
  ap_boolean:any;
  doc_status_tab: any;
  searchSOStr = '';
  SODisplayData = [];
  soArrayLength: any;
  SOPaginationFirst = 1;
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
  
  exceptionService_G_S: string;
  vendor_exc_status = {id: 0, name:'All'};
  service_exc_status = {id: 0, name:'All'};
  vendor_exc_uniSearch:string = '';
  service_exc_uniSearch:string = '';
  grn_exc_uniSearch: string = '';
  masterTabName:string;
  masterSubTabName = 'invoice';
  grn_aprve_uniSearch: string = '';
  snackBarRef: any;
  isTableView = new BehaviorSubject<boolean>(true);
  approvalPageNumber: any;
  approval_uniSearch: any;
  approvalPageNumberSP: any;
  SP_aprve_uniSearch: string = '';
  statusId: any;
  isMobile: boolean;
  projectIdArr: any;
  projectCArr: any;
  ent_code: any;
  isCoordinator: boolean;
  grn_manpower_metadata: any;
  added_manpower_data: any[];
  number_of_days: number;
  manpower_saved_date_range: Date[];
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

  // displayMode(){
  //   return this.isTableView.asObservable();
  // }

  getVendorNamesData():Observable<any>{
    return this.vendorNameList.asObservable();
  }
  closeSnackbar():void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  searchFilter(searchTxt,filter_data){
    return filter_data?.filter(item => {
      // Iterate over object keys
      for (const key in item) {
        if (Object?.prototype?.hasOwnProperty?.call(item, key)) {
          const value = item[key];
          // Check if the field value contains the search term
          if (value && typeof value === 'string' && value?.toLowerCase()?.includes(searchTxt?.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });
  }

  changeTheme(primary: string, secondary: string) {
    document.documentElement.style.setProperty('--themeColor', primary);
    document.documentElement.style.setProperty('--textWColor', secondary);
  }
}
