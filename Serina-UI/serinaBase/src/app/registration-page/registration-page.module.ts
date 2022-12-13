import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationPageRoutingModule } from './registration-page-routing.module';
import { importFilesModule } from '../base/importFiles.module';
import {PasswordModule} from 'primeng/password';
import { NgOtpInputModule } from  'ng-otp-input';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';


@NgModule({
  declarations: [RegistrationComponent, SignUpComponent],
  imports: [
    CommonModule,
    RegistrationPageRoutingModule,
    importFilesModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    NgOtpInputModule
  ]
})
export class RegistrationPageModule { }
