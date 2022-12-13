import { RegistrationComponent } from './../registration/registration.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegistrationService } from 'src/app/services/registration/registration.service';
import { SharedService } from 'src/app/services/shared.service';
RegistrationComponent
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss','./../registration/registration.component.scss']
})
export class SignUpComponent implements OnInit {
  registrationForm:FormGroup;
  predefinedFormData:any;
  fieldTextType: boolean;
  linkActiveBoolean:boolean = true;
  routeIdCapture: any;
  token: any;
  userData: any;
  errorDivBoolean: boolean;
  emailID
  emailValidationBool: boolean;
  otpBool : boolean;
  otp: string;
  showOtpComponent:boolean;
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
  timer:number;
  otpToken: any;
  userBoolean: boolean;
  usernameField: any;
  signupToken: any;
  activationBoolean = true;

  constructor(private fb:FormBuilder,
    private datePipe: DatePipe,
    private router:Router,
    private sharedService: SharedService,
    private messageService : MessageService,
    private registrationService : RegistrationService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      userName : new FormControl('',[Validators.required,Validators.minLength(6)]),
      vendorName : ['',Validators.required],
      emailId :  new FormControl({value: '', disabled: true}, Validators.required),
      firstName : ['',Validators.required],
      lastName : ['',Validators.required],
      password : ['',Validators.required],
      reEnterPassword: ['',Validators.required]
    })
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  userCheck(name) {
    if(name?.length > 5){
      this.sharedService.userCheck(name).subscribe((data: any) => {
        this.usernameField = data.LogName
        if (data.LogName) {
          this.userBoolean = false;
          // this.userNotBoolean = false;
        } else {
          // this.userNotBoolean = true;
          this.userBoolean = true;
        }
      });
    }
  }
  // get user_name(){ return this.registrationForm.get('username');}
  savePasswordforNewuser(){
    let signup_value = this.registrationForm.getRawValue();
    let Obj = {
      "n_ven_user": {
        "tempVendorName": signup_value.vendorName,
        "firstName": signup_value.firstName,
        "lastName": signup_value.lastName,
        "email": signup_value.emailId,
        "role_id": 7
      },
      "n_cred": {
        "LogName": signup_value.userName,
        "LogSecret": signup_value.password
      }
    }

    this.registrationService.signup_vendoruser( this.signupToken,JSON.stringify(Obj)).subscribe((data:any)=>{

        this.messageService.add({
          severity: "success",
          summary: "Created",
          detail: "Account created, sent for admin approval"
        });
        this.activationBoolean = false;
    },error=>{
      this.messageService.add({
        severity: "error",
        summary: "error",
        detail: "User already activated"
      });
    })
  }

  confirmPassword(value){
    if(this.registrationForm.value.password != value){
      this.errorDivBoolean = true;
    } else{
      this.errorDivBoolean = false;
    }
  }

  checkPattren(val){
    this.registrationForm.patchValue({
      reEnterPassword : ''
    });
    let passClass:any = document.getElementsByClassName('checkColor');
    const number = new RegExp('(?=.*[0-9])');
    const lowerCase = new RegExp('(?=.*[a-z])');
    const upperCase = new RegExp('(?=.*[A-Z])');
    const specialChar = new RegExp('(?=.*[!@#$%^&*()_+.,?:;/{}])');
    const minLength = new RegExp('(?=.{8,})')

    if(passClass.length>0){
      if(specialChar.test(val)){
        passClass[3].style.color ="green"
      } else {
        passClass[3].style.color ="red"
      }
  
      if(upperCase.test(val)){
        passClass[2].style.color ="green"
      } else {
        passClass[2].style.color ="red"
      }
  
      if(lowerCase.test(val)){
        passClass[1].style.color ="green"
      } else {
        passClass[1].style.color ="red"
      }
      if(number.test(val)){
        passClass[0].style.color ="green"
      } else {
        passClass[0].style.color ="red"
      }
      if(minLength.test(val)){
        passClass[4].style.color ="green"
      } else {
        passClass[4].style.color ="red"
      }
    }
  }
  onOtpChange(otp) {
    this.otp = otp;
  }
  // resendActivationLink(){
  //   this.registrationService.resendVerificationLink(this.token,this.emailId).subscribe((data:any)=>{
  //     this.messageService.add({
  //       severity: "success",
  //       summary: "Link Sent",
  //       detail: "Activation link sent to your Email, please check"
  //     });
  //   }, error=>{
  //     if(error.status == 400){
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "error",
  //         detail: "Please enter a valid Email which is present in Serina"
  //       });
  //     } else {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "error",
  //         detail: "Please contact admin"
  //       });
  //     }
  //   });
  // }
  sendOTP(val,type){
    this.registrationService.sendOTP_email(this.emailID).subscribe((data:any)=>{
      this.otpToken = data.token;
      this.timer = 120;
      let countdown =  setInterval(()=>{
        this.timer = this.timer-1;
      },1000);
      setTimeout(()=>{
          clearInterval(countdown);
      },120000)
  
      this.showOtpComponent = true;
      this.otpBool = true;
      if(type == 'send'){
        document.getElementById('signup').classList.add('slide');
      }
  }, err=>{
    if(err.status == 400){
      this.messageService.add({
        severity: "error",
        summary: "error",
        detail: "Email already present in the Serina."
      });
    }
  })

  }

  verifyOTP(){
    document.getElementById('signup').classList.remove('slide');
    let obj= {
      "activation_code": this.otpToken,
      "password": "string"
    }
    this.registrationService.verifyOTP(this.otp,obj).subscribe((data:any)=>{
      this.registrationForm.patchValue({
        emailId: this.emailID
      });
      this.signupToken = data.form_token
      this.emailValidationBool = true;
      document.getElementById('signup').classList.add('slide');
    },err=>{
      if(err.status == 400){
        this.messageService.add({
          severity: "error",
          summary: "error",
          detail: "Please enter a valid OTP."
        });
      } else {

      }
    })

  }

}
