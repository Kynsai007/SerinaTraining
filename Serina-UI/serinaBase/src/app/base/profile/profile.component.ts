import { DataService } from 'src/app/services/dataStore/data.service';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loginUser: any;
  editable: boolean = false;
  @ViewChild('profile') profile: NgForm;
  landingPageObj = [];
  uploadOpt = [
    { id: 1, page: 'Ideal Upload' },
    { id: 2, page: 'Quick Upload' },
    { id: 3, page: 'Both' },
  ];;
  username: string;
  vendorInvoiceAccess: any;
  constructor(private authService: AuthenticationService,
    private settingService: SettingsService,
    private alert: AlertService,
    private dataStoreService: DataService) { }

  ngOnInit(): void {
    this.loginUser = this.authService.currentUserValue;
    this.username = JSON.parse(sessionStorage.getItem('username'));
    this.vendorInvoiceAccess = this.dataStoreService.configData.vendorInvoices;
    this.config();
  }
  onEdit() {
    this.editable = true;
  }
  onSave(val) {

    this.settingService.update_profile(this.profile.value).subscribe((data: any) => {
      this.alert.success_alert("Profile Updated, Please re-login to check the changes.");
      this.editable = false;

    }, err => {
      this.alert.error_alert("Server error");
    })
  }
  onCancel() {
    this.editable = false;
  }
  config(){
    // if(this.vendorInvoiceAccess){
      this.landingPageObj = [
        { id: 1, page: 'Upload' },
        { id: 2, page: 'Document Status' },
        { id: 3, page: 'Dashboard' },
        { id: 4, page: 'Exception' },
        { id: 5, page: 'Service/Vendor master' },
      ];
    // } else {
    //   this.landingPageObj = [
    //     { id: 2, page: 'Document Status' },
    //     { id: 3, page: 'Dashboard' },
    //     { id: 4, page: 'Exception' },
    //   ];
    // }
  }

}
