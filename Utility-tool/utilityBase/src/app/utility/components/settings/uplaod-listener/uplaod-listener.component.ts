import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SharedService } from './../../../../services/shared/shared.service';
@Component({
  selector: 'app-uplaod-listener',
  templateUrl: './uplaod-listener.component.html',
  styleUrls: ['./uplaod-listener.component.scss']
})
export class UplaodListenerComponent implements OnInit {
  configData : FormGroup;
  exception:boolean =false;
  msg:string="";
  err:string="";
  saving:boolean=false;
  constructor(private fb:FormBuilder,private sharedService:SharedService) {
    this.configData = this.fb.group({
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
    this.getmailConfig();
  }
  getmailConfig(){
    this.sharedService.getemailconfig().subscribe(data => {
      if(data['message'] == "success"){
        this.configData.patchValue({'email':data['config'].email,'email_tenant_id':data['config'].email_tenant_id,'email_client_id':data['config'].email_client_id,'email_client_secret':data['config'].email_client_secret,'host':data['config'].host,'folder':data['config'].folder,'loginuser':'','loginpass':'','acceptedDomains':data["config"]['acceptedDomains'],'acceptedEmails':data["config"]['acceptedEmails']})
      }
    })
  }

  saveConfigData() {
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
