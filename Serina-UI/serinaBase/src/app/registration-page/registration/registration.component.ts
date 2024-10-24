import { AlertService } from 'src/app/services/alert/alert.service';
import { MessageService } from 'primeng/api';
import { RegistrationService } from './../../services/registration/registration.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { PasswordStrengthValidator } from '../password-validators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm:FormGroup;
  predefinedFormData:any;
  fieldTextType: boolean;
  linkActiveBoolean:boolean = true;
  routeIdCapture: any;
  token: any;
  userData: any;
  errorDivBoolean: boolean;
  emailId: string;
  mpassword: any;
  lengthbool: boolean = false;
  specialCharbool: boolean = false;
  upperCharbool: boolean = false;
  lowerCharbool: boolean = false;
  numberbool: boolean = false;
  confirmPasswordFocus: boolean = false;
  
  constructor(private fb:FormBuilder,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router:Router,
    private alertService : AlertService,
    private registrationService : RegistrationService) {

   }

  ngOnInit(): void {
    this.routeIdCapture = this.activatedRoute.params.subscribe(params => {
      this.token= params['id'];
        }) ;
    this.decode();
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  savePasswordforNewuser(){
    const passwordData = {
      "activation_code": this.token,
      "password": this.registrationForm.value.password
    };

    this.registrationService.savenewUserPassword(passwordData).subscribe((data:any)=>{
      if(data.result == "Account Activated"){
        this.alertService.success_alert('Account Activated Successfully')
        this.router.navigate(["/"]);
      }
    },error=>{
      if(error.status == 400){
        this.alertService.error_alert('User already activated');
      } else {
        this.alertService.error_alert("Please contact admin.")
      }
    })
  }
  decode(){
    const decoded = jwt_decode(this.token);

    this.userData = decoded;
    this.registrationForm = this.fb.group({
      userName: [{value:this.userData.username , disabled:true}],
      firstName: [{value:this.userData.firstName , disabled:true}],
      lastName: [{value:this.userData.lastName , disabled:true}],
      password:['', Validators.compose([
        Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
      reEnterPassword:['', Validators.required]
    })

    const date = new Date();
    const createDate = this.datePipe.transform(date,'yyyy-MM-dd');
    if(this.userData.exp_date <= createDate){
      this.linkActiveBoolean = false;
    }
  }
  confirmPassword(value){
    if(this.registrationForm.value.password != value){
      this.errorDivBoolean = true;
    } else{
      this.errorDivBoolean = false;
    }
  }
  resendActivationLink(){
    this.registrationService.resendVerificationLink(this.token,this.emailId).subscribe((data:any)=>{
      this.alertService.success_alert("Activation link sent to your Email, please check.")
    }, error=>{
      if(error.status == 400){
        this.alertService.error_alert("Please enter a valid Email which is present in Serina.");
      } else {
        this.alertService.error_alert("Please contact admin.")
      }
    });
  }
  passwordValidation(){
    const number = new RegExp('(?=.*[0-9])');
    const lowerCase = new RegExp('(?=.*[a-z])');
    const upperCase = new RegExp('(?=.*[A-Z])');
    const specialChar = new RegExp('(?=.*[!@#$%^&*()_+.,/{}])');
    const minLength = new RegExp('(?=.{8,})')
    if (this.mpassword && this.mpassword.length >= 8) {
      this.lengthbool = true;
    } else {
      this.lengthbool = false;
    }
    if(specialChar.test(this.mpassword)){
      this.specialCharbool = true;
    }
    else{
      this.specialCharbool = false;
    }
    if(upperCase.test(this.mpassword)){
      this.upperCharbool = true;
    }
    else{
      this.upperCharbool = false;
    }
    if(lowerCase.test(this.mpassword)){
      this.lowerCharbool = true;
    }
    else{
      this.lowerCharbool = false;
    }
    if(number.test(this.mpassword)){
      this.numberbool = true;
    }
    else{
      this.numberbool = false;
    }
  }

}
