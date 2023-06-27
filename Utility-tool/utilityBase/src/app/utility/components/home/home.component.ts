import { SharedService } from 'src/app/services/shared/shared.service';
import { AuthenticationService } from 'src/app/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails:any;
  displaypopup:boolean = false;
  isAdmin: boolean;
  showServiceTab:boolean = true;
  showVendorsTab:boolean=true;
  showCustomersTab:boolean=true;
  showGPTTab:boolean=false;
  constructor(private authService : AuthenticationService,
    private sharedService : SharedService,public router:Router) { }

  ngOnInit(): void {
    let ocr_engine = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.ocr_engine;
    let docTypes = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.documentTypes;
    let serviceTemplates = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.serviceInvoices;
    let vendorTemplates = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.vendorInvoices;
    if(docTypes.length == 1 && docTypes[0]=="Purchase Orders" || serviceTemplates == 0){
      this.showServiceTab = false;
    }else{
      this.showServiceTab = true;
    }
    if(docTypes.includes("Invoice") && vendorTemplates == 1){
      this.showVendorsTab = true;
    }else{
      this.showVendorsTab = false;
    }
    if(docTypes.includes("Purchase Orders")){
      this.showCustomersTab = true;
    }else{
      this.showCustomersTab = false;
    }
    if(ocr_engine == "GPT 3.5"){
      this.showCustomersTab = false;
      this.showVendorsTab = false;
      this.showServiceTab = false;
      this.showGPTTab= true;
    }
    this.userDetails = this.authService.currentUserValue;
    this.sharedService.userId = this.userDetails.userdetails.idUser;
    if(this.userDetails.permissioninfo.User == 1){
      this.sharedService.isAdmin = true;
    } else {
      this.sharedService.isAdmin = false;
    }
    this.isAdmin = this.sharedService.isAdmin;
  }

  signOut(){
    this.authService.logout();
  }
  openPopup(){
    this.displaypopup = true;
  }

}
