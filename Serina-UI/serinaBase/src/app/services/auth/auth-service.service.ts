import { ChartsService } from './../dashboard/charts.service';
import { DocumentService } from './../vendorPortal/document.service';
import { SharedService } from './../shared.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { environment1 } from 'src/environments/environment.prod';
import jwt_decode from "jwt-decode";
import { MsalService } from '@azure/msal-angular';
import { SocialAuthService } from "angularx-social-login";
export interface User{
    id?: number;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    token?: string;
    user_type? : string;
    refresh_token? :string
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private apiUrl = environment.apiUrl;
    private apiVersion = environment.apiVersion;

    constructor(private http: HttpClient,
        private router:Router,
        private docService : DocumentService,
        private chartService : ChartsService,
        private sharedService: SharedService,private msalService:MsalService,private googleService: SocialAuthService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentLoginUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(data) {
        return this.http.post<any>(`${this.apiUrl}/${this.apiVersion}/login`, data)
            .pipe(map(user => {
                if (user['status']) {
                    return user;
                }
                this.dataFunc(user);

                return user
            }));
    }
    resendOTP(username){
        return this.http.post<any>(`${this.apiUrl}/${this.apiVersion}/resendOTP`,{'username':username},{headers:new HttpHeaders({'Content-Type':'application/json'})});
    }
    verifyOTP(otpObj){
        return this.http.post<any>(`${this.apiUrl}/${this.apiVersion}/verifyOTP`,otpObj,{headers:new HttpHeaders({'Content-Type':'application/json'})})
        .pipe(map(user => {
            if(user == "invalid" || user == "otp expired"){
                return user;
            }
           this.dataFunc(user);
            return user;
        }));
    }

    dataFunc(user){
        const decoded_permission = jwt_decode(user.x_api_token);
        const decoded_user = jwt_decode(user.token);
        user.permissioninfo= decoded_permission["sub"];
        user.userdetails = decoded_user["sub"];

        // store user details and jwt token in session storage to keep user logged in between page refreshes
        const userData = sessionStorage.setItem('currentLoginUser', JSON.stringify(user));
        this.sharedService.userId = user.userdetails?.idUser;
        this.docService.userId = user.userdetails?.idUser;
        this.chartService.userId = user.userdetails?.idUser;
        this.currentUserSubject.next(user);
        environment1.password = this.currentUserValue.token;
    }
    async logout() {
        // remove user from local storage to log user out
        if(this.msalService.instance.getActiveAccount() != null || localStorage.getItem("msal.account.keys")){
            localStorage.removeItem("msal.account.keys");
            this.msalService.instance.setActiveAccount(null);
            this.msalService.logout();
        }
        if(localStorage.getItem("ga.account.keys")){
            localStorage.removeItem("ga.account.keys");
            this.googleService.signOut();
        }
        let userid = JSON.parse(sessionStorage.getItem('currentLoginUser'))?.userdetails?.idUser;
        await this.http.post(`${this.apiUrl}/${this.apiVersion}/logout/${userid}`,null).toPromise();
        this.router.navigate(['/']);
        sessionStorage.removeItem('currentLoginUser');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('messageBox');
        sessionStorage.clear();
        this.currentUserSubject.next(null);
        setTimeout(() => {
            location.reload();
        }, 500);
    }

    refreshToken(){
        let data = {
            "grant_type": "refresh_token",
            "refresh_token": this.currentUserValue?.refresh_token
          }
          
       return this.http.post(`${this.apiUrl}/${this.apiVersion}/token`,data).pipe(
        map((data:any)=>{
            const newAccessToken = data.token;
            this.currentUserValue.token = newAccessToken;
            sessionStorage.setItem('currentLoginUser', JSON.stringify(this.currentUserValue))
        })
       );
    }
}