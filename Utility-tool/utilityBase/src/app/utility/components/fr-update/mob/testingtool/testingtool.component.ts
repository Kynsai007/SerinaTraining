import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {CdkDragEnd,CdkDragMove} from '@angular/cdk/drag-drop';
import * as pdfjsLib from 'pdfjs-dist';
import { SharedService } from 'src/app/services/shared/shared.service';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { finalize, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-testingtool',
  templateUrl: './testingtool.component.html',
  styleUrls: ['./testingtool.component.css']
})
export class TestingtoolComponent implements OnInit,AfterViewInit {
  frp_id:any;
  saving:boolean=false;
  ready:boolean=false;
  mandatory_field_check: number = 1;
  zoomVal:number = 0.6;
  switchLabel: string = "Yes";
  mandatoryboolean=true;
  currentpage:string="";
  vendor:string="";
  vendorcount:Number=0;
  model_invalidate_msg:string="";
  model_validate_msg:string="";
  analyzing:boolean=false;
  maxpage:number=1;
  uploadingFileBoolean:boolean=false;
  invalidModelBoolean:boolean=true;
  status4Boolean:boolean=false;
  target:any;
  currentwidth:number;
  current_result:string="";
  currentheight:number;
  currentindex: number = 0;
  resp:any;
  nottrained:boolean=true;
  previoustraining:any[] = [];
  models:any[] = [];
  fields:any;
  modelid:string="";
  modelname:string="";
  readResults:any[]=[];
  modelStatus:any;
  validating:boolean=false;
  jsonFinalData: any;
  file_url:string="";
  testing:boolean=false;
  uploadbuttonmsg:string="Save to DB";
  file:File;
  jsonresult:any;
  p_name:any;
  analyzed:boolean = false;
  colors:any[]=[];
  currenttable:string="";
  valuename:string="";
  valueent:string="";
  currentheaders:any[]=[];
  defaultmodel:string="";
  rows:any[]=[];
  testfields:any;
  htmlstring:string;
  cleanedhtmlstring:string;
  sanitizedHtml: SafeHtml;
  @ViewChild('htmlcontainer', { read: ElementRef }) htmlcontainer!: ElementRef;
  pid:any;
  @Input() modelData:any;
  @Input() frConfigData:any; 
  @Input() showtab:any;
  @Output() changeTab = new EventEmitter<{'show1':boolean,'show2':boolean,'show3':boolean,'show4':boolean}>();
  ocr_version: any;
  
  constructor(private sharedService:SharedService,private domSanitizer: DomSanitizer,private messageService: MessageService,private router:Router) {
    this.ready = false;
    this.jsonresult = {};
  }
  RoundOff(i:number){
    return i.toFixed(2);
  }
  domsanitize(str:string){
    return this.domSanitizer.bypassSecurityTrustUrl(str);
  }
  ngAfterViewInit(): void {
    sessionStorage.setItem("modelData",JSON.stringify(this.modelData));
    sessionStorage.setItem("configData",JSON.stringify(this.frConfigData));
  }
  getTemplang(){
    return sessionStorage.getItem("temp_lang");
  }
  ngOnInit(): void {
    this.ocr_version = this.modelData?.model_version || 'v2.1';
    try {
      this.setup();
    }catch(ex){
      console.log(ex)
    }
  }
  navigatetoPage(page:string){
    if(page == 'tagging'){
      this.changeTab.emit({'show1':true,'show2':false,'show3':false,'show4':false});
    }else if(page == 'training'){
      this.changeTab.emit({'show1':false,'show2':true,'show3':false,'show4':false});
    }else if(page == 'composing'){
      this.changeTab.emit({'show1':false,'show2':false,'show3':true,'show4':false});
    }else{
      this.changeTab.emit({'show1':false,'show2':false,'show3':false,'show4':true});
    }
  }
  setModelId(e){
    this.model_invalidate_msg = "";
    this.model_validate_msg = "";
    this.modelid = e.target.value;
    let version = this.models.filter(v => v.modelInfo?.modelId == this.modelid) || this.models.filter(v => v?.modelId == this.modelid);
 
    this.ocr_version = version[0].apiVersion;
    let isComposed = version[0].modelInfo.attributes.isComposed;
    this.modelname = version[0].modelInfo.modelName;    
    if(!isComposed){
      this.defaultmodel = e.target.value;
    }
    this.current_result = this.models.filter(v => v.modelInfo.modelId == this.modelid)[0];
  }
  async setup(){
    if(!this.modelData){
      this.modelData = JSON.parse(sessionStorage.getItem("modelData"));
      this.frConfigData = JSON.parse(sessionStorage.getItem("configData")); 
    }
    let result_id = null,modeltype = null;
    if(this.modelData.idVendorAccount){
      modeltype = 'vendor';
      result_id = this.modelData.idVendorAccount;
    }else{
      modeltype = 'sp';
      result_id = this.modelData.serviceproviderID;
    }
    this.sharedService.getModelsByVendor(modeltype,result_id).subscribe((data:any) =>{
      this.resp = data;
      if(this.resp['message'] == 'success'){
        this.previoustraining = this.resp['result']
        if(this.previoustraining.length > 0){
          for(let p of this.previoustraining){
            let jsonobj = JSON.parse(p.training_result);
            if(jsonobj.docTypes){
              jsonobj.modelInfo = {"modelId":jsonobj.modelId,"modelName":jsonobj.modelId, "attributes":{"isComposed":false}}
              if(Object.keys(jsonobj.docTypes).length > 1){
                jsonobj.modelInfo["attributes"]["isComposed"] = true;
              }
            }
            jsonobj.model_version = p.model_version;
            this.models.push(jsonobj);
          }
          let index = this.models.findIndex(v => v.modelInfo.modelName == this.modelData.modelName);
          this.modelid = JSON.parse(this.previoustraining[index].training_result).modelInfo.modelId;
          this.defaultmodel = this.modelid;
          this.modelname = JSON.parse(this.previoustraining[index].training_result).modelInfo.modelName;
          this.current_result = JSON.parse(this.previoustraining[index].training_result);
          this.nottrained = false;
        }else{
          this.nottrained = true;
        }
      }
    })
  }
  
  zoomOuttest(){
    this.zoomVal = this.zoomVal - 0.2;
    if(this.zoomVal <= 0.5){
      this.zoomVal = 1;
    }
    (<HTMLDivElement>document.getElementById("pcanvas"+this.currentindex)).style.transform = 'scale('+this.zoomVal+')';
  }
  getFiles(e){
    let parent:any = (<HTMLDivElement>document.getElementById("pcanvas1"));
    if(parent){
      while (!parent.lastChild.id.startsWith('canvas')) {
        parent.removeChild(parent.lastChild);
      }
    }
    this.file = e.target.files[0];
    (<HTMLDivElement>document.getElementById("sticky")).classList.remove("sticky-top")
    this.file_url = URL.createObjectURL(this.file);
    if(this.file.type == 'application/pdf'){
      this.loadPDFtest(this.file_url);
    }else if(this.file.type == 'text/html'){
      this.loadHTML(this.file);  
    }else{
      this.loadImagetest(this.file_url);
    }
  }
  loadHTML(file:File) {
    this.ready = true;
    const formData: FormData = new FormData();
    formData.append('file', this.file);
    this.sharedService.testHtml(formData).subscribe(data => {
      if(data.content){
        this.htmlstring = data.content;
        this.cleanedhtmlstring = data["cleaned_content"]
        this.sanitizedHtml = this.domsanitize(this.htmlstring);
        (<HTMLDivElement>document.getElementById("htmlcontainer")).innerHTML = this.sanitizedHtml.toString();
      }
    })
  }
  
  zoomIntest(){
    this.zoomVal = this.zoomVal + 0.2;
    if(this.zoomVal >= 3.0){
      this.zoomVal = 1;
    }
    (<HTMLDivElement>document.getElementById("pcanvas"+this.currentindex)).style.transform = 'scale('+this.zoomVal+')';
  }
  countertest(i:number){
    return new Array(i);
  }
  previoustest(){
    this.currentindex = this.currentindex - 1
    if(this.currentindex < 1){
      this.currentindex = this.maxpage;
    }
    let obj = this.readResults.filter(v => v.page == this.currentindex);
    this.currentwidth = obj[0]['width'];
    this.currentheight = obj[0]['height'];
    this.currentpage = "Page-"+this.currentindex;
    let element = (<HTMLDivElement>document.getElementById(this.currentpage+'container'));
    element.scrollIntoView(); 
  }
  async runAnalyses(){
    const ocr_engine_version =  this.ocr_version || 'v2.1';
    if(this.file_url != ""){
      const formData: FormData = new FormData();
      formData.append('file', this.file);
      this.testing = true;
      this.analyzed = false;
      let testobj = {
        "formData":formData,
        "modelName":this.modelname,
        "modelid":this.modelid,
        "fr_endpoint":"",
        "fr_key":""
      }
      this.sharedService.testModel(testobj, this.ocr_version).subscribe((data:any) => {
        this.resp = data;
        this.testing = false;
        this.analyzed = true;
        if(this.resp['message'] == 'success'){
          //this.model_validate();
          this.jsonresult = this.resp['json_result'];
          let obj;
          if(ocr_engine_version == "v2.1"){
            this.readResults = this.jsonresult['analyzeResult']['readResults']
            obj = this.readResults.filter(v => v.page == 1);
            this.fields = this.jsonresult.analyzeResult.documentResults[0].fields
          }else{
            this.readResults = this.jsonresult['analyzeResult']['pages']
            obj = this.readResults.filter(v => v.pageNumber == 1);
            this.fields = this.jsonresult.analyzeResult.documents[0].fields
          }
          this.currentwidth = obj[0]['width'];
          this.currentheight = obj[0]['height'];
          if(this.resp['content_type'] != "application/pdf"){
            this.file_url = this.resp['url'];
            this.setcanvastest();
          }
          setTimeout(async () => {
            for(let i=0;i<Object.keys(this.fields).length;i++){
              this.randomHsltest(i);
              (<HTMLLinkElement>document.getElementById("field"+i)).style.borderWidth = "3px";
              (<HTMLLinkElement>document.getElementById("field"+i)).style.borderStyle = "solid";
              (<HTMLLinkElement>document.getElementById("field"+i)).style.borderColor = this.colors[i];
            }
            for await(let obj of this.readResults){
              await this.drawCanvastest(obj);
            }    
          }, 200);
        }
      })
      
    }
  }
  MandatoryHeaderCheck(val){
    if(val){
      this.mandatoryboolean = true;
      this.mandatory_field_check=1;
      this.switchLabel = "Yes";
    }else{
      this.mandatoryboolean = false;
      this.mandatory_field_check=0;
      this.switchLabel = "No";
    }
  }
  model_validate() {
    this.modelStatus = this.modelData;
    this.validating = true;
    this.status4Boolean = false;
    this.model_validate_msg = "Validating Model ..."
    this.uploadingFileBoolean = true;
    let validateModel = {
      "folderPath": this.modelStatus.folderPath,
      "model_path": JSON.stringify(this.current_result),
      "model_id": Number(this.modelStatus.idDocumentModel),
      "fr_modelid":this.defaultmodel,
      "req_fields_accuracy": 0,
      "req_model_accuracy": 10.0,
      "mandatory_field_check": this.mandatory_field_check,
      "mand_fld_list": "PurchaseOrder,InvoiceDate,InvoiceId",
      "cnx_str": this.frConfigData[0].ConnectionString,
      "cont_name": this.frConfigData[0].ContainerName,
      "VendorAccount": this.modelStatus.idVendorAccount,
      "ServiceAccount": this.modelData.serviceproviderID
    }
    
    // if(this.modelStatus.modelStatus > 4){
    //   validateModel.model_path = this.modelStatus.folderPath
    // } else {
    //   validateModel.model_path = this.filePath
    // }

    this.sharedService.modelValidate(validateModel).pipe(take(1), finalize(() => {
      this.uploadingFileBoolean = false;
    })).subscribe((data: any) => {
      this.validating = false;
      if(data.model_id == ""){
        this.modelUpdate(3);
        this.invalidModelBoolean = true;
      } else {

        if(data.model_validate_status == 1){
          this.modelUpdate(4);
          this.modelStatus.modelID = data.model_id;
          this.jsonFinalData = data;
          this.model_validate_msg = data.model_validate_msg;
          //this.getJson(this.defaultmodel,data.model_validate_msg);
          this.status4Boolean = true;
          this.invalidModelBoolean = false;
          this.messageService.add({
            severity: "success",
            summary: "Uploaded",
            detail: "Model Uploaded Sucessfully"
          });
        } else {
          this.invalidModelBoolean = true;
          this.model_invalidate_msg = data.model_validate_msg;
          this.sharedService.errorObject.detail = 'please retry again.'
          this.messageService.add(this.sharedService.errorObject);
        }

      }


    }, error=> {
      this.sharedService.errorObject.detail = error.statusText
      this.messageService.add(this.sharedService.errorObject);
    })
  }
  getJson(data,msg) {
    this.sharedService.getFinalData(data).subscribe((data: any) => {
      this.jsonFinalData = data;
    })
  }
  uploadToSerina(){
    let _this = this;
    try{
      this.jsonFinalData.final_data.ModelID = this.modelid;
      this.jsonFinalData.final_data['TestResult'] = this.jsonresult.analyzeResult ? this.jsonresult.analyzeResult : {};
      this.jsonFinalData.final_data['VendorAccount'] = this.modelStatus.idVendorAccount;
      this.jsonFinalData.final_data['ServiceAccount'] = this.modelStatus.serviceproviderID;
      this.saving = true;
      this.sharedService.uploadDb(this.jsonFinalData.final_data,this.modelStatus.idDocumentModel).subscribe(data=>{
        this.messageService.add({
          severity: "success",
          summary: "Uploaded",
          detail: "Model Uploaded Sucessfully"
        });
        this.model_validate_msg = "Template Onboarded!"
        if(this.modelStatus.idVendorAccount){
          this.sharedService.checkSameVendors(this.modelStatus.idVendorAccount,this.modelData.modelName).subscribe(dt => {
            this.saving = false;
            if(dt['message'] == 'exists'){
              (<HTMLButtonElement>document.getElementById("openmodel")).click();
              this.valuename = "Vendor";
              this.valueent = "Entities";
              this.vendor = dt['vendor'];
              this.vendorcount = dt['count'];        
            }else{
              if(_this.modelData.docType.includes("Invoice")){
                _this.router.navigate(['IT_Utility/vendors'])
              }else{
                _this.router.navigate(['IT_Utility/customers'])
              }
              
            }
          })
        }
        if(this.modelStatus.serviceproviderID){
          this.sharedService.checkSameSP(this.modelStatus.serviceproviderID,this.modelData.modelName).subscribe(dt => {
            this.saving = false;
            if(dt['message'] == 'exists'){
              (<HTMLButtonElement>document.getElementById("openmodel")).click();
              this.valuename = "Service Provider";
              this.valueent = "Accounts";
              this.vendor = dt['sp'];
              this.vendorcount = dt['count'];        
            }else{
              _this.router.navigate(['IT_Utility/service-providers'])
            }
          })
        }
        
        this.status4Boolean = true;
        this.modelUpdate(5);
        
      },error=>{
        this.sharedService.errorObject.detail = error.statusText
        this.messageService.add(this.sharedService.errorObject);
        setTimeout(() => {
          _this.router.navigate(['IT_Utility/home'])
        }, 1000);
      })
    }catch(ex){
      setTimeout(() => {
        _this.router.navigate(['IT_Utility/home'])
      }, 1000);
    }
  }
  noanswer(){
    this.router.navigate(['IT_Utility/home']);
  }
  yesanswer(){
    this.uploadbuttonmsg = "Copying Models";
    this.saving = true;
    if(this.modelStatus.idVendorAccount){
      this.sharedService.copymodels(this.modelStatus.idVendorAccount,this.modelData.modelName).subscribe(dt=>{
        this.saving = false;
        if(this.modelData.docType.includes("Invoice"))
        this.router.navigate(['IT_Utility/vendors']);
        else
        this.router.navigate(['IT_Utility/customers'])
      })
    }else{
      this.sharedService.copymodelsSP(this.modelStatus.serviceproviderID,this.modelData.modelName).subscribe(dt=>{
        this.saving = false;
        this.router.navigate(['IT_Utility/service-providers']);
      })
    }
    
  }
  modelUpdate(id_status) {
    this.modelStatus = this.modelData;
    let updatedData = {
      "modelName": this.modelStatus.modelName,
      "idVendorAccount": this.modelStatus.idVendorAccount,
      "idServiceAccount": this.modelStatus.serviceproviderID,
      "folderPath": this.modelStatus.folderPath,
      "modelStatus": id_status
    }
    // if(this.modelStatus.modelStatus != 1){
    //   console.log("hi 1")
    //   updatedData.folderPath = this.modelStatus.folderPath;
    // } else {
    //   console.log("hi else")
    //   updatedData.folderPath = this.pathFolder;
    // }
    this.sharedService.updateModel(updatedData, this.modelStatus.idDocumentModel).subscribe((data: any) => {
    },error=>{
      this.sharedService.errorObject.detail = error.statusText
      this.messageService.add(this.sharedService.errorObject);
    })
  }
  downloadModel(){
    const str = JSON.stringify(this.current_result);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
        type: "application/json;charset=utf-8"
    });
    let filename = `model-${this.modelid}.json`;
    saveAs(blob,filename);
  }
  viewTable(f){
    const ocr_engine_version =  this.ocr_version;
    this.rows = [];
    this.currenttable = f;
    this.currentheaders = Object.keys(this.fields[f].valueArray[0].valueObject);
    for(let r=0;r<this.fields[f].valueArray.length;r++){
      let temparr:any[] = [];
      for(let h of this.currentheaders){
        if(ocr_engine_version == "v2.1")
        temparr.push(this.fields[f].valueArray[r].valueObject[h].text);
        else
        temparr.push(this.fields[f].valueArray[r].valueObject[h].content);
      }
      this.rows.push(temparr);
    }
  }
  randomHsltest(i:number) {
    let color = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
    if(this.colors.includes(color)){
      this.randomHsltest(i);
    }else{
      this.colors[i] = color;
    }
    return color; 
  }
  async loadImagetest(imageurl:string){
    let _this = this;
    this.currentpage = "Page 1";
    this.currentindex = 1;
    this.maxpage = 1;
    this.ready = true;
    setTimeout(() => {
      document.addEventListener('mousemove', function(event) {
        _this.target = event.target;
      }, false);
      (<HTMLDivElement>document.getElementById("sticky")).classList.add("sticky-top")
      const ZOOM_SPEED = 0.1;
      let canvas = (<HTMLCanvasElement>document.getElementById('canvas1'));
      (<HTMLDivElement>document.getElementById("pcanvas1")).style.transform = 'translate3d(-18px, -280px, 0px) scale('+this.zoomVal+')';
      document.addEventListener('wheel',function(e){
        if(_this.zoomVal <= 0.5 || _this.zoomVal >=3.0){
          _this.zoomVal = 1;
        }
        if(_this.target.id == 'canvas1'){
          let scaletransform = (<HTMLDivElement>document.getElementById("pcanvas1")).style.transform;
          let res = scaletransform.split("scale")[0];
          if(e.deltaY < 0){    
            res = res + `scale(${_this.zoomVal += ZOOM_SPEED})`;
            (<HTMLDivElement>document.getElementById("pcanvas1")).style.transform = res;  
          }else{    
            res = res + `scale(${_this.zoomVal -= ZOOM_SPEED})`;
            (<HTMLDivElement>document.getElementById("pcanvas1")).style.transform = res;  }  
          }
      })
      let context = (<CanvasRenderingContext2D>canvas.getContext('2d'));
      let img = new Image;
      img.onload = function(){
        if(img.width > 900){
          canvas.width = 900
          canvas.height = canvas.width * (img.height / img.width);
          let oc = (<HTMLCanvasElement>document.getElementById('canvas1')),
          octx = (<CanvasRenderingContext2D>oc.getContext('2d'));
          oc.width = img.width * 0.4;
          oc.height = img.height * 0.4;
          octx.drawImage(img, 0, 0, oc.width, oc.height);
          octx.drawImage(oc, 0, 0, oc.width * 0.4, oc.height * 0.4);
          context.drawImage(oc, 0, 0, oc.width * 0.4, oc.height * 0.4, 0, 0, canvas.width, canvas.height);
        }else{
          canvas.width = 900;
          canvas.height = img.height;
          context.drawImage(img,0,0);
        }
      };
      img.src = imageurl;
       
    }, 300);
  }
  setcanvastest(){
    let _this = this;
    let canvas = (<HTMLCanvasElement>document.getElementById('canvas1'));
    let context = (<CanvasRenderingContext2D>canvas.getContext('2d'));
    let img = new Image;
    img.onload = function(){
      if(img.width != 900){
        canvas.width = 900;
        canvas.height = _this.currentheight;
        context.drawImage(img,0,0);
      }else{
        canvas.width = _this.currentwidth;
        canvas.height = _this.currentheight;
        context.drawImage(img,0,0);
      }
    };
    img.src = this.file_url;
  }
  async loadPDFtest(pdfurl:string) {
    let _this = this;
    const loadingTask = await pdfjsLib.getDocument( pdfurl );
    let pdf = await loadingTask.promise;
    this.currentpage = "Page 1";
    this.currentindex = 1;
    this.maxpage = pdf.numPages;
    this.ready = true;
    document.addEventListener('mousemove', function(event) {
      _this.target = event.target;
    }, false);
    (<HTMLDivElement>document.getElementById("sticky")).classList.add("sticky-top")
    setTimeout(async () => {
      for(let i=1;i<=_this.maxpage;i++){
        let page = await pdf.getPage(i)   
        let scale = 1.5;     
        let viewport = page.getViewport({scale:scale});
        const ZOOM_SPEED = 0.1;
        let canvas: any = document.getElementById('canvas'+i);
        (<HTMLDivElement>document.getElementById("pcanvas"+i)).style.transform = 'translate3d(-18px, -280px, 0px) scale('+this.zoomVal+')';
        document.addEventListener('wheel',function(e){
          if(_this.zoomVal <= 0.5 || _this.zoomVal >=3.0){
            _this.zoomVal = 1;
          }
          if(_this.target.id == 'canvas'+i){
            let scaletransform = (<HTMLDivElement>document.getElementById("pcanvas"+i)).style.transform;
            let res = scaletransform.split("scale")[0];
            if(e.deltaY < 0){    
              res = res + `scale(${_this.zoomVal += ZOOM_SPEED})`;
              (<HTMLDivElement>document.getElementById("pcanvas"+i)).style.transform = res;  
            }else{    
              res = res + `scale(${_this.zoomVal -= ZOOM_SPEED})`;
              (<HTMLDivElement>document.getElementById("pcanvas"+i)).style.transform = res;  }  
            }
        })
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        let renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext);
      }    
    }, 300);
  }
  drawCanvastest(obj){
    try{
      let pagenum = obj['page'] || obj['pageNumber'];
      for(let k=0;k<Object.keys(this.fields).length;k++){
        if(this.fields[Object.keys(this.fields)[k]].type == 'string'){
          if(pagenum == this.fields[Object.keys(this.fields)[k]].page){
            let comparebox = this.fields[Object.keys(this.fields)[k]].boundingBox || this.fields[Object.keys(this.fields)[k]].boundingRegions.polygon;
            if(this.file.type == 'application/pdf'){
              comparebox = this.convertInchToPixeltest(comparebox);
            }else{
              comparebox = this.convertImagePixeltoPixeltest(comparebox);
            }
            let div = (<HTMLDivElement>document.createElement('div'));
            div.style.position = 'absolute';
            div.style.borderWidth = '2px';
            div.style.borderColor = this.colors[k];
            div.style.borderStyle = 'solid';
            div.style.top = comparebox[1]+'px'
            div.style.left = comparebox[0]+'px';
            div.style.width = comparebox[4]+'px';
            div.style.height = comparebox[5]+'px';       
            (<HTMLDivElement>document.getElementById("pcanvas"+pagenum)).appendChild(div)
          }
        }else{
          for(let v=0;v<this.fields[Object.keys(this.fields)[k]].valueArray.length;v++){
            for(let key of Object.keys(this.fields[Object.keys(this.fields)[k]].valueArray[v].valueObject)){
              if(pagenum == this.fields[Object.keys(this.fields)[k]].valueArray[v].valueObject[key].page || this.fields[Object.keys(this.fields)[k]].valueArray[v].valueObject[key].pageNumber){
                let comparebox = this.fields[Object.keys(this.fields)[k]].valueArray[v].valueObject[key].boundingBox || this.fields[Object.keys(this.fields)[k]].valueArray[v].valueObject[key].boundingRegions.polygon;
                if(this.file.type == 'application/pdf'){
                  comparebox = this.convertInchToPixeltest(comparebox);
                }else{
                  comparebox = this.convertImagePixeltoPixeltest(comparebox);
                }
                let div = (<HTMLDivElement>document.createElement('div'));
                div.style.position = 'absolute';
                div.style.borderWidth = '2px';
                div.style.borderColor = this.colors[k];
                div.style.borderStyle = 'solid';
                div.style.top = comparebox[1]+'px'
                div.style.left = comparebox[0]+'px';
                div.style.width = comparebox[4]+'px';
                div.style.height = comparebox[5]+'px';       
                (<HTMLDivElement>document.getElementById("pcanvas"+pagenum)).appendChild(div)
              }
            }
          }
        }
      }
    }catch(ex){
      console.log(ex);
    }
  }
  nexttest(){
    this.currentindex = this.currentindex + 1;
    if(this.currentindex > this.maxpage){
      this.currentindex = 1;
    }
    let obj = this.readResults.filter(v => v.page == this.currentindex);
    this.currentwidth = obj[0]['width'];
    this.currentheight = obj[0]['height'];
    this.currentpage = "Page-"+this.currentindex;
    let element = (<HTMLDivElement>document.getElementById(this.currentpage+'container'));
    element.scrollIntoView();
  }
  ObjectKeystest(obj){
    return Object.keys(obj);
  }
  DragRemovedtest(event:CdkDragEnd){
  }
  DragMovingtest(event:CdkDragMove){
    let scaletransform = (<HTMLDivElement>document.getElementById("pcanvas"+this.currentindex)).style.transform;
    let res = scaletransform.split("scale")[0];
    res = res + 'scale('+this.zoomVal+')';
    (<HTMLDivElement>document.getElementById("pcanvas"+this.currentindex)).style.transform = res;  
  }
  convertInchToPixeltest(arr:any){
    let x1 = arr[0]*72;
    let y1 = arr[1]*72;
    let x2 = arr[2]*72;
    let y2 = arr[3]*72;
    let x3 = arr[4]*72 - arr[0]*72;
    let y3 = arr[5]*72 - arr[1]*72;
    let x4 = arr[6]*72;
    let y4 = arr[7]*72;
    return [x1*1.5,y1*1.5,x2,y2,x3*1.5,y3*1.5,x4,y4]
  }
  convertImagePixeltoPixeltest(arr:any){
    let x1 = arr[0];
    let y1 = arr[1];
    let x2 = arr[2];
    let y2 = arr[3];
    let x3 = arr[4] - arr[0];
    let y3 = arr[5] - arr[1];
    let x4 = arr[6];
    let y4 = arr[7];
    return [x1,y1,x2,y2,x3,y3,x4,y4]
  }

}
