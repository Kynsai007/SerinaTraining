import { environment } from './../../environments/environment.prod';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';

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
  ap_id: number;

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

  spAccountSub = new BehaviorSubject<any>([])

  constructor(private http: HttpClient) { }

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
    return this.http.post('/apiv1.1/login', data)
  }


  // email template
  displayTemplate() {
    return this.http.get('v1.0/get_templates/33')
  }
  updateTemplate(data: any): Observable<any> {
    return this.http.post('v1.0/update_template/33', data)
  }
  sendMail(email: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/resetPassword/?email=${email}`);
  }
  updatepass(data: any,OTP): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/setPassword/?otp_code=${OTP}`,data);
  }

  // notifications
  getNotification() {
    return this.http.get(`/${this.apiVersion}/Notification/getNotifications/${this.userId}`)
  }
  removeNotification(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/markNotification/${this.userId}${id}`)
  }

  displayNTtemplate() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Notification/getNotificationsTemplate/${this.userId}`)
  }
  updateNTtemplate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Notification/updateNotification/${this.userId}/idPullNotificationTemplate` + this.NTtempalteId, data);
  }


  // To display customer user details 
  readcustomeruser() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/userList/${this.userId}`)
  }
  readEntityUserData(value) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/readUserAccess/${this.userId}/?ua_id=${value}&skip=0`);
  }
  updatecustomeruser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/updateCustomer/${this.userId}/idUser/` + this.cuserID, data);
  }
  createNewUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/newCustomer/${this.userId}`, data);
  }

  // getRoleinfo(): Observable<any> {
  //   return this.http.get(`/${this.apiVersion}/Permission/readAccessPermission${this.userId}/`);
  // }
  displayRolesData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/readPermissionRolesUser/${this.userId}`);
  }
  displayRoleInfo() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/readPermissionRoleInfo/${this.userId}/accessPermissionDefID/${this.ap_id}`);
  }
  createRole(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/newAccessPermissionUser/${this.userId}`, data);
  }
  updateRoleData(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${this.apiVersion}/Permission/updateAccessPermission/${this.userId}/idAccessPermission/${this.ap_id}`, data);
  }
  deleteRole() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Permission/deletePermissionRole/${this.userId}/accessPermissionDefID/${this.ap_id}`);
  }
  editRole(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/applyAccessPermission/${this.userId}`, data);
  }
  newAmountApproval(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/newAmountApproval/${this.userId}`, data);
  }
  userCheck(name) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/userName?name=${name}`);
  }
  resetPassword(email) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/resetPassword/?email=${email}`);
  }

  getVendorsListToCreateNewlogin(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorNameList/${this.userId}` + id);
  }
  getVendorsCodesToCreateNewlogin(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorEntityCodes/${this.userId}?ven_code=${id}`);
  }
  createVendorSuperUser(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/newVendorAdminUser/${this.userId}`, data);
  }
  readVendorSuperUsersList() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorUserlist/${this.userId}`);
  }
  readVendorAccess(uid, id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readVendorUserAccess/${uid}?ven_code=${id}`);
  }
  updateVendorUserAccess(data, uu_id) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/updateVendorUser/${this.userId}/idUser/${uu_id}`, data);
  }
  getVendorMatch(ven_name, data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorNameCodeMatch/${this.userId}?ven_name=${ven_name}${data}`);
  }
  check_onboardStatus(ven_code) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/getVendorOnboardStatus/${this.userId}?ven_code=${ven_code}`);
  }
  activate_vendor_signup(id) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Customer/newUserActivation/${this.userId}?au_id=${id}`, '');
  }
  activate_deactivate(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/changeUserAccountStatus/${this.userId}?deactivate_uid=${id}`);
  }
  checkPriority(bool, data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/validateHierarchyPriority/${this.userId}?validation_type=${bool}`, data);
  }



  // To display vendor list,create vendor,display vendor account and to update vendor apis
  readvendors(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorlist/${this.userId}${data}`).pipe(retry(2));
  }
  getVendorUniqueData(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorNameCode/${this.userId}${data}`)
  }

  readvendorbyid() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendordetails/` + this.vendorID)
  }
  createvendor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Vendor/NewVendor/${this.userId}`, data)
  }
  updatevendor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Vendor/updateVendor/${this.userId}/idVendor/` + this.vendorID, data)
  }
  readvendoraccount() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorAccount/` + this.vendorID)
  }
  readvendoraccountSite() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorSite/${this.userId}/idVendor/` + this.vendorID);
  }
  readVendorInvoices() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/vendor/${this.vendorID}`)
  }
  readVendorInvoiceColumns(): Observable<object> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readVendorColumnPos/${this.userId}/tabname/{tabtype}`)
  }
  updateVendorInvoiceColumns(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateVendorColumnPos/${this.userId}`, data)
  }
  getItemFileStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readItemMetaStatus/${this.userId}`)
  }
  downloadErrFile(item_id): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/downloadItemMasterErrorRecords/${this.userId}?item_history_id=${item_id}`, { responseType: 'blob' })
  }
  readItemListData(ven_acc_id): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readItemMetaData/${this.userId}?ven_acc_id=${ven_acc_id}`)
  }


  // To display serviceprovider list,create serviceprovider,display serviceprovider account and to update serviceprovider apis

  readserviceprovider() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceproviderlist/${this.userId}`)
  }
  createserviceprovider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/newServiceProvider/${this.userId}`, data)
  }
  updateserviceprovider(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/updateServiceProvider/` + this.spID, data)
  }
  readserviceproviderbyid() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceprovider/` + this.spID)
  }
  readserviceprovideraccount(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceprovideraccount/${this.userId}?${data}`)
  }
  createserviceprovideraccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/newSPAccount/${this.userId}/serviceId/` + this.spID, data)
  }
  updateSpAccount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/updateSPAccount/${this.userId}/idServiceAccount/${this.spAccountID}`, data)
  }
  readserviceproviderinvoice() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/InvoicePush/readServiceInvoiceList/${this.userId}?sp_id=` + this.spID)
  }
  readServiceInvoice(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/serviceprovider/${this.spID}`)
  }
  readSPInvoicecolumns(): Observable<object> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readServiceProviderPos/${this.userId}/tabname/{tabtype}`)
  }
  updateSpInvoiceColumns(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateServiceProviderColumnPos/${this.userId}`, data)
  }
  getaccntLogs(acc_id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/readServiceAccountEditHistory/${this.userId}?ser_acc_id=${acc_id}`)
  }

  readOPUnits(): Observable<object> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/getoperationalUnits`)
  }
  readSPApprovers() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/getapprovers`)
  }
  // entity

  getEntitybody() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Body_Dept/${this.userId}?ent_id=${this.selectedEntityId}`).pipe(retry(2));
  }
  getEntityDept() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Dept/${this.userId}`).pipe(retry(2));
  }
  getDepartment() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Dept/${this.userId}?en_id=${this.selectedEntityId}`).pipe(retry(2));
  }
  readCategory() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntityCategory/${this.userId}?ent_id=${this.selectedEntityId}`);
  }

  /*Approver related */
  readApprovers(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/getDocumentApprovers/${this.userId}/idInvoice/${this.invoiceID}`, data)
  }
  setApprovers(data, bool) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/setDocumentApproval/${this.userId}/idInvoice/${this.invoiceID}?pre_approve=${bool}`, data)
  }

  /* invoice Related */
  getAllInvoice() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentINVList/${this.userId}`).pipe(retry(2))
  }
  getPOData(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentPOList/${this.userId}${data}`).pipe(retry(2));
  }
  getServiceInvoices() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentINVListService/${this.userId}`).pipe(retry(2));
  }
  checkInvStatus(id, string) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/${string}/${id}`).pipe(retry(2));
  }
  changeStatus(data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateStatus/${this.userId}/idDocument/${this.invoiceID}`,data)
  }
  updatePO(id){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/POUpdate/${id}`).pipe(retry(2));
  }


  readReadyGRNData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readGRNReadyInvoiceList/${this.userId}`).pipe(retry(2))
  }
  readReadyGRNInvData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readGRNReadyInvoiceData/${this.userId}?inv_id=${this.invoiceID}`).pipe(retry(2))
  }
  saveGRNData(boolean_value, value): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/saveCustomGRNData/${this.userId}?inv_id=${this.invoiceID}&submit_type=${boolean_value}`, value).pipe(retry(2))
  }
  getPo_numbers(idVen){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getPO_numbers/${this.userId}/${idVen}`).pipe(retry(2))
  }
  getPO_Lines(po_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/getPO_Lines/${this.userId}/${po_num}`).pipe(retry(2))
  }
  checkGRN_PO_duplicates(po_num){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/checkGRN_PO_availability/${this.userId}/${po_num}`)
  }

  // view Invoice
  getInvoiceInfo() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceData/${this.userId}/idInvoice/${this.invoiceID}`).pipe(retry(2), catchError(this.handleError))
  }
  getInvoiceFilePath() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceFile/${this.userId}/idInvoice/${this.invoiceID}`).pipe(retry(2), catchError(this.handleError))
  }
  updateInvoiceDetails(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateInvoiceData/${this.userId}/idInvoice/${this.invoiceID}`, data)
  }
  readColumnInvoice(value) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readColumnPos/${this.userId}/tabname/${value}`).pipe(retry(3));
  }
  updateColumnPOs(data: any, value): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/updateColumnPos/${this.userId}/tabname/${value}`, data)
  }
  readEditedInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/edited`)
  }
  readEditedServiceInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceListService/${this.userId}/exceptions`)
  }
  assignInvoiceTo(inv_id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/assignInvoice/${this.userId}/idInvoice/${inv_id}`)
  }
  submitChangesInvoice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/submitInvoice/${this.userId}/idInvoice/${this.invoiceID}`, data)
  }
  approveInvoiceChanges(data: any) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/approveEditInvoice/${this.userId}/idInvoice/${this.invoiceID}`, data)
  }
  readApprovedInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceList/${this.userId}/approved`).pipe(retry(2));
  }
  readApprovedSPInvoiceData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceListService/${this.userId}/approved`).pipe(retry(2))
  }
  financeApprovalPermission(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Permission/approveDocument/${this.userId}/idInvoice/${this.invoiceID}`, data);
  }
  ITRejectInvoice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/rejectIT/${this.userId}/idInvoice/${this.invoiceID}`, data).pipe(retry(2));
  }
  vendorRejectInvoice(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/rejectVendor/${this.userId}/idInvoice/${this.invoiceID}`, data)
  }
  vendorSubmit(query, uploadtime): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/submitVendorInvoice/${this.userId}?re_upload=${query}&inv_id=${this.invoiceID}&uploadtime=${uploadtime}`)
  }
  triggerBatch(query): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/fr/triggerbatch/${this.invoiceID}${query}`, '')
  }
  vendorSubmitPO(query, uploadtime){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/submitVendorPO/${this.userId}?re_upload=${query}&po_id=${this.invoiceID}&uploadtime=${uploadtime}`)
  }

  // invoiceStatusHistory

  getInvoiceLogs() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readInvoiceStatusHistory/${this.userId}/idInvoice/${this.invoiceID}`).pipe(retry(2));
  }
  downloadDoc() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/journeydoc/docid/${this.invoiceID}`, { responseType: 'blob' });
  }
  downloadJSON(){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/util/download_json/${this.invoiceID}`, { responseType: 'blob' });
  }
  
  // SupportDocumnet
  uploadSupportDoc(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/UploadSupportingDocument/${this.userId}/idInvoice/${this.invoiceID}`, data, {
      reportProgress: true,
      observe: 'events',
    })
  }
  downloadSupportDoc(doc_name) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/DownloadSupportingDocument/${this.userId}/idInvoice/${this.invoiceID}?file_name=${doc_name}`, { responseType: 'blob' })
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
  getPoNumbers(id): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/VendorPortal/getponumbers/${id}`).pipe(retry(2))
  }

  // GRN Related
  getGRNdata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentGRNList/${this.userId}${data}`).pipe(retry(2));
  }
  getARCdata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentARCList/${this.userId}${data}`).pipe(retry(2));
  }
  getRejecteddata(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentRejectList/${this.userId}${data}`).pipe(retry(2));
  }

  getGRNExceptionData(data) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readDocumentGRNException/${this.userId}${data}`);
  }

  // vendorAccounts
  readCustomerVendorAccountsData(vId) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorAccount/${this.userId}/idVendor/${vId}`).pipe(retry(2));
  }

  readUploadPOData(poNumber) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readPOData/${this.userId}/idInvoice/${poNumber}`).pipe(retry(2));
  }

  // OCR
  uploadInvoice(data: any, poNumber): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/VendorPortal/uploadfile/${poNumber}`, data)
  }
  OcrProcess(OCRInput): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ocr/status/stream?file_path=${OCRInput}`, { responseType: 'text', observe: "events" })
  }
  mutliUpload(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/VendorPortal/uploadMultiInvoice/${this.userId}`, data)
  }
  // multiple PO
  readPOnumbers(ent_id, ven_id, s_date, e_date) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/PONumbers/${this.userId}?entityid=${ent_id}&vendorid=${ven_id}&createddatestart=${s_date}&createddateend=${e_date}`)
  }
  readPOLines(po_num) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/POLines/${po_num}`)
  }
  saveMultiPO(data, query) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/MultiPo/savedata${query}`, data)
  }
  uploadMultiPO(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/MultiPo/uploadmultipo`, data)
  }
  downloadTemplate(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/MultiPo/Downloadstemplatemultipo`, data, { responseType: 'blob' })
  }
  readSavedLines(filename) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/getdata?filename=${filename}`)
  }

  // LCM
  getLCMPOnum(ent_id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readLCMPolist/${this.userId}?inv_id=${this.invoiceID}&entity_id=${ent_id}`)
  }
  getLCMLines(po_num) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readLcmLineData/${this.userId}?inv_id=${this.invoiceID}&po_id=${po_num}`)
  }
  getChargesCode(dataArea, ContextRecId, ContextTableId) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/MultiPo/chargescode/${dataArea}/${ContextRecId}/${ContextTableId}`)
  }
  saveLCMdata(data, bool) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/saveLCMLineData/${this.userId}?inv_id=${this.invoiceID}&save_type=${bool}`, data)
  }
  uploadLCM_xl(file) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/getExcelData/${this.userId}?inv_id=${this.invoiceID}`, file)
  }
  downloadLCMTemplate(data) {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/Invoice/downloadLcmTemplate/`, data, { responseType: 'blob' })
  }
  getsavedLCMLineData() {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Invoice/readLcmData/${this.userId}?inv_id=${this.invoiceID}`)
  }

  // help document download
  downloadHelpDoc(file) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/util/download_excel/${file}`, { responseType: 'blob' })
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
