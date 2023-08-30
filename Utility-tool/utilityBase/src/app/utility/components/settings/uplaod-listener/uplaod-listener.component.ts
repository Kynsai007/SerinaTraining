import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../../../services/shared/shared.service';
interface MailListeners{
  doctype: string;
  name: string;
  entity: number;
  host: string;
  email: string;
  tenantId: string;
  clientId: string;
  secret:string;
  folder:string;
  domains:any[];
  emails:any[];
}
@Component({
  selector: 'app-uplaod-listener',
  templateUrl: './uplaod-listener.component.html',
  styleUrls: ['./uplaod-listener.component.scss']
})
export class UplaodListenerComponent implements OnInit {
  configData : FormGroup;
  exception:boolean =false;
  msg:string="";
  msg1:string="";
  err:string="";
  saving:boolean=false;
  docTypes: any[] = [];
  selecteddoctype:string="Invoice";
  savingconfig:boolean=false;
  EmailListeners: MailListeners[] = [];
  entityList: any;
  buttonmsg:string = "Publish Listeners"
  constructor(private fb:FormBuilder,private sharedService:SharedService) {
    this.configData = this.fb.group({
      doctype:[''],
      host: [''],
      email:['',[Validators.required,Validators.email]],
      email_tenant_id : ['', Validators.required],
      email_client_id : ['',Validators.required],
      email_client_secret : ['',Validators.required],
      folder : [''],
      acceptedDomains:[''],
      acceptedEmails:[''],
      loginuser: ['',Validators.required],
      loginpass: ['',Validators.required]
    })
   }

  ngOnInit(): void {
    this.docTypes = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.documentTypes;
    this.getmailConfig(this.docTypes[0]);
    this.getEntityList();
    this.getAllMailListeners();
  }
  getEntityList(){
    this.sharedService.getSummaryEntity().subscribe((data:any) => {
      this.entityList = data["result"];
    })
  }
  getmailConfig(doctype){
    this.sharedService.getemailconfig(doctype).subscribe(data => {
      if(data['message'] == "success"){
        this.configData.patchValue({'email':data['config'].email,'email_tenant_id':data['config'].email_tenant_id,'email_client_id':data['config'].email_client_id,'email_client_secret':data['config'].email_client_secret,'host':data['config'].host,'folder':data['config'].folder,'loginuser':'','loginpass':'','acceptedDomains':data["config"]['acceptedDomains'],'acceptedEmails':data["config"]['acceptedEmails']})
      }
    })
  }
  changeDocType(e:any){
    this.getmailConfig(e.target.value);
    this.selecteddoctype = e.target.value;
  }
  getAllMailListeners(){
    this.EmailListeners = [];
    this.sharedService.getAllMailListeners().subscribe(data => {
      if(!data){
        this.buttonmsg = "Save"
      }else if(data.length == 0){
        this.buttonmsg = "Save"
      }else{
        this.EmailListeners = data;
        this.buttonmsg = "Publish Listeners"
      }
      
    })
  }
  addListener(){
    let mailListener: MailListeners = {
      doctype: 'Invoice',
      name:"emaillistener"+(this.EmailListeners.length+1).toString(),
      entity: this.entityList[0]["idEntity"],
      host: "imap-mail.outlook.com",
      email: "",
      tenantId: "",
      clientId: "",
      secret: "",
      folder: "Inbox",
      domains: [],
      emails: [],
    };
    this.EmailListeners.push(mailListener);
    if(this.EmailListeners.length == 0){
      this.buttonmsg = "Save"
    }else{
      this.buttonmsg = "Publish Listeners"
    }
  }
  removeListener(i:number){
    this.EmailListeners.splice(i,1);
    if(this.EmailListeners.length == 0){
      this.buttonmsg = "Save"
    }else{
      this.buttonmsg = "Publish Listeners"
    }
  }
  SelectEntity(i:any,entity:any){
    this.EmailListeners[i].entity = entity;
  }
  SelectDoctype(i:any, doctype:any){
    this.EmailListeners[i].doctype = doctype;
  }
  SelectHost(i:any,host:any){
    this.EmailListeners[i].host = host;
  }
  ChangeInput(i:any,d:any,type:any){
    if(type == 'email'){
      this.EmailListeners[i].email = d;
    }else if(type == 'tenant'){
      this.EmailListeners[i].tenantId = d;
    }else if(type == 'clientId'){
      this.EmailListeners[i].clientId = d;
    }else if(type == 'clientSecret'){
      this.EmailListeners[i].secret = d;
    }else if(type == 'folder'){
      this.EmailListeners[i].folder = d;
    }
  }
  ChangeChip(d:KeyboardEvent,i:any,type:string){
    if(d.keyCode == 13){
      if(type == 'domain'){
        let value = this.EmailListeners[i].domains;
        this.EmailListeners[i].domains = value;
      }else{
        let value = this.EmailListeners[i].emails;
        this.EmailListeners[i].emails = value;
      }
    }
  }
  saveConfigData() {
    this.savingconfig = true;
    this.sharedService.addMailListeners(this.EmailListeners,this.sharedService.userId).subscribe(data =>{
      this.savingconfig = false;
      this.msg1 = data;
    });
  }
  SavePassword(){
    let loginuser = (<HTMLInputElement>document.getElementById("loginuser")).value;
    let loginpass = (<HTMLInputElement>document.getElementById("loginpass")).value;
    this.configData.patchValue({'loginuser':loginuser,'loginpass':loginpass});
    if(this.configData.invalid){
      if(this.configData.controls['email'].errors?.hasOwnProperty("required")){
        this.err = "Please enter Email Id!"
      }
      if(this.configData.controls['email'].errors?.hasOwnProperty("email")){
        this.err = "Invalid Email Id!"
      }
      if(this.configData.controls['email_tenant_id'].errors?.hasOwnProperty("required")){
        this.err = "Please enter tenant id!"
      }
      if(this.configData.controls['email_client_id'].errors?.hasOwnProperty("required")){
        this.err = "Please enter client id!"
      }
      if(this.configData.controls['email_client_secret'].errors?.hasOwnProperty("required")){
        this.err = "Please enter client secret!"
      }
      if(this.configData.controls['loginpass'].errors?.hasOwnProperty("required")){
        this.err = "Please enter valid account credentials!"
      }
      this.exception = true;
      return;
    }else{
      this.exception = false;
      this.err = "";
      this.saving = true;
      this.sharedService.saveemailconfig(this.configData.value).subscribe(data => {
        this.saving = false;
        if(data['message'] == "success"){
          this.msg = "Email Settings Saved!"
        }else{
          this.exception = true;
          this.msg = "";
          this.err = "Some Error occured!"
        }
      });
    }

  }
}
