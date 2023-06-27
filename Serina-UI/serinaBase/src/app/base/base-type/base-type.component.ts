import { ChartsService } from 'src/app/services/dashboard/charts.service';
import { AlertService } from './../../services/alert/alert.service';
import { ExceptionsService } from './../../services/exceptions/exceptions.service';
import { SettingsService } from './../../services/settings/settings.service';
import { PermissionService } from './../../services/permission.service';
import { AuthenticationService } from './../../services/auth/auth-service.service';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit, OnDestroy,Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
// import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { DataService } from 'src/app/services/dataStore/data.service';
import { ServiceInvoiceService } from 'src/app/services/serviceBased/service-invoice.service';
import { environment1 } from 'src/environments/environment.prod';
import {MatDialog} from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-base-type',
  templateUrl: './base-type.component.html',
  styleUrls: ['./base-type.component.scss'],
})
export class BaseTypeComponent implements OnInit, OnDestroy {
  notifyArray: any[];
  userDetails: any;

  showLogout: boolean = false;
  subscription: Subscription;
  subscription1: Subscription;
  numberOfNotify: number;
  token: any;
  addUsersBoolean: boolean;
  last_login: any;
  openBoolean: boolean;
  last_login1: any;
  openBooleanException: boolean;
  displayResponsivepopup: boolean;
  BtnText = 'Are you sure you want to Logout?';
  messageBox: any;
  financeapproveDisplayBoolean: boolean;
  uploadPermissionBoolean: boolean;
  serviceTriggerBoolean: boolean;
  isSuperAdmin: boolean;
  isAGIUser:boolean = false;
  dashboardUserBoolean: boolean;
  openBooleanVendor: boolean;
  excpetionPageAccess: boolean;
  GRNPageAccess: boolean;
  settingsPageAccess: boolean;
  vendor_SP_PageAccess: boolean;
  menubarBoolean:boolean;
  timezone: string;
  GRNCreationAccess:boolean;
  vendorInvoiceAccess:boolean;
  serviceInvoiceAccess:boolean;
  exceptionRoute: string;
  DocumentPageRoute: string;
  invoceDoctype: boolean;
  bothDocBoolean: boolean;
  ap_boolean:boolean;
  switchtext:string = "";
  cust_type: string;

  constructor(
    public router: Router,
    private SharedService: SharedService,
    private permissionService: PermissionService,
    private dataStoreService: DataService,
    private settingService: SettingsService,
    private serviceBased: ServiceInvoiceService,
    private exceptionService: ExceptionsService,
    // private _mqttService: MqttService,
    private chartService: ChartsService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private serviceProviderService : ServiceInvoiceService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {
    this.subscription1 = this.SharedService.getMessage().subscribe(
      (message) => {
        this.numberOfNotify = message.Arraylength;
      }
    );
  }

  ngOnInit(): void {
    this.dataStoreService.configData = JSON.parse(sessionStorage.getItem('configData'));
    this.dataStoreService.ap_boolean = JSON.parse(sessionStorage.getItem('ap_boolean'));
    if(!this.dataStoreService.configData){
      this.readConfig();
    }
    this.getUserTimezone();
    this.appendScript();
    this.show2ndMenu();
    this.servicesData();
    this.getPermissions();
    this.subscribeNewTopic();
    this.notification_logic();
    this.getEntitySummary();
    // this.readVendors();
    // this.readVendorNames();
  }
  appendScript (){
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://datasemanticschatbots.in/bot_script/Serina Bot/cGluZWFwcGxl';

  }
  removeSession(){
    sessionStorage.clear();
  }
  openDialog() {
    this.dialog.open(ChangePasswordComponent);
  }
  readConfig(){
    this.settingService.readConfig().subscribe((data:any)=>{
      sessionStorage.setItem("configData", JSON.stringify(data.InstanceModel));
      this.dataStoreService.configData = data.InstanceModel ;
      this.ngOnInit();
    })
  }
  
  notification_logic() {
    this.notifyArray = JSON.parse(sessionStorage.getItem('messageBox'));

    if (this.notifyArray == null) {
      this.notifyArray = [];
    } else {
      this.notifyArray = this.notifyArray.reduce((unique, o) => {
        if (
          !unique.some((obj) => obj.idPullNotification === o.idPullNotification)
        ) {
          unique.push(o);
        }
        return unique;
      }, []);
      this.numberOfNotify = this.notifyArray.length;
      this.SharedService.sendNotificationNumber(this.notifyArray.length);
      this.numberOfNotify = this.notifyArray.length;
    }
  }

  servicesData() {
    this.financeapproveDisplayBoolean =
    this.dataStoreService.configData?.enableApprovals;
    let userRole = this.authService.currentUserValue['permissioninfo'].NameOfRole.toLowerCase();
    if(userRole == 'customer super admin' || userRole == 'ds it admin'){
      this.dataStoreService.isAdmin = true;
    } else {
      this.dataStoreService.isAdmin = false;
    }
    this.settingService.finaceApproveBoolean = this.dataStoreService.configData?.enableApprovals;
    this.GRNCreationAccess = this.dataStoreService.configData?.enableGRN;
    this.vendorInvoiceAccess = this.dataStoreService.configData.vendorInvoices;
    this.serviceInvoiceAccess = this.dataStoreService.configData.serviceInvoices;
    if(this.dataStoreService.configData.documentTypes.length >1){
      this.bothDocBoolean  = true;
    } else {
      this.bothDocBoolean  = false;
    }
    // if(this.dataStoreService.ap_boolean == undefined ){
      if(this.dataStoreService.ap_boolean){
        this.DocumentPageRoute = 'invoice/allInvoices';
        this.ap_boolean = true;
        this.switchtext = "AR";
        this.cust_type = 'Vendor';
        this.invoceDoctype = true;
        console.log('hi')
      } else {
        this.DocumentPageRoute = 'invoice/PO';
        this.ap_boolean = false;
        this.switchtext = "AP";
        this.dataStoreService.ap_boolean = false;
        this.cust_type = 'Customer';
      }
    // } else {
    //   if(this.ap_boolean){
    //     this.cust_type = 'Vendor';
    //   } else {
    //     this.cust_type = 'Customer';
    //   }
    //   console.log(this.cust_type)
    // }

    if(this.vendorInvoiceAccess){
      this.exceptionRoute = 'ExceptionManagement';
    } else if(this.serviceInvoiceAccess) {
      this.exceptionRoute = 'ExceptionManagement/Service_ExceptionManagement';
    }
    this.userDetails = this.authService.currentUserValue;
    environment1.password = this.userDetails.token;
    environment1.username = JSON.parse(sessionStorage.getItem('username'));
    this.SharedService.userId = this.userDetails.userdetails.idUser;
    this.SharedService.isCustomerPortal = true;
    this.settingService.userId = this.userDetails.userdetails.idUser;
    this.exceptionService.userId = this.userDetails.userdetails.idUser;
    this.serviceBased.userId = this.userDetails.userdetails.idUser;
    this.chartService.userId = this.userDetails.userdetails.idUser;
    this.uploadPermissionBoolean = this.userDetails.permissioninfo.NewInvoice;
    this.permissionService.uploadPermissionBoolean = this.userDetails.permissioninfo.NewInvoice;
    this.last_login1 = this.userDetails.last_login;

  }


  // read User permissions
  getPermissions() {
    if (this.userDetails) {
      if (this.userDetails.permissioninfo.User == 1) {
        this.addUsersBoolean = true;
        this.permissionService.addUsersBoolean = true;
      }
      if (this.userDetails.permissioninfo.Permissions == 1) {
        this.permissionService.addUserRoleBoolean = true;
      }
      if (this.userDetails.permissioninfo.allowServiceTrigger == 1) {
        this.serviceTriggerBoolean = true
        this.permissionService.serviceTriggerBoolean = true;
      }
      if (this.userDetails.permissioninfo.is_epa == 1) {
        this.excpetionPageAccess = true
        this.permissionService.excpetionPageAccess = true;
      }
      if (this.userDetails.permissioninfo.is_gpa == 1) {
        this.GRNPageAccess = true
        this.permissionService.GRNPageAccess = true;
      }
      if (this.userDetails.permissioninfo.is_spa == 1) {
        this.settingsPageAccess = true
        this.permissionService.settingsPageAccess = true;
      }
      if (this.userDetails.permissioninfo.is_vspa == 1) {
        this.vendor_SP_PageAccess = true
        this.permissionService.vendor_SP_PageAccess = true;
      }
      if (this.userDetails.permissioninfo.NameOfRole == 'Customer Super Admin') {
        this.isSuperAdmin= true
        this.permissionService.isSuperAdmin = true;
      }

      if (this.userDetails.permissioninfo.AccessPermissionTypeId == 1) {
        this.permissionService.viewBoolean = true;
        this.permissionService.editBoolean = false;
        this.permissionService.changeApproveBoolean = false;
        this.permissionService.financeApproveBoolean = false;
      } else if (this.userDetails.permissioninfo.AccessPermissionTypeId == 2) {
        this.permissionService.viewBoolean = true;
        this.permissionService.editBoolean = true;
        this.permissionService.changeApproveBoolean = false;
        this.permissionService.financeApproveBoolean = false;
      } else if (this.userDetails.permissioninfo.AccessPermissionTypeId == 3) {
        this.permissionService.viewBoolean = true;
        this.permissionService.editBoolean = true;
        this.permissionService.changeApproveBoolean = true;
        this.permissionService.financeApproveBoolean = false;
      } else if (this.userDetails.permissioninfo.AccessPermissionTypeId == 4) {
        this.permissionService.viewBoolean = true;
        this.permissionService.editBoolean = true;
        this.permissionService.changeApproveBoolean = true;
        this.permissionService.financeApproveBoolean = true;
      }
    }
  }

  subscribeNewTopic(): void {
    // let name = JSON.parse(sessionStorage.getItem('username'));
    // this.subscription = this._mqttService.observe(name + 'queue').subscribe(
    //   (message: IMqttMessage) => {
    //     this.messageBox = JSON.parse(message.payload.toString());
    //     if (!sessionStorage.getItem('messageBox') || message.retain != true) {
    //       let pushArray = JSON.parse(message.payload.toString());
    //       if(pushArray.length>0){
    //         pushArray.forEach((element) => {
    //           this.notifyArray.push(element);
    //         });
    //       }
    //       if (pushArray.length > 1) {
    //         this.notifyArray = pushArray.reduce((unique, o) => {
    //           if (
    //             !unique.some(
    //               (obj) => obj.idPullNotification === o.idPullNotification
    //             )
    //           ) {
    //             unique.push(o);
    //           }
    //           return unique;
    //         }, []);
    //       }
    //       sessionStorage.setItem(
    //         'messageBox',
    //         JSON.stringify(this.notifyArray)
    //       );
    //       // this.arrayLengthNotify = this.notifyArray.length
    //       this.notification_logic();

    //       // this.playAudio();
    //     }
    //   },
    //   (error) => {
    //     this._mqttService.disconnect();
    //     this.subscription.unsubscribe();
    //   }
    // );
    // this.send_msg();
  }

  // for sound
  playAudio() {
    let audio = new Audio();
    audio.src = 'assets/when-604.mp3';
    audio.load();
    audio.play();
  }

  // open or close logout dropdown
  isActive() {
    this.showLogout = !this.showLogout;
  }

  // close logout dropdown if click outside
  onClickedOutside(e: Event) {
    this.showLogout = false;
  }

  // logout
  logout() {
    this.authService.logout('');
    this.dataStoreService.invoiceLoadedData = [];
    this.dataStoreService.poLoadedData = [];
    this.dataStoreService.GRNLoadedData = [];
    this.permissionService.addUsersBoolean = false;
    this.permissionService.changeApproveBoolean = false;
    this.permissionService.editBoolean = false;
    this.permissionService.financeApproveBoolean = false;
    this.permissionService.viewBoolean = false;
  }

  // based on route we enable the secondary menu function
  show2ndMenu() {
    if (this.router.url.includes('serviceProvider')) {
      this.openBoolean = true;
    } else if (this.router.url.includes('ExceptionManagement')) {
      this.openBooleanException = true;
    } else if (this.router.url.includes('vendor')){
      this.openBooleanVendor = true;
    } else {
      this.openBoolean = false;
      this.openBooleanException = false;
      this.openBooleanVendor = false;
    }
  }

  sideMenuVendor(){
    this.openBooleanVendor = true;
    this.openBoolean = false;
    this.openBooleanException = false;
  }

  // toggle the serviceprovider menu
  showInner() {
    this.openBoolean = true;
    this.openBooleanException = false;
    this.openBooleanVendor = false;
  }

  // toggle the Exception menu
  showInnerException() {
    this.openBoolean = false;
    this.openBooleanException = true;
    this.openBooleanVendor = false;
  }

  // Read entity once data is subscribed then passing the data through observable
  getEntitySummary() {
    this.serviceProviderService.getSummaryEntity().subscribe((data: any) => {
       data.result.forEach((ele)=>{
       if(ele.EntityName == "Al Ghurair Investment LLC") {
        this.isAGIUser = true;
       }
      })
      this.dataStoreService.entityData.next(data.result);
    });
  }

  readVendorNames(){
    this.SharedService.getVendorUniqueData('?offset=1&limit=100').subscribe((data:any)=>{
      this.dataStoreService.vendorNameList.next(data);
    });
  }

  onClickMenu(){
    this.menubarBoolean = !this.menubarBoolean
  }
  getUserTimezone(): void {
    const date = new Date();
    this.timezone = date.toLocaleTimeString('en', { timeZoneName: 'short' }).split(' ')[2];
  }
  portalChange(){
    this.ap_boolean = !this.ap_boolean;
    if(this.ap_boolean)
    this.switchtext = "AR";
    else
    this.switchtext = "AP";
    this.dataStoreService.ap_boolean = !this.dataStoreService.ap_boolean;
    sessionStorage.setItem('ap_boolean',JSON.stringify(this.ap_boolean))
    console.log(this.ap_boolean)
    setTimeout(() => {
      window.location.reload()
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
