import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import * as fileSaver from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subject = new Subject<any>();
  public isLogin: boolean = false;
  keepLogin: boolean = false;
  vendorID: number;
  cuserID: number;
  spID: number;
  spAccountID: number;

  invoiceID: any;

  notificationId: number;
  NTtempalteId: number
  public currentUser: Observable<any>;
  userId: number;
  ap_id:number;

  selectedEntityId: number;
  selectedEntityBodyId: number;
  selectedEntityDeptId: number;
  activeMenuSetting = 'ocr';
  sidebarBoolean: boolean;


  initialViewSpBoolean: boolean = true;
  spListBoolean: boolean = true;
  spDetailsArray: any;

  initialViewVendorBoolean: boolean = true
  vendorFullDetails: any;

  apiVersion = environment.apiVersion;
  apiUrl = environment.apiUrl;
  url = "https://3dcf9b30604d.ngrok.io/"
  editedUserData: any;
  VendorsReadData: any = new BehaviorSubject<any>([]);
  entityIdSummary: string;
  vendorReadID: any;

  errorObject = {
    severity: "error",
    summary: "error",
    detail: "Something went wrong"
  }
  addObject = {
    severity: "success",
    summary: "Success",
    detail: "Created Successfully"
  }
  updateObject = {
    severity: "info",
    summary: "Updated",
    detail: "Updated Successfully"
  }
  isCustomerPortal: boolean;
  po_doc_id: any;
  po_num:string;
  account_number: any;
  spAccountSub = new BehaviorSubject<any>([])
  docType: any;
  fileSrc: string;
  current_year:number;

  constructor(private http: HttpClient) {
    let today = new Date();
    this.current_year = today.getFullYear();
   }

  sendMessage(isLogin: boolean) {
    this.subject.next({ boolean: isLogin });
  }
  sendCounterData(CounterDetails: []) {
    this.subject.next({ CounterDetails });
  }
  sendNotificationNumber(Arraylength) {
    this.subject.next({ Arraylength });
  }

  getSpAccnt(){
    return this.spAccountSub.asObservable();
  }

  getNotifyArraylength(): Observable<any> {
    return this.subject.asObservable();
  }
  getData(): Observable<any> {
    return this.subject.asObservable();
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  // login

  login(data: any): Observable<any> {
    return this.http.post('/apiv1.1/login', data).pipe(retry(3));
  }


  // email template
  displayTemplate() {
    return this.http.get('v1.0/get_templates/33').pipe(retry(3));
  }
  updateTemplate(data: any): Observable<any> {
    return this.http.post('v1.0/update_template/33', data).pipe(retry(3));
  }
  sendMail(email: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/resetPassword/?email=${email}`).pipe(retry(3));
  }
  updatepass(data: any,OTP): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/setPassword/?otp_code=${OTP}`,data).pipe(retry(3));
  }

  // notifications
  getNotification() {
    return this.http.get(`/${this.apiVersion}/Notification/getNotifications/${this.userId}`).pipe(retry(3));
  }
  removeNotification(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/markNotification/${this.userId}${id}`).pipe(retry(3));
  }

  displayNTtemplate() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/getNotificationsTemplate/${this.userId}`).pipe(retry(3));
  }
  updateNTtemplate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/updateNotification/${this.userId}/idPullNotificationTemplate` + this.NTtempalteId, data).pipe(retry(3));
  }


  // To display customer user details 
  readcustomeruser() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/userList/${this.userId}`).pipe(retry(3));
  }
  readEntityUserData(value) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/readUserAccess/${this.userId}/?ua_id=${value}&skip=0`).pipe(retry(3));
  }
  updatecustomeruser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/updateCustomer/${this.userId}/idUser/` + this.cuserID, data).pipe(retry(3));
  }
  createNewUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/newCustomer/${this.userId}`, data).pipe(retry(3));
  }

  // getRoleinfo(): Observable<any> {
  //   return this.http.get(`/${this.apiVersion}/Permission/readAccessPermission${this.userId}/`);
  // }
  displayRolesData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/readPermissionRolesUser/${this.userId}`).pipe(retry(3));
  }
  displayRoleInfo() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/readPermissionRoleInfo/${this.userId}/accessPermissionDefID/${this.ap_id}`).pipe(retry(3));
  }
  createRole(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/newAccessPermissionUser/${this.userId}`, data).pipe(retry(3));
  }
  updateRoleData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/updateAccessPermission/${this.userId}/idAccessPermission/${this.ap_id}`, data).pipe(retry(3));
  }
  deleteRole() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/deletePermissionRole/${this.userId}/accessPermissionDefID/${this.ap_id}`).pipe(retry(3));
  }
  editRole(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/applyAccessPermission/${this.userId}`, data).pipe(retry(3));
  }
  newAmountApproval(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/newAmountApproval/${this.userId}`, data).pipe(retry(3));
  }
  userCheck(name) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/userName?name=${name}`).pipe(retry(3));
  }
  resetPassword(email) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/resetPassword/?email=${email}`).pipe(retry(3));
  }

  getVendorsListToCreateNewlogin(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorNameList/${this.userId}` + id).pipe(retry(3));
  }
  getVendorsCodesToCreateNewlogin(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorEntityCodes/${this.userId}?ven_code=${id}`).pipe(retry(3));
  }
  createVendorSuperUser(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/newVendorAdminUser/${this.userId}`, data).pipe(retry(3));
  }
  readVendorSuperUsersList() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorUserlist/${this.userId}`).pipe(retry(3));
  }
  readVendorAccess(uid, id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readVendorUserAccess/${uid}?ven_code=${id}`).pipe(retry(3));
  }
  updateVendorUserAccess(data, uu_id) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/updateVendorUser/${this.userId}/idUser/${uu_id}`, data).pipe(retry(3));
  }
  getVendorMatch(ven_name, data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorNameCodeMatch/${this.userId}?ven_name=${ven_name}${data}`).pipe(retry(3));
  }
  check_onboardStatus(ven_code) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/getVendorOnboardStatus/${this.userId}?ven_code=${ven_code}`).pipe(retry(3));
  }
  activate_vendor_signup(id) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/newUserActivation/${this.userId}?au_id=${id}`, '').pipe(retry(3));
  }
  activate_deactivate(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/changeUserAccountStatus/${this.userId}?deactivate_uid=${id}`).pipe(retry(3));
  }
  checkPriority(bool, data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/validateHierarchyPriority/${this.userId}?validation_type=${bool}`, data).pipe(retry(3));
  }



  // To display vendor list,create vendor,display vendor account and to update vendor apis
  readvendors(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorlist/${this.userId}${data}`).pipe(retry(3));
  }
  getVendorUniqueData(data):Observable<any>{
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorNameCode/${this.userId}${data}`).pipe(retry(3));
  }

  readvendorbyid() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendordetails/` + this.vendorID).pipe(retry(3));
  }
  createvendor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Vendor/NewVendor/${this.userId}`, data).pipe(retry(3));
  }
  updatevendor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Vendor/updateVendor/${this.userId}/idVendor/` + this.vendorID, data).pipe(retry(3));
  }
  readvendoraccount() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorAccount/` + this.vendorID).pipe(retry(3));
  }
  readvendoraccountSite() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorSite/${this.userId}/idVendor/` + this.vendorID).pipe(retry(3));
  }
  readVendorInvoices() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/vendor/${this.vendorID}`).pipe(retry(3));
  }
  readVendorInvoiceColumns(): Observable<object> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readVendorColumnPos/${this.userId}/tabname/{tabtype}`).pipe(retry(3));
  }
  updateVendorInvoiceColumns(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateVendorColumnPos/${this.userId}`, data).pipe(retry(3));
  }
  getItemFileStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readItemMetaStatus/${this.userId}`).pipe(retry(3));
  }
  downloadErrFile(item_id): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/downloadItemMasterErrorRecords/${this.userId}?item_history_id=${item_id}`, { responseType: 'blob' }).pipe(retry(3));
  }
  readItemListData(ven_acc_id): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readItemMetaData/${this.userId}?ven_acc_id=${ven_acc_id}`).pipe(retry(3));
  }


  // To display serviceprovider list,create serviceprovider,display serviceprovider account and to update serviceprovider apis

  readserviceprovider() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceproviderlist/${this.userId}`).pipe(retry(3));
  }
  createserviceprovider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/newServiceProvider/${this.userId}`, data).pipe(retry(3));
  }
  updateserviceprovider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/updateServiceProvider/` + this.spID, data).pipe(retry(3));
  }
  readserviceproviderbyid() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceprovider/` + this.spID).pipe(retry(3));
  }
  readserviceprovideraccount(data,apiParam) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceprovideraccount/${this.userId}?${data}${apiParam}`).pipe(retry(3));
  }
  createserviceprovideraccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/newSPAccount/${this.userId}/serviceId/` + this.spID, data).pipe(retry(3));
  }
  updateSpAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/updateSPAccount/${this.userId}/idServiceAccount/${this.spAccountID}`, data).pipe(retry(3));
  }
  readserviceproviderinvoice() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/InvoicePush/readServiceInvoiceList/${this.userId}?sp_id=` + this.spID).pipe(retry(3));
  }
  readServiceInvoice(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/serviceprovider/${this.spID}`).pipe(retry(3));
  }
  readSPInvoicecolumns(): Observable<object> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readServiceProviderPos/${this.userId}/tabname/{tabtype}`).pipe(retry(3));
  }
  updateSpInvoiceColumns(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateServiceProviderColumnPos/${this.userId}`, data).pipe(retry(3));
  }
  getaccntLogs(acc_id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/readServiceAccountEditHistory/${this.userId}?ser_acc_id=${acc_id}`).pipe(retry(3));
  }

  readOPUnits(): Observable<object> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/getoperationalUnits`).pipe(retry(3));
  }
  readSPApprovers() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/getapprovers`).pipe(retry(3));
  }
  getElements(sp) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/elementsList?sp=${sp}`).pipe(retry(3));
  }

  // entity

  getEntitybody() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Body_Dept/${this.userId}?ent_id=${this.selectedEntityId}`).pipe(retry(3));
  }
  getEntityDept() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Dept/${this.userId}`).pipe(retry(3));
  }
  getDepartment() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Dept/${this.userId}?en_id=${this.selectedEntityId}`).pipe(retry(3));
  }
  getUserDepartment() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readUser_Dept`).pipe(retry(3));
  }
  readCategory() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntityCategory/${this.userId}?ent_id=${this.selectedEntityId}`).pipe(retry(3));
  }

  /*Approver related */
  readApprovers(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/getDocumentApprovers/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(3));
  }
  setApprovers(data, bool) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/setDocumentApproval/${this.userId}/idInvoice/${this.invoiceID}?pre_approve=${bool}`, data).pipe(retry(3));
  }

  /* invoice Related */
  getAllInvoice() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentINVList/${this.userId}`).pipe(retry(3))
  }
  getPOData(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentPOList/${this.userId}${data}`).pipe(retry(3));
  }
  getServiceInvoices() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentINVListService/${this.userId}`).pipe(retry(3));
  }
  checkInvStatus(id, string) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/${string}/${id}`).pipe(retry(3));
  }
  changeStatus(data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateStatus/${this.userId}/idDocument/${this.invoiceID}`,data).pipe(retry(3));
  }
  updatePO(id){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/POUpdate/${id}`).pipe(retry(3));
  }
  get_poDoc_id(id){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getDocid_PO/${this.userId}/PODocumentid/${id}`).pipe(retry(3));
  }
  
  readReadyGRNData(API_route,param):Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/${API_route}/${this.userId}${param}`).pipe(retry(3))
  }
  readReadyGRNInvData():Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readGRNReadyInvoiceData/${this.userId}?inv_id=${this.invoiceID}`).pipe(retry(3))
  }
  saveGRNData(boolean_value,value):Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/saveCustomGRNData/${this.userId}?inv_id=${this.invoiceID}&submit_type=${boolean_value}`,value).pipe(retry(3))
  }
  getPo_numbers(idVen){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getPO_numbers/${this.userId}/${idVen}`).pipe(retry(3))
  }
  getPO_Lines(po_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getPO_Lines/${this.userId}/${po_num}`).pipe(retry(3))
  }
  getPO_details(po_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getPO_details/${this.userId}/${po_num}`).pipe(retry(3))
  }
  getGRN_Lines(grn_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getGRN_Lines/${this.userId}/${grn_num}`).pipe(retry(3))
  }
  checkGRN_PO_duplicates(po_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/checkGRN_PO_availability/${this.userId}/${po_num}`).pipe(retry(3));
  }
  checkGRN_PO_balance(bool){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/POInvoiceBalanceCheckForGRN/${this.userId}?po_doc_id=${this.po_doc_id}&overbal=${bool}`).pipe(retry(3));
  }
  createGRNWithPO(param,value){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/flipPOGRNData/${this.userId}?po_doc_id=${this.po_doc_id}${param}`,value).pipe(retry(2))
  }
  duplicateGRNCheck(value,param){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/flipPOGRNDataDuplicateCheck/${this.userId}?po_doc_id=${this.po_doc_id}${param}`,value).pipe(retry(2))
  }
  validateUnitprice(data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/validateInvPOUnitPrice/${this.userId}?inv_id=${this.invoiceID}`,data).pipe(retry(2))
  }
  updateGRNnumber(data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateInvoiceGrn/${this.userId}?inv_id=${this.invoiceID}`,data).pipe(retry(2))
  }
  downloadGRN(api_param,data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/downloadGRNList/${this.userId}${api_param}`,data).pipe(retry(2))
  }
  SOASearch(api_param){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/downloadReport/${this.userId}${api_param}`).pipe(retry(2))
  }

  ERPReportDownload(api_param){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/SP/DownloaderpExcel${api_param}`,'',
    { responseType: 'blob' }
    ).pipe(retry(2))
  }
  excelDownload(data){
    let blob: any = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8' });

    let d = new Date();
    let datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    fileSaver.saveAs(blob, `ERPReport-(${datestring})`);
  }
  csvDownload(data){
    let blob: any = new Blob([data], { type: 'text/csv; charset=utf-8' });
    let d = new Date();
    let datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    fileSaver.saveAs(blob, `ERPReport-(${datestring})`);
  }

    
  // view Invoice
  getInvoiceInfo() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceData/${this.userId}/idInvoice/${this.invoiceID}`).pipe(retry(2),catchError(this.handleError))
  }
  getInvoiceFilePath() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceFile/${this.userId}/idInvoice/${this.invoiceID}`).pipe(retry(2), catchError(this.handleError))
  }
  updateInvoiceDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateInvoiceData/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(3));
  }
  readColumnInvoice(value) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readColumnPos/${this.userId}/tabname/${value}`).pipe(retry(3));
  }
  updateColumnPOs(data: any, value): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateColumnPos/${this.userId}/tabname/${value}`, data).pipe(retry(3));
  }
  readEditedInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/edited`).pipe(retry(3));
  }
  readEditedServiceInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceListService/${this.userId}/exceptions`).pipe(retry(3));
  }
  assignInvoiceTo(inv_id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/assignInvoice/${this.userId}/idInvoice/${inv_id}`).pipe(retry(3));
  }
  submitChangesInvoice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/submitInvoice/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(3));
  }
  approveInvoiceChanges(data: any) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/approveEditInvoice/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(3));
  }
  readApprovedInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/approved`).pipe(retry(2));
  }
  readApprovedSPInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceListService/${this.userId}/approved`).pipe(retry(2))
  }
  financeApprovalPermission(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/approveDocument/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(3));
  }
  ITRejectInvoice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/rejectIT/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(2));
  }
  vendorRejectInvoice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/rejectVendor/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(3));
  }
  rejectGRN(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/rejectGRN/${this.invoiceID}/${this.userId}`).pipe(retry(3));
  }
  vendorSubmit(query, uploadtime): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/submitVendorInvoice/${this.userId}?re_upload=${query}&inv_id=${this.invoiceID}&uploadtime=${uploadtime}`).pipe(retry(3));
  }
  triggerBatch(query): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/fr/triggerbatch/${this.invoiceID}${query}`, '').pipe(retry(3));
  }
  serviceSubmit(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/submitServiceInvoice/${this.userId}?inv_id=${this.invoiceID}`).pipe(retry(3));
  }
  vendorSubmitPO(query, uploadtime){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/submitVendorPO/${this.userId}?re_upload=${query}&po_id=${this.invoiceID}&uploadtime=${uploadtime}`).pipe(retry(3));
  }
  syncBatchTrigger(query){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/fr/synctriggerbatch/${this.invoiceID}${query}&u_id=${this.userId}`,'').pipe(retry(3));
  }
  getGRNTabData(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readGrnDataForInvoice/${this.userId}?inv_id=${this.invoiceID}`).pipe(retry(3));
  }

  // invoiceStatusHistory

  getInvoiceLogs() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceStatusHistory/${this.userId}/idInvoice/${this.invoiceID}`).pipe(retry(2));
  }
  downloadDoc() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/journeydoc/docid/${this.invoiceID}`, { responseType: 'blob' }).pipe(retry(3));
  }
  downloadJSON(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/util/download_json/${this.invoiceID}`, { responseType: 'blob' }).pipe(retry(3));
  }
  
  // SupportDocumnet
  uploadSupportDoc(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/UploadSupportingDocument/${this.userId}/idInvoice/${this.invoiceID}`, data, {
      reportProgress: true,
      observe: 'events',
    }).pipe(retry(3));
  }
  downloadSupportDoc(doc_name) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/DownloadSupportingDocument/${this.userId}/idInvoice/${this.invoiceID}?file_name=${doc_name}`, { responseType: 'blob' }).pipe(retry(3));
  }
  getGRNAttachment(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getGrnAttachment/${this.invoiceID}`).pipe(retry(3));
  }
  // payment status
  getPaymentStatusData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoicePaymentStatus/${this.userId}`).pipe(retry(2));
  }

  // // GRN Related
  // getGRNdata(){
  //   return this.http.get(`/${this.apiVersion}/Invoice/apiv1.1/readDocumentGRNList/${this.userId}`)
  // }

  // PO Related
  getPoNumbers(param): Observable<any>{
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/VendorPortal/getponumbers/${this.userId}${param}`).pipe(retry(3));
  }
  getCurrency(vId){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/VendorPortal/getcurrency/${vId}/?u_id=${this.userId}`).pipe(retry(2))
  }
  

  // GRN Related
  getGRNdata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentGRNList/${this.userId}${data}`).pipe(retry(2));
  }
  getARCdata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentARCList/${this.userId}${data}`).pipe(retry(2));
  }
  getRejecteddata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentRejectList/${this.userId}${data}&doctype=${this.docType}`).pipe(retry(2));
  }
  getSOdata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentSOList/${this.userId}${data}`).pipe(retry(2));
  }

  getGRNExceptionData(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentGRNException/${this.userId}${data}`).pipe(retry(3));
  }

  // vendorAccounts
  readCustomerVendorAccountsData(vId) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorAccount/${this.userId}/idVendor/${vId}`).pipe(retry(2));
  }
  readServiceAccounts(sp_id,e_id){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceprovideraccountdetails/idService/${sp_id}?u_id=${this.userId}`).pipe(retry(2));
  

  }

  readUploadPOData(poNumber) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readPOData/${this.userId}/idInvoice/${poNumber}`).pipe(retry(2));
  }
  getServiceList(id){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceproviderlist/${this.userId}?ent_id=${id}`).pipe(retry(3));
  }

  // OCR
  uploadInvoice(data: any, poNumber): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/VendorPortal/uploadfile/${poNumber}`, data).pipe(retry(3));
  }
  OcrProcess(OCRInput): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ocr/status/stream?file_path=${OCRInput}`, { responseType: 'text', observe: "events" }).pipe(retry(3));
  }
  mutliUpload(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/VendorPortal/uploadMultiInvoice/${this.userId}`, data).pipe(retry(3));
  }
  // multiple PO
  readPOnumbers(ent_id, ven_id, s_date, e_date) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/PONumbers/${this.userId}?entityid=${ent_id}&vendorid=${ven_id}&createddatestart=${s_date}&createddateend=${e_date}`).pipe(retry(3));
  }
  readPOLines(po_num) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/POLines/${po_num}`).pipe(retry(3));
  }
  saveMultiPO(data, query) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/MultiPo/savedata${query}`, data).pipe(retry(3));
  }
  uploadMultiPO(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/MultiPo/uploadmultipo`, data).pipe(retry(3));
  }
  downloadTemplate(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/MultiPo/Downloadstemplatemultipo`, data, { responseType: 'blob' }).pipe(retry(3));
  }
  readSavedLines(filename) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/getdata?filename=${filename}`).pipe(retry(3));
  }

  readVenInvoices(po_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getVendorInvoices/{U_id}?u_id=${this.userId}&po_num=${po_num}`).pipe(retry(3));
  }
  readInvLines(inv){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/get_invoice_lines/${this.userId}?inv_num=${inv}`).pipe(retry(3));
  }

  // LCM
  getLCMPOnum(ent_id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readLCMPolist/${this.userId}?inv_id=${this.invoiceID}&entity_id=${ent_id}`).pipe(retry(3));
  }
  getLCMLines(po_num) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readLcmLineData/${this.userId}?inv_id=${this.invoiceID}&po_id=${po_num}`).pipe(retry(3));
  }
  getChargesCode(dataArea, ContextRecId, ContextTableId) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/chargescode/${dataArea}/${ContextRecId}/${ContextTableId}`).pipe(retry(3));
  }
  getEstActValue(poNum,poLineNum,charge){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getEstimateAndActualValue/${this.userId}/${poNum}/${poLineNum}/${charge}`).pipe(retry(3));
  }
  saveLCMdata(data, bool) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/saveLCMLineData/${this.userId}?inv_id=${this.invoiceID}&save_type=${bool}`, data).pipe(retry(3));
  }
  uploadLCM_xl(file) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/getExcelData/${this.userId}?inv_id=${this.invoiceID}`, file).pipe(retry(3));
  }
  downloadLCMTemplate(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/downloadLcmTemplate/`, data, { responseType: 'blob' }).pipe(retry(3));
  }
  getsavedLCMLineData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readLcmData/${this.userId}?inv_id=${this.invoiceID}`).pipe(retry(3));
  }
  uploadPercentageAndAmountDetails(data,invtype,tab){
    if(tab === 'percentage'){
      return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Advance/Createadvanceinv/${this.userId}?inv_id=${this.invoiceID}&adv_type=${invtype}&adv_perc=${data}`,data).pipe(retry(3));
    }
    else{
      return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Advance/Createadvanceinv/${this.userId}?inv_id=${this.invoiceID}&adv_type=${invtype}&adv_amt=${data}`,data).pipe(retry(3));
    }
  }
  getAmountofPercentage(data){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Advance/Getadvancepercentamount/${this.userId}?u_id=${this.userId}&inv_id=${this.invoiceID}&adv_perc=${data}`,data).pipe(retry(3));
  }

  // help document download
  downloadHelpDoc(file) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/util/download_excel/${file}`, { responseType: 'blob' }).pipe(retry(3));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
