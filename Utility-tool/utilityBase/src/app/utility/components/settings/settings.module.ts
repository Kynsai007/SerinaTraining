import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ChipsModule} from 'primeng/chips';
import { CronEditorModule } from 'ngx-cron-editor';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UplaodListenerComponent } from './uplaod-listener/uplaod-listener.component';
import { SharepointListenerComponent } from './sharepoint-listener/sharepoint-listener.component';
import { EntityRoutingComponent } from './entity-routing/entity-routing.component';
import { ApprovalSettingsComponent } from './configuration/approval-settings/approval-settings.component';
import { TriggerSettingsComponent } from './configuration/trigger-settings/trigger-settings.component';


@NgModule({
  declarations: [SettingsPageComponent, ConfigurationComponent, ChangePasswordComponent, UplaodListenerComponent, SharepointListenerComponent, EntityRoutingComponent, ApprovalSettingsComponent, TriggerSettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AutoCompleteModule,
    ChipsModule,
    CronEditorModule
  ]
})
export class SettingsModule { }
