import { AuthenticationService } from 'src/app/services/auth/auth.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { retry, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  userId: any;
  url = environment.apiUrl;
  private apiUrl = environment.apiUrl
  private apiVersion = environment.apiVersion
  headers_object;
  httpOptions;
  storeVendorsList = new BehaviorSubject<any>([]);
  storeCustomersList = new BehaviorSubject<any>([]);
  storeServiceProviderList = new BehaviorSubject<any>([]);
  storeEntityList = new Subject();
  vendorDetails: any;
  customerDetails:any;
  SPDetails:any;
  private vendorDataSubject: BehaviorSubject<any>;
  private customerDataSubject: BehaviorSubject<any>;
  private SPDataSubject: BehaviorSubject<any>;
  private vendorData: Observable<any>;
  private customerData: Observable<any>; 
  private SPData: Observable<any>;
  finalJsonData = new Subject();

  modelData: any;
  modelObsevable: Observable<any>
  configDataSubject: BehaviorSubject<any>;
  frData: any;

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
  isAdmin: boolean;
  vendorList = [];
  customerList = [];
  selectedEntityId: any = 'ALL';
  onboard_status: any = 'ALL';
  vendorNameForSearch = 'ALL';
  customerNameForSearch:any;
  spNameForSearch = 'ALL';
  selected_Vendor: any;
  selected_ent = {EntityName: 'ALL', idEntity: 'ALL'};
  selected_sp: any;
  currencies = [ 
    {"currency":"AED",
    "description":"United Arab Emirates Dirham"},
    {"currency":"AFN",
    "description":"Afghan Afghani"},
    {"currency":"ALL",
    "description":"Albanian Lek"},
    {"currency":"AMD",
    "description":"Armenian Dram"},
    {"currency":"ANG",
    "description":"Netherlands Antillean Guilder"},
    {"currency":"AOA",
    "description":"Angolan Kwanza"},
    {"currency":"ARS",
    "description":"Argentine Peso"},
    {"currency":"AUD",
    "description":"Australian Dollar"},
    {"currency":"AWG",
    "description":"Aruban Florin"},
    {"currency":"AZN",
    "description":"Azerbaijani Manat"},
    {"currency":"BAM",
    "description":"Bosnia & Herzegovina Convertible Mark"},
    {"currency":"BBD",
    "description":"Barbadian Dollar"},
    {"currency":"BDT",
    "description":"Bangladeshi Taka"},
    {"currency":"BGN",
    "description":"Bulgarian Lev"},
    {"currency":"BHD",
    "description":"Bahraini Dinar"},
    {"currency":"BIF",
    "description":"Burundian Franc"},
    {"currency":"BMD",
    "description":"Bermudian Dollar"},
    {"currency":"BND",
    "description":"Brunei Dollar"},
    {"currency":"BOB",
    "description":"Bolivian Boliviano"},
    {"currency":"BRL",
    "description":"Brazilian Real"},
    {"currency":"BSD",
    "description":"Bahamian Dollar"},
    {"currency":"BTN",
    "description":"Bhutanese Ngultrum"},
    {"currency":"BWP",
    "description":"Botswana Pula"},
    {"currency":"BYN",
    "description":"Belarus Ruble"},
    {"currency":"BZD",
    "description":"Belize Dollar"},
    {"currency":"CAD",
    "description":"Canadian Dollar"},
    {"currency":"CDF",
    "description":"Congolese Franc"},
    {"currency":"CHF",
    "description":"Swiss Franc"},
    {"currency":"CLP",
    "description":"Chilean Peso"},
    {"currency":"CNY",
    "description":"Chinese Yuan"},
    {"currency":"COP",
    "description":"Colombian Peso"},
    {"currency":"CRC",
    "description":"Costa Rican Colon"},
    {"currency":"CUC",
    "description":"Cuban Convertible Peso"},
    {"currency":"CVE",
    "description":"Cape Verdean Escudo"},
    {"currency":"CZK",
    "description":"Czech Republic Koruna"},
    {"currency":"DJF",
    "description":"Djiboutian Franc"},
    {"currency":"DKK",
    "description":"Danish Krone"},
    {"currency":"DOP",
    "description":"Dominican Peso"},
    {"currency":"DZD",
    "description":"Algerian Dinar"},
    {"currency":"EGP",
    "description":"Egyptian Pound"},
    {"currency":"ERN",
    "description":"Eritrean Nakfa"},
    {"currency":"ETB",
    "description":"Ethiopian Birr"},
    {"currency":"EUR",
    "description":"Euro"},
    {"currency":"FJD",
    "description":"Fiji Dollar"},
    {"currency":"FUS",
      "description":"F-United States Dollar"},
    {"currency":"GBP",
    "description":"British Pound Sterling"},
    {"currency":"GEL",
    "description":"Georgian Lari"},
    {"currency":"GHS",
    "description":"Ghanaian Cedi"},
    {"currency":"GIP",
    "description":"Gibraltar Pound"},
    {"currency":"GMD",
    "description":"Gambian Dalasi"},
    {"currency":"GNF",
    "description":"Guinea Franc"},
    {"currency":"GTQ",
    "description":"Guatemalan Quetzal"},
    {"currency":"GYD",
    "description":"Guyanaese Dollar"},
    {"currency":"HKD",
    "description":"Hong Kong Dollar"},
    {"currency":"HNL",
    "description":"Honduran Lempira"},
    {"currency":"HRK",
    "description":"Croatian Kuna"},
    {"currency":"HTG",
    "description":"Haiti Gourde"},
    {"currency":"HUF",
    "description":"Hungarian Forint"},
    {"currency":"IDR",
    "description":"Indonesian Rupiah"},
    {"currency":"ILS",
    "description":"Israeli Shekel"},
    {"currency":"INR",
    "description":"Indian Rupee"},
    {"currency":"IQD",
    "description":"Iraqi Dinar"},
    {"currency":"IRR",
    "description":"Iranian Rial"},
    {"currency":"ISK",
    "description":"Icelandic Krona"},
    {"currency":"JMD",
    "description":"Jamaican Dollar"},
    {"currency":"JOD",
    "description":"Jordanian Dinar"},
    {"currency":"JPY",
    "description":"Japanese Yen"},
    {"currency":"KES",
    "description":"Kenyan Shilling"},
    {"currency":"KGS",
    "description":"Kyrgystani Som"},
    {"currency":"KHR",
    "description":"Cambodian Riel"},
    {"currency":"KMF",
    "description":"Comorian Franc"},
    {"currency":"KPW",
    "description":"North Korean Won"},
    {"currency":"KRW",
    "description":"South Korean Won"},
    {"currency":"KWD",
    "description":"Kuwaiti Dinar"},
    {"currency":"KYD",
    "description":"Cayman Islands Dollar"},
    {"currency":"KZT",
    "description":"Kazakhstan Tenge"},
    {"currency":"LAK",
    "description":"Laotian Kip"},
    {"currency":"LBP",
    "description":"Lebanese Pound"},
    {"currency":"LKR",
    "description":"Sri Lankan Rupee"},
    {"currency":"LRD",
    "description":"Liberian Dollar"},
    {"currency":"LSL",
    "description":"Lesotho Loti"},
    {"currency":"LYD",
    "description":"Libyan Dinar"},
    {"currency":"MAD",
    "description":"Moroccan Dirham"},
    {"currency":"MDL",
    "description":"Moldovan Leu"},
    {"currency":"MGA",
    "description":"Malagasy Ariary"},
    {"currency":"MKD",
    "description":"Macedonian Denar"},
    {"currency":"MMK",
    "description":"Myanma Kyat"},
    {"currency":"MNT",
    "description":"Mongolian Tugrik"},
    {"currency":"MOP",
    "description":"Macau Pataca"},
    {"currency":"MRO",
    "description":"Mauritanian Ouguiya"},
    {"currency":"MUR",
    "description":"Mauritian Rupee"},
    {"currency":"MVR",
    "description":"Maldivian Rufiyaa"},
    {"currency":"MWK",
    "description":"Malawi Kwacha"},
    {"currency":"MXN",
    "description":"Mexican Peso"},
    {"currency":"MYR",
    "description":"Malaysian Ringgit"},
    {"currency":"MZN",
    "description":"Mozambican Metical"},
    {"currency":"NAD",
    "description":"Namibian Dollar"},
    {"currency":"NGN",
    "description":"Nigerian Naira"},
    {"currency":"NIO",
    "description":"Nicaragua Cordoba"},
    {"currency":"NOK",
    "description":"Norwegian Krone"},
    {"currency":"NPR",
    "description":"Nepalese Rupee"},
    {"currency":"NZD",
    "description":"New Zealand Dollar"},
    {"currency":"OMR",
    "description":"Omani Rial"},
    {"currency":"PAB",
    "description":"Panamanian Balboa"},
    {"currency":"PEN",
    "description":"Peruvian Nuevo Sol"},
    {"currency":"PGK",
    "description":"Papua New Guinean Kina"},
    {"currency":"PHP",
    "description":"Philippine Peso"},
    {"currency":"PKR",
    "description":"Pakistani Rupee"},
    {"currency":"PLN",
    "description":"Polish Zloty"},
    {"currency":"PYG",
    "description":"Paraguayan Guarani"},
    {"currency":"QAR",
    "description":"Qatari Riyal"},
    {"currency":"RON",
    "description":"Romanian Leu"},
    {"currency":"RSD",
    "description":"Serbian Dinar"},
    {"currency":"RUB",
    "description":"Russian Ruble"},
    {"currency":"RWF",
    "description":"Rwanda Franc"},
    {"currency":"SAR",
    "description":"Saudi Riyal"},
    {"currency":"SBD",
    "description":"Solomon Islands Dollar"},
    {"currency":"SCR",
    "description":"Seychellois Rupee"},
    {"currency":"SDG",
    "description":"Sudanese Pound"},
    {"currency":"SEK",
    "description":"Swedish Krona"},
    {"currency":"SGD",
    "description":"Singapore Dollar"},
    {"currency":"SHP",
    "description":"Saint Helena Pound"},
    {"currency":"SLL",
    "description":"Sierra Leonean Leone"},
    {"currency":"SOS",
    "description":"Somali Shilling"},
    {"currency":"SRD",
    "description":"Surinamese Dollar"},
    {"currency":"SSP",
    "description":"South Sudanese Pound"},
    {"currency":"STD",
    "description":"Sao Tome and Principe Dobra"},
    {"currency":"SYP",
    "description":"Syrian Pound"},
    {"currency":"SZL",
    "description":"Swazi Lilangeni"},
    {"currency":"THB",
    "description":"Thai Baht"},
    {"currency":"TJS",
    "description":"Tajikistan Somoni"},
    {"currency":"TMT",
    "description":"Turkmenistani Manat"},
    {"currency":"TND",
    "description":"Tunisian Dinar"},
    {"currency":"TOP",
    "description":"Tonga Paanga"},
    {"currency":"TRY",
    "description":"Turkish Lira"},
    {"currency":"TTD",
    "description":"Trinidad and Tobago Dollar"},
    {"currency":"TWD",
    "description":"New Taiwan Dollar"},
    {"currency":"TZS",
    "description":"Tanzanian Shilling"},
    {"currency":"UAH",
    "description":"Ukrainian Hryvnia"},
    {"currency":"UGX",
    "description":"Ugandan Shilling"},
    {"currency":"USD",
    "description":"United States Dollar"},
    {"currency":"UYU",
    "description":"Uruguayan Peso"},
    {"currency":"UZS",
    "description":"Uzbekistan Som"},
    {"currency":"VEF",
    "description":"Venezuelan Bolivar"},
    {"currency":"VND",
    "description":"Vietnamese Dong"},
    {"currency":"VUV",
    "description":"Vanuatu Vatu"},
    {"currency":"WST",
    "description":"Samoan Tala"},
    {"currency":"XAF",
    "description":"Central African CFA franc"},
    {"currency":"XCD",
    "description":"East Caribbean Dollar"},
    {"currency":"XOF",
    "description":"West African CFA franc"},
    {"currency":"XPF",
    "description":"CFP Franc"},
    {"currency":"YER",
    "description":"Yemeni Rial"},
    {"currency":"ZAR",
    "description":"South African Rand"},
    {"currency":"ZMW",
    "description":"Zambian Kwacha"}
    ]
  languages = [
      {"language":"English","code":'en'},
      {"language":"Arabic","code":'ar'},
      {"language":"French","code":'fr'},
      {"language":"Spanish","code":'es'},
      {"language":"German","code":'ge'},
      {"language":"Hindi","code":'hi'},
      {"language":"Italian","code":'it'},
      {"language":"Turkish","code":'tr'}
    ]
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('vendorData')) {
      this.vendorDataSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('vendorData')));
      this.vendorData = this.vendorDataSubject.asObservable();
    }
    if (sessionStorage.getItem('customerData')){
      this.customerDataSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('customerData')));
      this.customerData = this.customerDataSubject.asObservable();
    }
    if(sessionStorage.getItem('spData')){
      this.SPDataSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('spData')));
      this.SPData = this.SPDataSubject.asObservable();
    }
    if (sessionStorage.getItem('configData')) {
      this.configDataSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('configData')));
      this.modelObsevable = this.configDataSubject.asObservable();
    }

  }
  // sendModelData(){
  //   this.modelStatusData.next(this.modelData);
  // }
  // getModalData(): Observable<any> {
  //   return this.modelStatusData.asObservable();
  // }
  readConfig() {
    let headers = {
      "Content-Type":"application/json",
      "X-API-Key":"bI7_OesAIGPrBIBxvYbiaxfGzRUAmRdcdMvigsmG6gh6AzFutEqx_Q=="
    }

    let options = {
      headers: new HttpHeaders( headers )
    }
    return this.http.get(`${environment.apiUrl}/apiv1.1/Instance/getInstanceInfo`,options).pipe(retry(3));
   }
   
  readVendorData():Observable<any>{
    return this.storeVendorsList.asObservable();
  }
  readCustomerData():Observable<any>{
    return this.storeCustomersList.asObservable();
  }
  readSPData():Observable<any>{
    return this.storeServiceProviderList.asObservable();
  }
  sendMail(email: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/resetPassword/?email=${email}`).pipe(retry(3));
  }
  updatepass(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/setPassword/`,data).pipe(retry(3));
  }

  public get currentSPData(): any{
    return this.SPDataSubject.value;
  }
  public get currentVendorData(): any {
    return this.vendorDataSubject.value;
  }
  public get currentCustomerData(): any{
    return this.customerDataSubject.value;
  }

  public get configData(): any {
    return this.configDataSubject.value;
  }

  getVendors(data): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/vendorlist/${this.userId}${data}`).pipe(retry(3));
  }

  getVendorsListToCreateNewlogin(id) {
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/vendorNameList/${this.userId}` + id).pipe(retry(3));
  }

  getServiceProviders(data): Observable<any>{
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceproviderlist1/${this.userId}${data}`).pipe(retry(3));
  }
  getServiceList(param){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/ServiceProvider/serviceproviderlist/${this.userId}${param}`).pipe(retry(3));
  }

  getOnboardedData():Observable<any>{
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/Vendor/check_onboarded/${this.userId}`).pipe(retry(3));
  }

  getVendorAccounts(v_id): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/vendoraccount/${v_id}`).pipe(retry(3));
  }
  getSPAccounts(v_id): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/serviceaccount/${v_id}`).pipe(retry(3));
  }
  getSummaryEntity() {
    return this.http
      .get(
        `${environment.apiUrl}/apiv1.1/Summary/apiv1.1/EntityFilter/${this.userId}`
      ).pipe(retry(3));
  }
  getFrConfig(): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getfrconfig/${this.userId}`).pipe(
      take(1)
    );
  }
  addMailListeners(data,userID) : Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/emailconfig/addMailListeners/${userID}`, data).pipe(retry(3));
  }
  getAllMailListeners(): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/emailconfig/getAllMailListeners`).pipe(retry(3));
  }
  getMetaData(documentId): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getfrmetadata/${documentId}`).pipe(retry(3));
  }
  downloadDoc(tagtype){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/fr/entityTaggedInfo?tagtype=${tagtype}`,{responseType: 'blob'}).pipe(retry(3));
  }
  downloadDocAccuracy(tagtype){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/fr/getAccuracyByEntity/${tagtype}`,{responseType: 'blob'}).pipe(retry(3));
  }
  getAccuracyScore(type,name){
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getActualAccuracy/${type}?name=${name}`).pipe(retry(3));
  }
  getAllTags(tagtype,docType):Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getalltags?tagtype=${tagtype}&docType=${docType}`).pipe(retry(3));
  }
  updateFrConfig(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/updatefrconfig/${this.userId}`, data).pipe(retry(3));
  }
  getRules(): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/documentrules`).pipe(retry(3));
  }
  getAmountRules(): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/documentrulesnew`).pipe(retry(3));
  }
  updateFrMetaData(documentId,data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/update_metadata/${documentId}`,data).pipe(retry(3));
  }
  getModalList(v_id,doctype): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getmodellist/${v_id}?doctype=${doctype}`).pipe(retry(3));
  }
  getModalListSP(s_id): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getmodellistsp/${s_id}`).pipe(retry(3));
  }

  createNewTemplate(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/createmodel/${this.userId}`, data).pipe(retry(3));
  }

  uploadFolder(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/uploadfolder`, data).pipe(retry(3));
  }
  uploadHTMLFile(data,folderpath): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/fr/upload_html_template?folderpath=${folderpath}`,data).pipe(retry(3));
  }
  uploadBlob(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/upload_blob`, data).pipe(retry(3));
  }

  uploadFileblob(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/uploadfile`, data).pipe(retry(3));
  }

  modelValidate(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/model_validate`, data).pipe(retry(3));
  }
  saveLabelsFile(frobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/save_labels_file`,frobj).pipe(retry(3));
  }
  deleteBlob(blobname): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/DeleteBlob?blob=${blobname}`).pipe(retry(3));
  }
  checkModelStatus(modelId): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/check_model_status/${modelId}`).pipe(retry(3));
  }
  saveFieldsFile(frobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/save_fields_file`,frobj).pipe(retry(3));
  }
  getFinalData(modal_id): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getfinaldata/${modal_id}`).pipe(
      tap((data: any) => {
        this.finalJsonData.next(data);
      })
    );
  }
  getModelsByVendor(modeltype:any,Id:any): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/get_training_result_vendor/${modeltype}/${Id}`).pipe(retry(3));
  }
  reupload_blob(data): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/reupload_blob`, data).pipe(retry(3));
  }

  updateModel(data, modal_id): Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/fr/updatemodel/${modal_id}`, data).pipe(retry(3));
  }
  checkSameVendors(vendoraccount,modelname): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/checkduplicatevendors/${vendoraccount}/${modelname}`).pipe(retry(3));
  }
  checkSameSP(serviceaccount,modelname): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/checkduplicatesp/${serviceaccount}/${modelname}`).pipe(retry(3));
  }
  copymodels(vendoraccount,modelname): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/copymodels/${vendoraccount}/${modelname}`).pipe(retry(3));
  }
  copymodelsSP(serviceaccount,modelname): Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/fr/copymodelsSP/${serviceaccount}/${modelname}`).pipe(retry(3));
  }
  getallEntities(): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/fr/get_all_entities/${this.userId}`).pipe(retry(3));
  }
  updateEntity(ent,obj):Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/fr/update_entity/${ent}`,obj).pipe(retry(3));
  }
  uploadDb(data, modal_id):Observable<any>{
    return  this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/newModel/${modal_id}/${this.userId}`, data).pipe(retry(3));
  }
  getTrainingTestRes(modal_id):Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/fr/getTrainTestResults/${modal_id}`).pipe(retry(3));
  }
  getTaggingInfo(container,folderpath,connstr,documentId): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/get_tagging_info/${documentId}`,{headers:new HttpHeaders({'container':container,'connstr':connstr,"path":folderpath})}).pipe(retry(3));
  }
  getAnalyzeResult(frobj):Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/get_analyze_result/${frobj['container']}`,{headers:new HttpHeaders({'filename':frobj['filename'],'connstr':frobj['connstr'],'fr_endpoint':frobj['fr_endpoint'],'fr_key':frobj['fr_key'],'account':frobj['account']})}).pipe(retry(3));
  }
  getAnalyzeResultHTML(filename):Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/get_analyze_result_html?filename=${filename}`).pipe(retry(3));
  }
  saveHTMLFields(fields,modelName):Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/save_analyze_result_html?modelName=${modelName}`,fields).pipe(retry(3));
  }
  getTrainingResult(documentId): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/get_training_result/${documentId}`).pipe(retry(3));
  }
  trainModel(frobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/train-model`,frobj).pipe(retry(3));
  }
  updateTrainingResult(resultobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/create_training_result`,resultobj).pipe(retry(3));
  }
  composeModels(modelsobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/compose_model`,modelsobj).pipe(retry(3));
  }
  saveComposedModel(modelobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/create_compose_result`,modelobj).pipe(retry(3));
  }
  testModel(modelobj): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/test_analyze_result/${modelobj['modelName']}/model/${modelobj['modelid']}`,modelobj['formData'],{headers:new HttpHeaders({'fr_endpoint':modelobj['fr_endpoint'],'fr_key':modelobj['fr_key']})}).pipe(retry(3));
  }
  testHtml(formData): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/test_analyze_result_html`,formData).pipe(retry(3));
  }
  getHtmlResult(content): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/ModelOnBoard/get_test_result`,{"content":content}).pipe(retry(3));
  }
  addVendor(vendorobj,vu_id): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/Vendor/newVendor/${vu_id}`,vendorobj).pipe(retry(3));
  }
  addSP(spobj,vu_id): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/Vendor/newVendor/${vu_id}`,spobj).pipe(retry(3));
  }
  addVendorAccount(vendoraccobj,vu_id,v_id): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/Vendor/newVendorAccount/${vu_id}/idVendor/${v_id}`,vendoraccobj).pipe(retry(3));
  }
  addCustomerAccount(vendoraccobj,vu_id,v_id): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/Vendor/newVendorAccount/${vu_id}/idVendor/${v_id}`,vendoraccobj).pipe(retry(3));
  }
  addSPAccount(vendoraccobj,vu_id,v_id): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/Vendor/newVendorAccount/${vu_id}/idVendor/${v_id}`,vendoraccobj).pipe(retry(3));
  }
  getemailconfig(doctype): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/emailconfig/getemailconfig/${doctype}`).pipe(retry(3));
  }
  saveemailconfig(emailconfig): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/emailconfig/saveemailconfig`,emailconfig).pipe(retry(3));
  }

  getSharepointconfig(doctype): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/sharepoint/getsharepointconfig/${doctype}`).pipe(retry(3));
  }
  saveSharePointConfig(shareConfig): Observable<any>{
    return this.http.post(`${this.url}/${this.apiVersion}/sharepoint/savesharepointconfig`,shareConfig).pipe(retry(3));
  }
  resetTagging(resetObj,filename): Observable<any>{
    let url = `${this.url}/${this.apiVersion}/ModelOnBoard/reset_tagging`;
    if (filename) {
      url += `?filename=${filename}`;
    }
    return this.http.post(url,resetObj).pipe(retry(3));
  }
  // auto tagging value to fields
  tagValuesToFields(folderPath: string, fileName?: string): Observable<any> {
    let url = `${this.url}/${this.apiVersion}/ModelOnBoard/autoLabels/${folderPath}`;
    if (fileName) {
      url += `?filename=${fileName}`;
    }
    return this.http.get(url).pipe(retry(3));
  }

  runLayout(folderPath:string): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/runlayout/${folderPath}`).pipe(retry(3));
  }

  getLabelsInfo(folderPath,filename): Observable<any>{
    return this.http.get(`${this.url}/${this.apiVersion}/ModelOnBoard/get_labels_info/${filename}`,{headers:new HttpHeaders({'folderpath':folderPath})}).pipe(retry(3));
  }

  readServiceRules(){
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Permission/getSerinaRules/${this.userId}`).pipe(retry(3));
  }

  /*Configuration settings APIs*/
  financeApprovalSetting(data):Observable<any> {
    return this.http.post(`${environment.apiUrl}/${environment.apiVersion}/Customer/enableInvoiceApprovals/${this.userId}?isenabled=${data}`,'').pipe(retry(3));
  }

  readGeneralSettings():Observable<any> {
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/Customer/readGenSettings/${this.userId}`).pipe(retry(3));
  }
  readServiceTriggerSettings():Observable<any> {
    return this.http.get(`${this.url}/${this.apiVersion}/Permission/readServiceSchedule/${this.userId}`).pipe(retry(3));
  }
  serviceBatchTriggerUpdate(data):Observable<any> {
    return this.http.post(`${this.url}/${this.apiVersion}/Permission/updateServiceSchedule/${this.userId}`,data).pipe(retry(3));
  }
  readApprovalSettings(){
    return this.http.get(`${this.url}/${this.apiVersion}/Permission/readApproveSetting/${this.userId}`).pipe(retry(3));
  }
  updateApprovalSettings(data){
    return this.http.post(`${this.url}/${this.apiVersion}/Permission/updateApproveSetting/${this.userId}`,data).pipe(retry(3));
  }

    // entity
    getEntitybody() {
      return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Body_Dept/${this.userId}?ent_id=${this.selectedEntityId}`).pipe(retry(3));
    }
    getEntityDept() {
      return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Dept/${this.userId}`).pipe(retry(3));
    }
    getDepartment(){
      return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntity_Dept/${this.userId}?en_id=${this.selectedEntityId}`).pipe(retry(3));
    }
    readCategory() {
      return this.http.get(`${this.apiUrl}/${this.apiVersion}/Customer/readEntityCategory/${this.userId}?ent_id=${this.selectedEntityId}`).pipe(retry(3));
    }
}