import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  apiVersion = environment.apiVersion;
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  savenewUserPassword(data):Observable<any>{
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/newUserActivation`,data);
  }
  resendVerificationLink(token,email){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/resetExpiredActivationLink/?activation_code=${token}&email=${email}`)
  }

  sendOTP_email(mail){
    return this.http.get(`${this.apiUrl}/${this.apiVersion}/newVendorUserOTP?email=${mail}`)
  }
  verifyOTP(otp,data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/validateVendorUserOTP?otp_code=${otp}`,data)
  }
  signup_vendoruser(otp,data){
    return this.http.post(`${this.apiUrl}/${this.apiVersion}/preApproved/newVendorAdminUser/?form_token=${otp}`,data)
  }
}
