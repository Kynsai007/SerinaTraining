import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/dataStore/data.service';
import { ServiceInvoiceService } from './../../services/serviceBased/service-invoice.service';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit,  AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {  Location } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { PermissionService } from 'src/app/services/permission.service';


export interface UserData {
  name: string;
  contact: string;
  lastModified: string;
  status: string;
  emailId: string;
  id: string;
}

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit, AfterViewInit {
  @Input() VenderFullData: any;
  users: UserData[] = []

  vendorData = []
  VendorAccount = []

  openFilter: boolean = false;

  selectedVender: string;
  selectedVenderPriceList: any;
  selectedCountry: any;

  selectedCustomer: string;
  venderdetails: any;
  initialViewVendor: boolean;
  vendorList: boolean = true;

  vendorDetailsForm: FormGroup;
  submitted = false;
  selectedCities1: string[];
  visibleSidebar2;
  savedataboolean: boolean;
  first = 0;

  rows = 10;

  vendorreaddata = [];
  vendoraccountreaddata: Object;
  vendorbyidreaddata: Object;
  showPaginator: boolean;

  vendorUpdateName = '';
  vendorUpdateCompany = '';
  vendorUpdateVenderCode = '';
  vendorUpdateEmail;
  vendorUpdateDesc;
  vendorUpdateContact;
  vendorUpdateAddress;
  vendorUpdateCity;
  vendorUpdateCountry;

  editable: boolean = false;
  savebooleansp = false;
  loading: boolean;
  vendors: any;
  totalRecords: any;
  entity: any;
  entityFilterData: any[];
  vendorsSubscription:Subscription;
  vendorsListData = [];
  offsetCount=1;
  APIParams: string;
  selectedEntityId: any = 'All';
  vendorNameForSearch: any;
  partyType:string;
  ap_boolean: any;

  constructor(private fb: FormBuilder,
    private route: Router,
    private sharedService: SharedService,
    private serviceProviderService : ServiceInvoiceService,
    private SpinnerService: NgxSpinnerService,
    private permissionService : PermissionService,
    private dataService : DataService,
    private router :Router) {

  }

  ngOnInit(): void {
    if(this.permissionService.vendor_SP_PageAccess == true){
      this.initialViewVendor = this.sharedService.initialViewVendorBoolean;
      this.ap_boolean = this.dataService.ap_boolean;
      if(this.dataService.ap_boolean){
        this.partyType = 'vendor';
      } else {
        this.partyType = 'customer';
      }
      this.vendorreaddata = this.dataService.vendorsListData;
      this.entityFilterData = this.dataService.vendorsListData;
      if(this.vendorreaddata.length <= 0){
        this.APIParams = `?partyType=${this.partyType}&offset=1&limit=50`;
        this.DisplayVendorDetails(this.APIParams);
      }
      if(this.vendorreaddata.length > 10){
        this.showPaginator = true;
      } else {
        this.showPaginator = false;
      }
      this.getEntitySummary();
    } else{
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }


  }
  ngAfterViewInit() {
    // this.DisplayVendorAccountDetails();
    // this.DisplayVendorDetailsById()
  }


  filterData() {
    this.openFilter = !this.openFilter;
  }
  toCreateNew() {
    // this.vendorDetailsForm.reset();
    this.vendorList = false;
    this.savedataboolean = true;
  }
  viewFullDetails(e) {
    // this.route.navigate(['/customer/vendor/vendorDetails'])
    this.initialViewVendor = false;
    this.sharedService.initialViewVendorBoolean = false;
    this.sharedService.vendorFullDetails = e;
    this.venderdetails = e
    this.sharedService.vendorID = e.idVendor;
    // this.DisplayVendorAccountDetails();
    // this.DisplayVendorDetailsById();
    // this.DisplayVendorDetails();
  }
  colseDiv(value) {
    this.initialViewVendor = value;
    if (value === true) {
      this.ngOnInit();
    }
  }

  onCancel() {
    this.editable = false;
    this.savebooleansp = false;
  }
  selectedPayment(e) {
  }
  onSelectCol(e, value) {
    if (e.target.checked == true) {
    }
  }

  editVenderData(e) {
    this.vendorList = false;
  }
  onEdit() {
    this.editable = true;
    this.savebooleansp = true;
  }
  DisplayVendorDetails(data) {
    this.SpinnerService.show();

    this.sharedService.readvendors(data).subscribe((data: any) => {
      let pushArray = [];
      let onboardBoolean:boolean;
      data.forEach(ele=>{
        let mergedData = {...ele.Entity,...ele.Vendor};
        if(ele.OnboardedStatus == 'Onboarded'){
          onboardBoolean = true
        } else {
          onboardBoolean = false
        }
        mergedData.OnboardedStatus = onboardBoolean;
        mergedData.idVendorAccount = ele.idVendorAccount;
        pushArray.push(mergedData);
      })
      this.vendorreaddata = this.dataService.vendorsListData.concat(pushArray);
      this.dataService.vendorsListData = this.vendorreaddata;
      this.entityFilterData = this.vendorreaddata; 
      // this.totalRecords = this.vendorreaddata.length;
      if (this.vendorreaddata.length > 10) {
        this.showPaginator = true;
      }
      this.SpinnerService.hide();
    });
  }
  getEntitySummary() {
    this.serviceProviderService.getSummaryEntity().subscribe((data: any) => {
      this.entity = data.result;
      this.entity.unshift({
        EntityName: "All",
        idEntity: null
      })
    });
  }

  filter(value) {
    this.dataService.vendorsListData = [];
    this.dataService.offsetCount = 1;
    this.vendorreaddata = this.entityFilterData;
    this.selectedEntityId = value.idEntity;
    this.filtersForAPI(50);
  }
  paginate(event) {
    this.first = event.first;
    this.dataService.vendorPaginationFirst = this.first;
    this.dataService.vendorPaginationRowLength = event.rows;
    if(this.first >= this.dataService.pageCountVariable){
      this.dataService.pageCountVariable = event.first;
      this.dataService.offsetCount++
      this.filtersForAPI(50);
    }
  }
  filterString(str){
    this.dataService.vendorsListData = [];
    this.vendorNameForSearch = str;
    this.dataService.offsetCount = 1;
    this.filtersForAPI(50);
  }
  filtersForAPI(limit) {
    if (this.selectedEntityId != 'All' && this.selectedEntityId) {
      this.APIParams = `?partyType=${this.partyType}&ent_id=${this.selectedEntityId}&offset=${this.dataService.offsetCount}&limit=${limit}`;
      this.DisplayVendorDetails(this.APIParams);
    }else if (this.vendorNameForSearch && this.vendorNameForSearch != '') {
      this.APIParams = `?partyType=${this.partyType}&ven_code=${this.vendorNameForSearch}&offset=${this.dataService.offsetCount}&limit=${limit}`;
      this.DisplayVendorDetails(this.APIParams);
    } else {
      this.APIParams = `?partyType=${this.partyType}&offset=${this.dataService.offsetCount}&limit=${limit}`;
      this.DisplayVendorDetails(this.APIParams);
    }
  }
}