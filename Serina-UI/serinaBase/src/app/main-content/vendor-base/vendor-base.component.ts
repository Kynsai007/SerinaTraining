import { ServiceInvoiceService } from './../../services/serviceBased/service-invoice.service';
import { DocumentService } from './../../services/vendorPortal/document.service';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { PermissionService } from 'src/app/services/permission.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/base/change-password/change-password.component';
import { environment1 } from 'src/environments/environment.prod';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-vendor-base',
  templateUrl: './vendor-base.component.html',
  styleUrls: ['./vendor-base.component.scss']
})
export class VendorBaseComponent implements OnInit {
  userDetails:any;numberOfNotify: any;
  notifyArray: any;
  addUsersBoolean: boolean;
  returnUrl: any;
  last_login: string;
  showLogout: boolean;
  subscription:Subscription;
  displayResponsivepopup:boolean;
  BtnText ="Are you sure you want to Logout?"
  menubarBoolean: boolean;
  excpetionPageAccess: boolean;
  uploadPermissionBoolean: boolean;
  ap_boolean:boolean;
  isDesktop:boolean;
  sidebarMode = 'side';
  timezone: string;
  constructor(private router:Router,
    private settingService : SettingsService,
    private SharedService:SharedService,
    private permissionService: PermissionService,
    private authService: AuthenticationService,
    private docService : DocumentService,
    public dialog: MatDialog,
    private chartService: ChartsService,
    private exceptionService: ExceptionsService,
    private serviceproviderService : ServiceInvoiceService,
    private DS : DataService,
    private renderer: Renderer2) { 
      this.subscription = this.SharedService.getMessage().subscribe(message => {
        this.numberOfNotify = message.Arraylength;
        // if (this.SharedService.keepLogin === true) {
        //   this.userDetails = JSON.parse(sessionStorage.getItem('logInUser'));
        // } else {
        //   this.userDetails = JSON.parse(sessionStorage.getItem('logInUser'));
        // }
      });
   
  }

  ngOnInit(): void {
    this.DS.configData = JSON.parse(sessionStorage.getItem('configData'));
    this.DS.ap_boolean = JSON.parse(sessionStorage.getItem('ap_boolean'));
    this.chartService.docType = 3;
    this.SharedService.docType = 3;
    this.ap_boolean = this.DS.ap_boolean;
    if(!this.DS.configData){
      this.readConfig();
    }
    this.userDetails = this.authService.currentUserValue;
    this.docService.userId = this.userDetails.userdetails.idUser;
    if (this.userDetails.user_type == 'vendor_portal') {
      this.DS.portalName = 'vendorPortal';
    } else {
      this.DS.portalName = 'customer'
    }
    this.getUserTimezone();
    this.appendScript();
    this.SharedService.userId = this.userDetails.userdetails.idUser;
    this.serviceproviderService.userId = this.userDetails.userdetails.idUser
    this.SharedService.isCustomerPortal = false;
    environment1.password = this.userDetails.token;
    environment1.username = JSON.parse(sessionStorage.getItem('username'));
    this.exceptionService.userId = this.userDetails.userdetails.idUser;
    this.serviceproviderService.userId = this.userDetails.userdetails.idUser;
    this.chartService.userId = this.userDetails.userdetails.idUser;
    const date = this.convertUTCDateToLocalDate(new Date(this.userDetails.last_login));
    this.uploadPermissionBoolean = this.userDetails.permissioninfo.NewInvoice;
    this.permissionService.uploadPermissionBoolean = this.userDetails.permissioninfo.NewInvoice;
    this.last_login = this.userDetails.last_login;
    this.readVendor();
    this.getPermissions();
    
    // this.getNotification();
    
  }
  appendScript (){
    if(window.screen.width >= 576){
      this.sidebarMode = 'side';
      this.isDesktop = true;
      this.DS.isDesktop = true;
    } else {
      this.sidebarMode = 'over';
      this.isDesktop = false;
      this.DS.isDesktop = false;
    }
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://datasemanticschatbots.in/bot_script/Serina Bot/cGluZWFwcGxl';

  }
  readConfig(){
    this.settingService.readConfig().subscribe((data:any)=>{
      sessionStorage.setItem("configData", JSON.stringify(data.InstanceModel));
      this.DS.configData = data.InstanceModel ;
      this.ngOnInit();
    })
  }

  readVendor(){
    this.docService.readVendorContactData().subscribe((data:any)=>{
      this.SharedService.vendorReadID = data.idVendor;
    });
  }

  convertUTCDateToLocalDate(date) {
    // const newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    // const offset = date.getTimezoneOffset() / 60;
    // const hours = date.getHours();

    // newDate.setHours(hours - offset);

    // return newDate;   
  }
    // read User permissions
    getPermissions(){
      if (this.userDetails.permissioninfo.is_epa == 1) {
        this.excpetionPageAccess = true
        this.permissionService.excpetionPageAccess = true;
      }
      if(this.userDetails){
        if(this.userDetails.permissioninfo.User == 1){
          this.addUsersBoolean = true;
          this.permissionService.addUsersBoolean = true;
        }
  
        if(this.userDetails.permissioninfo.AccessPermissionTypeId == 1){
          this.permissionService.viewBoolean = true;
          this.permissionService.editBoolean = false;
          this.permissionService.changeApproveBoolean = false;
          this.permissionService.financeApproveBoolean = false;
        }
        else if(this.userDetails.permissioninfo.AccessPermissionTypeId == 2){
          this.permissionService.viewBoolean = true;
          this.permissionService.editBoolean = true;
          this.permissionService.changeApproveBoolean = false;
          this.permissionService.financeApproveBoolean = false;
        } else if(this.userDetails.permissioninfo.AccessPermissionTypeId == 3){
          this.permissionService.viewBoolean = true;
          this.permissionService.editBoolean = true;
          this.permissionService.changeApproveBoolean = true;
          this.permissionService.financeApproveBoolean = false;
        } else if(this.userDetails.permissioninfo.AccessPermissionTypeId == 4){
          this.permissionService.viewBoolean = true;
          this.permissionService.editBoolean = true;
          this.permissionService.changeApproveBoolean = true;
          this.permissionService.financeApproveBoolean = true;
        }
      }
    }
  
    // get Notifications
    getNotification() {
      this.SharedService.getNotification().subscribe((data: any) => {
        this.notifyArray = data;
        this.numberOfNotify = this.notifyArray.length;
      })
    }
  isActive(){
    this.showLogout = !this.showLogout;
  }
  onClickedOutside(e: Event) {
    this.showLogout = false;
  }
  openDialog() {
    this.dialog.open(ChangePasswordComponent);
  }
  onClickMenu(){
    this.menubarBoolean = !this.menubarBoolean
  }
  getUserTimezone(): void {
    const date = new Date();
    this.timezone = date.toLocaleTimeString('en', { timeZoneName: 'short' }).split(' ')[2];
  }
  logout(){
    this.authService.logout();
  }
}
