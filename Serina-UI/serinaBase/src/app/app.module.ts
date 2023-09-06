import { environment, environment1 } from './../environments/environment.prod';
import { MainContentModule } from './main-content/main-content.module';
import { BaseModule } from './base/base.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';

import {MatIconModule} from '@angular/material/icon';
import { ErrorInterceptor } from './interceptor/errorInterceptor';
import { JwtInterceptor } from './interceptor/Jwt.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {MSAL_INSTANCE, MsalModule, MsalService} from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
// import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
// export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = environment1;

// import { MqttModule, IMqttServiceOptions } from "ngx-mqtt";
// export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
//   hostname: '52.149.208.175',
//   port: 61614,
//   path: '',
//   clientId: environment.userData?.userdetails?.idUser.toString(),
//   username:environment.userName,
//   password:environment.userData?.token
// }

export function MSALInstanceFactory(): IPublicClientApplication{
  return new PublicClientApplication({
    auth: {
      clientId : "44e503fe-f768-46f8-99bf-803d4a2cf62d",
      redirectUri: location.href.split("#")[0]

    }
  })
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    BaseModule,
    MainContentModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    MsalModule
  ],
  providers: [,
    {provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory},
    MsalService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
