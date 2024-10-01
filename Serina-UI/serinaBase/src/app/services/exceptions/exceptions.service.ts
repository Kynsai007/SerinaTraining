import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExceptionsService {




  userId: any;
  poNumber: string;
  invoiceID:number;

  selectedRuleId:number;
  popupmsg = new BehaviorSubject<string>("sample");
  po_num:string;
  
  constructor(private http : HttpClient) { }

  readBatchInvoicesData(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/batchprocesssummary/${this.userId}`).pipe(retry(3))
  }

  readApprovalPendingData():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/readPendingInvoiceApprovals/${this.userId}`)
  }

  readBatchRules():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/fr/documentrules`).pipe(retry(3))
  }

  updatePONumber(po_num):Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/Update_po_number/${this.invoiceID}/po_num/${po_num}`).pipe(retry(3))
  };

  readLineItems():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/get_items/${this.invoiceID}`).pipe(retry(3))
  };

  readLineData():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/lineitem_po_grn/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  readFilePath():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/readfilepath/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  readErrorTypes():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/get_errortypes`).pipe(retry(3))
  }

  updateLineItems(inv_itemcode,po_itemcode,errorId,vendorAcId):Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/update_line_mapping/${this.invoiceID}/${inv_itemcode}/${po_itemcode}/${errorId}/${vendorAcId}/${this.userId}`).pipe(retry(3))
  }

  readMappedData():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/get_mappeditem/${this.invoiceID}`).pipe(retry(3))
  }

  getInvoiceInfo(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/testlinedata/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  getInvoicePOs():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/allpos/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  send_batch_approval_review(rule_id):Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/Send_to_batch_approval/${this.userId}/invoiceid/${this.invoiceID}?rule_id=${rule_id}`).pipe(retry(3))
  }

  send_review_manual():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/Send_to_manual_approval/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  send_batch_approval():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/Send_to_batch_approval_Admin/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  send_manual_approval():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/Send_to_manual_approval_Admin/${this.userId}/invoiceid/${this.invoiceID}`).pipe(retry(3))
  }

  readInvokeBatchData():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/Invokebatchprocesssummary/${this.userId}`).pipe(retry(3))
  }


  // lock feature
  getDocumentLockInfo(data):Observable<any> {
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/getDocumentLockInfo/${this.userId}/idDocument/${this.invoiceID}`,data)
  }
  updateDocumentLockInfo(data):Observable<any> {
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/updateDocumentLockInfo/${this.userId}/idDocument/${this.invoiceID}`,data)
  }
  checkInvStatus(id){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/checkInvStatus/3/?doc_id=${id}`).pipe(retry(3))
  }

  // line related
  removeLineData(item_code):Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/deleteLineItem/${this.invoiceID}/${item_code}`)
  }
  checkItemCode(item_code):Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/checkLineItemExists/${this.invoiceID}/${item_code}`)
  }
  addLineItem(data):Observable<any> {
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/createLineItem`,data)
  }

  getPOLines(query){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/get_po_lines/${this.userId}/${this.invoiceID}${query}`)
  }

  flip_po(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Exception/flip_po_lines/${this.userId}/${this.invoiceID}`,data)
  }
  validateFlipPO(data,po_num){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/validateFlipPO/${this.userId}?po_num=${po_num}`,data)
  }

  validateReturns(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/Validate_returnlines/${this.userId}`,data)
  }

  getFlipApprovers(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/getFlipPoApprovers/${this.userId}?inv_id=${this.invoiceID}`)
  }
  setFlipApproval(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Exception/savefliPoapprovers/${this.userId}?inv_id=${this.invoiceID}`,data)
  }
  approveFlip(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Exception/flippoDocumentApprove/${this.userId}?inv_id=${this.invoiceID}`,data)
  }

  update_GRN_data(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/updateGRNdata/${this.userId}/idDocument/${this.invoiceID}`,data)
  }
  readProjectData(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/getProjectIDs/1?inv_id=${this.invoiceID}`);
  }
  readProjectCatData(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/getProjectCategoryIDs/1?inv_id=${this.invoiceID}`);
  }
  saveProjectData(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Exception/saveProjectDetails/${this.userId}?inv_id=${this.invoiceID}`,data);
  }
  savePreData(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Exception/customLinedatasave/${this.userId}?inv_id=${this.invoiceID}`,data);
  }
  sendToMore(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Permission/setToMoreInfo/${this.userId}/idInvoice/${this.invoiceID}`,data);
  }
  proceedMoreInfo(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Permission/proceedFromMoreInfo/${this.userId}/idInvoice/${this.invoiceID}`,data);
  }
  amountToApply(amount,id_doc){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/checkPrepaymentRemainingAmout/${this.userId}?inv_id=${this.invoiceID}&amount_to_apply=${amount}&line_item_id=${id_doc}`)
  }

  get_grn_data(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/get_GRNSelected_lines/${this.userId}/${this.invoiceID}`)
  }
  approve_grn(){
    let data = {
      "user_id": this.userId,
      "grn_id": this.invoiceID
    }
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/ApproveGRN`,data)
  }
  getMsg(){
    return this.popupmsg.asObservable();
  }

  getDocumentDetails(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Exception/readlinedata/${this.userId}/poid/${this.invoiceID}`)
  }
  readMasterData(v_id){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/readMasterData/${this.userId}/${v_id}`)
  }
  updateSOmap(so_id,v_a_id,data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Exception/update_line_mapping_so/${so_id}/${v_a_id}/${this.userId}`,data)
  }
  submitAllocationDetails(data: any): Observable<any> {

    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/save_values_into_db/${this.userId}?documentID=${this.invoiceID}`,data)
  }
  editedDynamicAllocationDetails(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/updateDynamicCostAllocation/${this.userId}?documentID=${this.invoiceID}`,data)
  }

  getApprovedUsers(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/getApprovedUsers/${this.userId}/idInvoice/${this.invoiceID}`);
  }
  rejectApprove(data,ap_id){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/rejectApprover/${this.userId}/idInvoice/${this.invoiceID}?approver_id=${ap_id}`,data);
  }

  rejectCommentsList(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/getRejectedRecord_approval/${this.invoiceID}`);
  }
  getInvTypes(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/invoiceTypes`)
  }
  changeEntity(ent_id){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/change_entity/${this.invoiceID}?entity_id=${ent_id}`)
  }
  changeInvType(type){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/changInvoiceType/${this.userId}/${this.invoiceID}?invoice_type=${type}`) 
  }
  getAdPercentage(data){
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Advance/Getadvancepercentamount/${this.userId}?inv_id=${this.invoiceID}`,data) 
  }
  getManpowerMetaData(po_id){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/getmanPowerMetadata/${po_id}/${this.userId}`) 
  }
  getManpowerPrefill(po_id,s_date,e_date){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/getManpowerPrefill/${po_id}?startdate=${s_date}&enddate=${e_date}`) 
  }
  getManPowerData(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Invoice/getManpowerGRN/${this.invoiceID}/${this.userId}`) 
  }
  createTimesheet(po_id,manPowerAPI_request: any,context:any) {
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Invoice/createManpowerGRN/${po_id}/${context}/${this.userId}`,manPowerAPI_request) 
  }

  convertData(inputData, purchId: string) {
    const output = [];
    
    // Helper function to find value by tag name
    const findValueByTagName = (tagName: string,index): string | null => {
      const item = inputData.find(tag => tag.TagName === tagName);
      return item ? item.linedata[index].DocumentLineItems.Value : null;
    };
  
    // Iterate through each name (Description) tag
    inputData.forEach(tag => {
      if (tag.TagName === 'Description') {
        tag.linedata.forEach((line,i)=>{
          const name = line.DocumentLineItems.Value;
          const poLinenumber = findValueByTagName('POLineNumber',i);
          const lineNumber = findValueByTagName('LineNumber',i);
          const quantity = findValueByTagName('Quantity',i);
          const remainInventPhysical = findValueByTagName('PackingSlip',i);
          const unitPrice = findValueByTagName('UnitPrice',i);
    
          output.push({
            PurchId: purchId,
            Name: name || '',
            LineNumber: lineNumber || poLinenumber,
            GRNQty: quantity || '',
            PurchQty:  '',
            RemainInventPhysical: remainInventPhysical || '',
            UnitPrice: unitPrice || ''
          });
        })
      }
    });
  
    return output;
  }
}
