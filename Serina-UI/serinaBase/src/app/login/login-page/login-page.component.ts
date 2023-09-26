import { DataService } from 'src/app/services/dataStore/data.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
// import { environment } from './../../../../../../Utility-tool/utilityBase/src/environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment, environment1 } from 'src/environments/environment.prod';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  otpForm: FormGroup;
  loading = false;
  emailId: string;
  password: any;
  newPassword: any;
  sendMail: string;
  confirmPassword: any;
  passwordMatchBoolean: boolean;
  fieldTextType: boolean;
  fieldTextTypeReset1: boolean;
  fieldTextTypeReset: boolean;
  loginboolean: boolean = true;
  forgotboolean: boolean = false;
  resetPassword: boolean = false;
  successPassword: boolean = false;
  loginBooleanSend: boolean = false;
  loginsuccess: boolean = false;
  numberRegEx = /^[\d\$]+$/
  keepMeLogin: boolean = false;
  otp: string;
  errorotp:string="";
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  @ViewChild('ngOtpInput2', { static: false }) ngOtpInput2: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '35px'
    }
  };
  userDetails = [
    { 'userId': 'prathapDS', 'password': '12345678', 'AccountType': 'customer' },
    { 'userId': 'DS2021', 'password': '12345678', 'AccountType': 'vendor' }
  ]
  showOtpPanel: boolean;
  showSendbtn: boolean = true;
  showVerifyBtn: boolean = false;
  otpData: any;
  paswrd: any;
  seconds = "59";
  minutes = "01";
  restricterr:string="";
  canresend: boolean = false;
  returnUrl: string;
  verifying:boolean = false;
  error = '';
  token: any;
  popupText: any;
  alertDivBoolean: boolean;
  submitted: boolean = false;
  User_type: string;
  errorMail: boolean;
  errorMailText: any;
  otp_login:string;
  tokenOTP: any;
  instanceInfo:any;
  isVendorPortalRequired: boolean;
  vendorInvoiceAccess: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private settingService: SettingsService,
    private dataStoreService: DataService,
    private authenticationService: AuthenticationService,private msalService: MsalService,private googleService: SocialAuthService) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.User_type = this.authenticationService.currentUserValue.user_type;
      if (this.User_type === 'customer_portal') {
        this.router.navigate(['/customer']);
      } else if (this.User_type === 'vendor_portal') {
        this.router.navigate(['/vendorPortal']);
      }
    }
  }

  ngOnInit(): void {
    this.getInstancedata();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // if(){
    //   if(this.User_type === 'customer_portal'){
    //     this.router.navigate(['/customer']);
    //   } else if(this.User_type === 'vendor_portal'){
    //     this.router.navigate(['/vendorPortal']);
    //   }
    // }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextTypeReset() {
    this.fieldTextTypeReset = !this.fieldTextTypeReset;
  }
  toggleFieldTextTypeReset1() {
    this.fieldTextTypeReset1 = !this.fieldTextTypeReset1;
  }
  test(event) {
    if (this.newPassword == this.confirmPassword) {
      this.passwordMatchBoolean = false;
    } else {
      // alert('Enter same password')
      this.passwordMatchBoolean = true;
    }
  }
  forgot() {
    this.loginboolean = false;
    this.forgotboolean = true;
    this.resetPassword = false;
    this.successPassword = false;
  }
  tryLogin() {
    this.loginboolean = true;
    this.forgotboolean = false;
    this.resetPassword = false;
    this.successPassword = false;
    this.showOtpPanel = false;
    this.showSendbtn = true;
  }
  sendOtp() {
    this.loading = true;
    let mailData = {
      mail: [this.sendMail]
    }
    this.sharedService.sendMail(this.sendMail).subscribe((data) => {
      this.tokenOTP = data.token;
      if (data.result == "successful") {
        this.loading = false;
        this.showOtpPanel = true;
        this.showSendbtn = false;
        this.loginboolean = false;
        this.forgotboolean = false;
        this.resetPassword = true;
        this.successPassword = false;
        this.errorMail = false;
      }
    },err =>{
      this.errorMail = true;
      this.errorMailText = err.statusText
      this.loading = false;
    })
  }
  
  resetPass() {
    this.loading = true;
    let updatePassword = {
      "activation_code": this.tokenOTP,
      "password": this.paswrd
    } 
    this.sharedService.updatepass(JSON.stringify(updatePassword),this.otp).subscribe(data => {
      this.loading = false;
      this.loginboolean = false;
      this.forgotboolean = false;
      this.resetPassword = false;
      this.successPassword = true;

    })
  }
  resetSuccess() {
    this.loginboolean = true;
    this.forgotboolean = false;
    this.resetPassword = false;
    this.successPassword = false;
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; };

  getInstancedata(){
    this.settingService.readConfig().subscribe((resp:any)=>{
      this.instanceInfo = {...resp.InstanceModel,...resp.ERPModel };
      // this.dataStoreService.configData.flipBool = true;
      this.dataStoreService.configData = this.instanceInfo ;
      this.isVendorPortalRequired = this.instanceInfo?.enablevendorportal;
      this.vendorInvoiceAccess = this.instanceInfo?.vendorInvoices;
    })
  }
  loginMS(){
    this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
      this.msalService.instance.setActiveAccount(response.account);
      this.login('ms');
    });
  }
  signInWithGoogle(): void {
    this.googleService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response:any) =>{
      localStorage.setItem("ga.account.keys", response["email"]);
      this.login('ga');
    });
  }
  isLoggedInMs(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }
  login(type) {
    this.submitted = true;
    this.loginsuccess = false;
    // stop here if form is invalid
    if(type == "ms"){
      this.f.username.setValue(this.msalService.instance.getActiveAccount().username);
      this.f.password.setValue("random");
    }
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    let data1 = {
      "username": this.f.username.value,
      "password": this.f.password.value,
      "type":type
    }
    
    sessionStorage.setItem('username',JSON.stringify(data1.username));
    this.authenticationService.login(JSON.stringify(data1))
      .subscribe(
        data => {
          this.error = "";
          this.loading = false;
          this.getIPAddress();
            if(this.instanceInfo?.enable2fa){
              if(data["status"]){
                this.loginsuccess = true;
                // setTimeout(() => {
                //   this.addEvent();
                // }, 500);
                let int = setInterval(()=>{
                  if(Number(this.seconds) > 0){
                    this.seconds = (Number(this.seconds) - 1).toString();
                    if(Number(this.seconds) >= 0  && Number(this.seconds) <= 9){
                      this.seconds = "0"+(Number(this.seconds)).toString();
                    }
                  }else{
                    this.seconds = "59";
                    this.minutes = "0"+(Number(this.minutes) - 1).toString();
                  }
                  this.restricterr = `OTP Sent to Email! You can request for a new OTP after ${this.minutes}:${this.seconds}`;
                  if(Number(this.seconds) <= 0 && Number(this.minutes) <= 0){
                    this.seconds = "59";
                    this.minutes = "01";
                    this.restricterr = "";
                    clearInterval(int);
                    this.canresend = true;
                  }
                },1000);
              }else{
                this.error = "Username or/and password are incorrect.";
                this.loginsuccess = false;
              }
            } else {
              this.checkInstanceData(data)
            }

        },
        error => {
          this.loginsuccess = false;
          this.loading = false;
          if (error.status === 401 || error.status === 404) {
          if(error.status === 401){
            this.error = "Username or/and password are incorrect.";
          }else{
            this.error = "User is not Registered!";
          }
            this.alertDivBoolean = true
          } else {
          this.error = error.statusText;
          }

        });
  }

  storeUser(e) {
    this.keepMeLogin = e.target.checked;
    this.sharedService.keepLogin = e.target.checked;
    
  }
  onOtpChange(otp) {
    this.otp = otp;
  }
    onOtpAdding(otp){
    this.otp_login = otp;
  }
  resendOTP(){
    this.errorotp = "";
    if(this.canresend){
      this.authenticationService.resendOTP(this.loginForm.controls["username"].value).subscribe(data =>{
        if(data['status'] == "success"){
          this.canresend = false;
          let int = setInterval(()=>{
            if(Number(this.seconds) > 0){
              this.seconds = (Number(this.seconds) - 1).toString();
              if(Number(this.seconds) >= 0  && Number(this.seconds) <= 9){
                this.seconds = "0"+(Number(this.seconds)).toString();
              }
            }else{
              this.seconds = "59";
              this.minutes = "0"+(Number(this.minutes) - 1).toString();
            }
            this.restricterr = `OTP Sent to Email! You can request for a new OTP after ${this.minutes}:${this.seconds}`;
            if(Number(this.seconds) <= 0 && Number(this.minutes) <= 0){
              this.seconds = "59";
              this.minutes = "01";
              this.restricterr = "";
              clearInterval(int);
              this.canresend = true;
            }
          },1000);
        }
      });
    }
  }

  verifyOTP(){
    this.errorotp = "";
    this.verifying = true;
    let optobj = {'username':this.loginForm.controls["username"].value,'otp':this.otp_login}
    this.authenticationService.verifyOTP(optobj).subscribe(data=>{
      this.verifying = false;
      if(data == "invalid"){
        this.errorotp = "The OTP is invalid/incorrect!";
        return;
      }else if(data == "otp expired"){
        this.errorotp = "The OTP has expired! Please generate a new one";
        return;
      }

                
          this.checkInstanceData(data)
            
      //window.location.reload();
    })
  }

  checkInstanceData(data){
    if(this.instanceInfo?.isActive == 1){
      sessionStorage.setItem("configData", JSON.stringify(this.instanceInfo));
      let invoceDoctype = false;
      this.dataStoreService.ap_boolean = false;
      if(this.dataStoreService.configData.documentTypes.includes('Invoice')){
        invoceDoctype = true;
        this.dataStoreService.ap_boolean = true;
      }
      sessionStorage.setItem("ap_boolean", JSON.stringify(invoceDoctype));
        if (this.returnUrl) {
          this.router.navigate([this.returnUrl]);
        } else if (data.user_type === 'customer_portal') {
          let route = '';
            if(data.userdetails?.landingPage == 'Upload'){
              if(this.vendorInvoiceAccess){
                route = '/uploadInvoices'
              } else {
                if(invoceDoctype){
                  route = '/invoice/allInvoices'
                } else {
                  route = '/invoice/PO'
                }
              }
            } else if(data.userdetails?.landingPage == 'Document Status'){
              if(invoceDoctype){
                route = '/invoice/allInvoices'
              } else {
                route = '/invoice/PO'
              }
            } else if(data.userdetails?.landingPage == 'Dashboard'){
              route = '/home'
            } else if(data.userdetails?.landingPage == 'Exception'){
              route = '/ExceptionManagement'
            }
            this.router.navigate([`/customer${route}`]);
        } else if (data.user_type === 'vendor_portal') {
          this.router.navigate(['/vendorPortal']);
        }
        environment1.username = this.loginForm.controls["username"].value;;
      } else {
        alert('The instance is inactive. Please contact Service Admin.');
        sessionStorage.clear();
      }
  }

  signUpLink(){
    if(this.vendorInvoiceAccess && this.isVendorPortalRequired){
      this.router.navigate(['/registration-page/signUp'])
    } else {
      alert('Sorry! Vendor portal is not opted by the Admin, Please contact Service Admin to enable.');
    }
  }
  async getIPAddress() {
    const response = await fetch('https://ip.seeip.org/jsonip?');
    const data = await response.json();
    sessionStorage.setItem('userIp',JSON.stringify(data.ip));
}
  
}
