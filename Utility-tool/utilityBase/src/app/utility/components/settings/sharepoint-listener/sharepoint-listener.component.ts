import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-sharepoint-listener',
  templateUrl: './sharepoint-listener.component.html',
  styleUrls: ['./sharepoint-listener.component.scss']
})
export class SharepointListenerComponent implements OnInit {
  configData:FormGroup;
  sharepointData: any;
  editable:boolean;
  docTypes:any[]=[];
  selecteddoctype: string = "Invoice";
  constructor(private fb:FormBuilder,
    private sharedService:SharedService,
    private messageService: MessageService) {
    this.configData = this.fb.group({
      doctype: [''],
      client_id : ['',Validators.required],
      client_secret  : ['',Validators.required],
      site_url  : ['',Validators.required],
      folder  : ['']
    })
   }

  ngOnInit(): void {
    this.docTypes = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.documentTypes;
    this.readConfigData(this.docTypes[0]);
    this.selecteddoctype = this.docTypes[0];
    this.configData.disable();
  }
  changeDocType(e:any){
    this.readConfigData(e.target.value);
    this.selecteddoctype = e.target.value;
   }
  editBtnCilck(){
    this.configData.enable();
    this.editable = true;
  }

  onCancel(){
    this.editable = false;
    this.configData.disable();
  }
  saveConfigData(){
    console.log(this.configData.value)
    this.sharedService.saveSharePointConfig(JSON.stringify(this.configData.value)).subscribe(data=>{
      console.log(data);
      if(data.message == "success"){
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: data.details
        });
        this.editable = false;
        this.configData.disable();
      } else {
        this.messageService.add({
          severity: "error",
          summary: "error",
          detail: 'Some Error occured!'
        });
      }
      
    },error =>{
      this.messageService.add({
        severity: "error",
        summary: "error",
        detail: error.statusText
      });
    })
  }

  readConfigData(doctype){
    this.sharedService.getSharepointconfig(doctype).subscribe((data:any)=>{
      this.sharepointData = data.config
      this.configData.patchValue({
        client_id : this.sharepointData.client_id,
        client_secret : this.sharepointData.client_secret,
        site_url : this.sharepointData.site_url,
        folder : this.sharepointData.folder,
        service_url : this.sharepointData.service_url,
      })
    })
  }

}
