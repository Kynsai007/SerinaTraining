import { DataService } from 'src/app/services/dataStore/data.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
// import { environment } from './../../../../../../Utility-tool/utilityBase/src/environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment, environment1 } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
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

  keepMeLogin: boolean = false;
  otp: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
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

  returnUrl: string;
  error = '';
  token: any;
  popupText: any;
  alertDivBoolean: boolean;
  submitted: boolean = false;
  User_type: string;
  errorMail: boolean;
  errorMailText: any;
  tokenOTP: any;
  instanceInfo:any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private settingService: SettingsService,
    private dataStoreService: DataService,
    private authenticationService: AuthenticationService) {
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
  verifyOtp() {
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

  login() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    let data1 = {
      "username": this.f.username.value,
      "password": this.f.password.value
    }
    localStorage.setItem('username',JSON.stringify(data1.username));
    this.authenticationService.login(JSON.stringify(data1))
      .subscribe(
        data => {
          this.loading = false;
          this.settingService.readConfig().subscribe((resp:any)=>{
            localStorage.setItem("configData", JSON.stringify(resp.InstanceModel));
            this.instanceInfo = resp.InstanceModel;
            this.dataStoreService.configData = resp.InstanceModel ;
            if(this.instanceInfo?.isActive == 1){
              if (this.returnUrl) {
                this.router.navigate([this.returnUrl]);
              } else if (data.user_type === 'customer_portal') {
                if(data.permissioninfo.NameOfRole == 'Receiver'){
                  this.router.navigate(['/customer/Create_GRN_inv_list']);
                } else {
                  this.router.navigate(['/customer']);
                }
              } else if (data.user_type === 'vendor_portal') {
                this.router.navigate(['/vendorPortal']);
              }
              environment1.username = data1.username;
            } else {
              alert('The instance is inactive. Please contact Service Admin.');
              localStorage.clear();
            }
          })

          // window.location.reload();
        },
        error => {
          this.loading = false;
          if (error.status === 401) {
          this.error = "Username or/and password are incorrect.";
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
}
