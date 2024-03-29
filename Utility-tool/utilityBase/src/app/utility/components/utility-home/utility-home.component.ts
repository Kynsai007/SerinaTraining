import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/auth.service';
import { HomeComponent } from '../home/home.component';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-utility-home',
  templateUrl: './utility-home.component.html',
  styleUrls: ['./utility-home.component.scss']
})
export class UtilityHomeComponent implements OnInit {
  isAdmin: any;
  docTypes: any;
  showServiceTab:boolean = true;
  showVendorsTab:boolean=true;
  constructor(private router : Router,private authService:AuthenticationService,
    private sharedService : SharedService) { }

  ngOnInit(): void {
    this.isAdmin = this.sharedService.isAdmin;
    this.docTypes = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.documentTypes;
    let serviceTemplates = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.serviceInvoices;
    let vendorTemplates = JSON.parse(sessionStorage.getItem("instanceConfig")).InstanceModel.vendorInvoices;
    if(this.docTypes.length == 1 && this.docTypes[0]=="Purchase Orders" || serviceTemplates == 0){
      this.showServiceTab = false;
    }else{
      this.showServiceTab = true;
    }
    if(this.docTypes.includes("Invoice") && vendorTemplates == 1){
      this.showVendorsTab = true;
    }else{
      this.showVendorsTab = false;
    }
  }

  startTemplate(){
    if(this.docTypes.includes("Purchase Orders")){
      this.router.navigate(['IT_Utility/customers'])
    }else if(this.docTypes.includes("Invoice")){
      this.router.navigate(['IT_Utility/vendors'])
    }else{
      this.router.navigate(['IT_Utility/service-providers'])
    }
  }
  signOut(){
    this.authService.logout();
  }
}
