import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-trainingtool',
  templateUrl: './trainingtool.component.html',
  styleUrls: ['./trainingtool.component.css']
})
export class TrainingtoolComponent implements OnInit,AfterViewInit {
  frp_id:any;
  resp:any;
  apiversion: string = "v2.1";
  training:boolean=false;
  textmodel: string = "Model Name"
  nottrained:boolean = true;
  checkmodel:boolean = false;
  previoustraining:any;
  previoustrainingres:any;
  fields:any[]=[];
  trainingresult:any;
  p_name:any;
  successmsg:string = "";
  exemsg:string= "";
  errors:any[]= [];
  nameinvalid:any;
  pid:any;
  @Input() modelData:any;
  @Input() frConfigData:any;
  @Input() showtab:any;
  @Output() changeTab = new EventEmitter<{'show1':boolean,'show2':boolean,'show3':boolean,'show4':boolean}>();
  ocr_version: any;
  
  constructor(private sharedService:SharedService) {
    this.nameinvalid = {
      haserror:false,
      patternerror:false,
      novalue: false
    }
   }

  ngOnInit(): void {
    this.ocr_version = this.modelData?.model_version || 'v2.1';
    try {
      this.setup();   
    }catch(ex){
      console.log(ex)
    }
  }
  ngAfterViewInit(): void {
    sessionStorage.setItem("modelData",JSON.stringify(this.modelData));
    sessionStorage.setItem("frConfigData",JSON.stringify(this.frConfigData));
    const ocr_engine_version =  this.ocr_version;
    this.apiversion = ocr_engine_version;
    if(this.apiversion != "v2.1"){
      this.textmodel = "Enter Model Identifier"
    }
  }
  RoundOff(i:number){
    return i.toFixed(2);
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
  async setup(){
    const ocr_engine_version =  this.ocr_version;
    if(!this.modelData){
      this.modelData = JSON.parse(sessionStorage.getItem("modelData"));
      this.frConfigData = JSON.parse(sessionStorage.getItem("frConfigData")); 
    }
    this.sharedService.getTrainingResult(this.modelData.idDocumentModel).subscribe((data:any) => {
      this.resp = data;
      if(this.resp['message'] == 'success'){
        this.previoustraining = this.resp['result']
        if(this.previoustraining.length > 0){
          if(this.previoustraining[0].length == 0){
            return;
          }
          this.previoustrainingres = JSON.parse(this.previoustraining[this.previoustraining.length - 1]);
          if(ocr_engine_version == "v2.1"){
            if(this.previoustrainingres?.modelInfo.status == "creating"){
              this.successmsg = "Model training is still in progress. Please wait for 2-3 minutes and click on Check Status Button"
              this.nottrained = false;
              return;
            }
            if(this.previoustrainingres?.modelInfo?.attributes?.isComposed){
              this.fields = this.previoustrainingres.composedTrainResults[0].fields;
            }else{
              this.fields = this.previoustrainingres.trainResult.fields;
            }
          }else{
            if(!this.previoustrainingres.docTypes){
              if(this.previoustrainingres.status != "succeeded"){
                this.successmsg = "Model training is still in progress. Please wait for 2-3 minutes and click on Check Status Button"
                this.nottrained = false;
                this.previoustrainingres = this.previoustrainingres.result;
                return;
              }else{
                this.checkmodel = false;
                this.previoustrainingres = this.previoustrainingres.result;
              }
            }
            let arr = [];
            let count = 0, total = 0;
            for(let f of Object.keys(this.previoustrainingres.docTypes[this.previoustrainingres.modelId].fieldConfidence)){
              arr.push({"fieldName":f,"accuracy":this.previoustrainingres.docTypes[this.previoustrainingres.modelId].fieldConfidence[f]});
              total += this.previoustrainingres.docTypes[this.previoustrainingres.modelId].fieldConfidence[f];
              count++;
            }
            let average = total/count;
            this.previoustrainingres.modelInfo = {"status":"succeeded","modelId":this.previoustrainingres.modelId,"modelName":this.previoustrainingres.modelId,"attributes":{"isComposed":false}}
            this.previoustrainingres.trainResult = {"averageModelAccuracy":average};
            this.fields = arr;
            let resultobj = {'fr_result':JSON.stringify(this.previoustrainingres),'docid':this.modelData.idDocumentModel,'modelName':this.previoustrainingres.modelId}
            this.sharedService.updateTrainingResult(resultobj).subscribe((data:any) => {
            })
          }
          this.nottrained = false;
        }else{
          this.nottrained = true;
        }
      }
    })
  }
  checkvalid(e:any){
    let modelName = (<HTMLInputElement>document.getElementById("modelname")).value;
    const regex = /^[a-zA-Z0-9_]+$/;
    const hasNumber = /\d/;
    const minLength = 5;
    const maxLength = 20;
    const isValidFormat = regex.test(modelName);
    const containsNumber = hasNumber.test(modelName);
    const isValidLength = modelName.length > minLength && modelName.length <= maxLength;
    this.nameinvalid.haserror = false;
    if(modelName == ""){
      this.nameinvalid.haserror= true;
      this.nameinvalid.novalue = true;
      this.nameinvalid.patternerror = false;
      return;
    }
    if(!isValidFormat || !containsNumber || !isValidLength){
      this.nameinvalid.haserror = true;
      this.nameinvalid.patternerror = true;
      this.nameinvalid.novalue = false;
      return;
    }
    
  }
  checkModelStatus(){
    this.checkmodel = true;
    const ocr_engine_version =  this.ocr_version;
    if(ocr_engine_version == "v2.1"){
      this.sharedService.checkModelStatus(this.previoustrainingres['modelInfo']['modelId'], this.ocr_version).subscribe(data=>{
        this.checkmodel = false;
        if(data["modelInfo"]["status"] == "ready"){
          let resultobj = {'fr_result':JSON.stringify(data),'docid':this.modelData.idDocumentModel,'modelName':this.previoustrainingres['modelInfo']['modelId']}
            this.sharedService.updateTrainingResult(resultobj).subscribe((data:any) => {
              this.resp = data;
              if(this.resp['message'] == 'success'){
                this.setup();
                this.successmsg = "Model training successful";
              }
            })
        }
      });
    }else{
      this.trainModel();
    }
  }
  async trainModel(){
    const ocr_engine_version =  this.ocr_version;
    let modelName = (<HTMLInputElement>document.getElementById("modelname")).value;
    this.training = true;
    let frobj = {
      'connstr':this.frConfigData[0].ConnectionString,
      'folderpath':this.modelData.folderPath,
      'container':this.frConfigData[0].ContainerName,
      'account':this.frConfigData[0].ConnectionString.split("AccountName=")[1].split(";AccountKey")[0],
      'modelName':modelName
    }
    try{
      this.sharedService.trainModel(frobj, this.ocr_version).subscribe((data:any) => {
        this.successmsg = "";
        this.resp = data;
        console.log(this.resp);
        this.training = false;

        if(this.resp["message"] == "failure"){
          if(ocr_engine_version == "v2.1"){
            if(this.resp["result"]["modelInfo"]["status"] == "creating"){
              this.previoustrainingres = {"modelInfo":{"status":this.resp["result"]["modelInfo"]["status"],"modelId":this.resp["result"]["modelInfo"]["modelId"],"modelName":this.resp["result"]["modelInfo"]["modelName"]}}
              this.successmsg = "Model training is still in progress. Please wait for 2-3 minutes and click on Check Status Button"
              this.nottrained = false;
              let resultobj = {'fr_result':JSON.stringify(this.resp["result"]),'docid':this.modelData.idDocumentModel,'modelName':this.resp["result"]["modelInfo"]["modelName"]}
              this.sharedService.updateTrainingResult(resultobj).subscribe((data:any) => {
              this.resp = data;
              if(this.resp['message'] == 'success'){
                this.setup();
              }
            })
              return;
            }else{
              this.nottrained = true;
            }
            this.errors = this.resp["result"]["training"]
            this.successmsg = "Model training failed";
            this.errors = this.resp['result']['trainResult']['errors'];
          }else{
            if(this.resp["result"]["status"] && this.resp["result"]["status"] == "running"){
              this.successmsg = "Model training is still in progress. Please wait for 2-3 minutes and click on Check Status Button";
              this.errors = [];
              this.exemsg = "";
            }else if(this.resp["result"]["error"] && this.resp["result"]["error"]["message"]){
              this.previoustrainingres = {"modelInfo":{"status":"failed","modelId":modelName,"modelName":modelName,"attributes":{"isComposed":false}}}
              this.exemsg = `Model training Failed due to : ${this.resp["result"]["error"]["message"]}`
              this.successmsg = "Our Technical Team is checking on these issues! We will revert back to you soon. Thank you for your Patience!"
              this.errors = this.resp["result"]["error"]["details"]
            }else{
              this.exemsg = "";
              this.successmsg = "";
              this.errors = [];
            }
          }
          
        }
        if(this.resp["message"] == "exception"){
          if(this.resp["post_resp"] && this.resp["post_resp"] == "Model Training Failed"){
            this.checkmodel = false;
            this.successmsg = "Model training is still in progress. Please wait for 2-3 minutes and click on Check Status Button";
            this.errors = [];
            this.exemsg = "";
          }else{
            this.exemsg = "";
            this.successmsg = "";
            this.errors = [];
          }
        }
        if('error' in this.resp){
          console.log(this.resp)
        }
        if('errorlist' in this.resp){
          console.log(this.resp);
        }
        if(this.resp['message'] == 'success'){
          this.trainingresult = this.resp['result'];
          let modelName;
          if(ocr_engine_version == "v2.1"){
            this.errors = this.resp['result']['trainResult']['errors'];
            modelName = this.trainingresult?.modelInfo["modelName"]
          }else{
            this.errors = [];
            if(this.resp['result'].result){
              modelName = this.trainingresult['result']["modelId"]
            }else{
              modelName = this.trainingresult["modelId"]
            }
          }
          this.modelData.modelName = modelName;
          sessionStorage.setItem("modelData",JSON.stringify(this.modelData));
          let resultobj = {'fr_result':JSON.stringify(this.trainingresult),'docid':this.modelData.idDocumentModel,'modelName':modelName}
          this.sharedService.updateTrainingResult(resultobj).subscribe((data:any) => {
            this.resp = data;
            if(this.resp['message'] == 'success'){
              this.setup();
              this.successmsg = "Model training successful";
            }
          })
        }
        })
    }catch(ex){
      this.exemsg = "Exception during Training. Please try after sometime!"
    }
    
    }
}
