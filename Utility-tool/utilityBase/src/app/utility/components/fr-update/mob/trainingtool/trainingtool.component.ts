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
  apiversion: string = "Azure Form Recognizer 2.1";
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
  pid:any;
  @Input() modelData:any;
  @Input() frConfigData:any;
  @Input() showtab:any;
  @Output() changeTab = new EventEmitter<{'show1':boolean,'show2':boolean,'show3':boolean,'show4':boolean}>();
  
  constructor(private sharedService:SharedService) { }

  ngOnInit(): void {
    try {
      this.setup();   
    }catch(ex){
      console.log(ex)
    }
  }
  ngAfterViewInit(): void {
    sessionStorage.setItem("modelData",JSON.stringify(this.modelData));
    sessionStorage.setItem("frConfigData",JSON.stringify(this.frConfigData));
    const ocr_engine_version = JSON.parse(sessionStorage.getItem('instanceConfig')).InstanceModel.ocr_engine;
    this.apiversion = ocr_engine_version;
    if(this.apiversion != "Azure Form Recognizer 2.1"){
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
    const ocr_engine_version = JSON.parse(sessionStorage.getItem('instanceConfig')).InstanceModel.ocr_engine
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
          if(ocr_engine_version == "Azure Form Recognizer 2.1"){
            if(this.previoustrainingres.modelInfo.status == "creating"){
              this.successmsg = "Model training is in progress. To refresh status, please click on Check Status Button."
              this.nottrained = false;
              return;
            }
            if(this.previoustrainingres.modelInfo.attributes.isComposed){
              this.fields = this.previoustrainingres.composedTrainResults[0].fields;
            }else{
              this.fields = this.previoustrainingres.trainResult.fields;
            }
          }else{
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
  checkModelStatus(){
    this.checkmodel = true;
    this.sharedService.checkModelStatus(this.previoustrainingres['modelInfo']['modelId']).subscribe(data=>{
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
  }
  async trainModel(){
    const ocr_engine_version = JSON.parse(sessionStorage.getItem('instanceConfig')).InstanceModel.ocr_engine
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
      this.sharedService.trainModel(frobj).subscribe((data:any) => {
        this.successmsg = "";
        this.resp = data;
        console.log(this.resp);
        this.training = false;

        if(this.resp["message"] == "failure"){
          if(this.resp["result"]["modelInfo"]["status"] == "creating"){
            this.previoustrainingres = {"modelInfo":{"status":this.resp["result"]["modelInfo"]["status"],"modelId":this.resp["result"]["modelInfo"]["modelId"],"modelName":this.resp["result"]["modelInfo"]["modelName"]}}
            this.successmsg = "Model training is in progress. To refresh status, please click on Check Status Button."
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
          if(ocr_engine_version == "Azure Form Recognizer 2.1"){
            this.errors = this.resp['result']['trainResult']['errors'];
            modelName = this.trainingresult["modelInfo"]["modelName"]
          }else{
            this.errors = [];
            modelName = this.trainingresult["modelId"]
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
