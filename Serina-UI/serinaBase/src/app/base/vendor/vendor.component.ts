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

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit, AfterViewInit {

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

  vendors_list = [];
  vendoraccountreaddata: Object;
  vendorbyidreaddata: Object;
  showPaginator: boolean;

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
  isDesktop: boolean;
  fst: number = 0;

  tabName:string;
  itemsList = [];
  searchTextVendor: string;
  searchTextSP: string;
  supplier_id:number;
  SP_list: any[];
  sub_tab2 = 'Vendor Sites';
  sub_tab3 = 'Vendor Details';
  supplier_data: any;
  vendorInvoiceAccess: boolean;
  serviceInvoiceAccess: boolean;
  masterSubTabName: any;

  constructor(
    private route: Router,
    private sharedService: SharedService,
    private serviceProviderService : ServiceInvoiceService,
    private SpinnerService: NgxSpinnerService,
    private permissionService : PermissionService,
    private dataService : DataService,
    private _location : Location,
    private router :Router) {

  }

  ngOnInit(): void {
    if(this.permissionService.vendor_SP_PageAccess == true){
      this.isDesktop = this.dataService.isDesktop;
      this.vendorInvoiceAccess = this.dataService.configData.vendorInvoices;
      this.serviceInvoiceAccess = this.dataService.configData.serviceInvoices;
      this.routerDetails();

      if(this.dataService.ap_boolean){
        this.partyType = 'vendor';
      } else {
        this.partyType = 'customer';
      }
      this.vendors_list = this.dataService?.vendorsListData;
      this.entityFilterData = this.dataService?.vendorsListData;
      if(this.vendors_list.length <= 10 && this.vendorInvoiceAccess){
        // this.tabName = 'vendor';
        this.APIParams = `?partyType=${this.partyType}&offset=1&limit=50`;
        this.DisplayVendorDetails(this.APIParams);
      }
      // if(this.vendors_list.length > 10 && this.isDesktop){
      //   this.showPaginator = true;
      // } else {
      //   this.showPaginator = false;
      // }
      // if(!this.vendorInvoiceAccess && this.serviceInvoiceAccess){
      //   this.tabName = 'service';
      // }
      this.getServicesList();
      this.getEntitySummary();
      this.dataService.masterTabName = this.tabName;
    } else{
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }


  }
  routerDetails(){
    if(this.router.url.includes('vendorDetails') && this.vendorInvoiceAccess){
      this.tabName = 'vendor';
      this.vendorTabNames();
    } else{
      this.tabName = 'service';
      this.serviceTabNames();
    }
  }
  ngAfterViewInit() {
    // this.DisplayVendorAccountDetails();
    // this.DisplayVendorDetailsById()
  }

  DisplayVendorDetails(data) {
    this.SpinnerService.show();

    this.sharedService.readvendors(data).subscribe((data: any) => {
      let pushArray = [];
      let onboardBoolean:boolean;
      data.forEach(ele=>{
        let mergedData = {...ele.Entity,...ele.Vendor};
        // if(ele.OnboardedStatus == 'Onboarded'){
        //   onboardBoolean = true
        // } else {
        //   onboardBoolean = false
        // }
        // mergedData.OnboardedStatus = onboardBoolean;
        mergedData.OnboardedStatus = ele.OnboardedStatus;
        mergedData.idVendorAccount = ele.idVendorAccount;
        pushArray.push(mergedData);
      })
      this.vendors_list = this.dataService.vendorsListData.concat(pushArray);
      this.dataService.vendorsListData = this.vendors_list;
      this.entityFilterData = this.vendors_list;
      this.supplier_data = this.vendors_list[0];
      this.supplier_id = this.vendors_list[0].idVendor;
      // this.totalRecords = this.vendors_list.length;
      if (this.vendors_list.length > 10 && this.isDesktop) {
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
    this.vendors_list = this.entityFilterData;
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
  onScroll(){
    this.fst+10;
    let evnt = {
      first: this.fst,
      rows : 50
    }
    // if(!this.isDesktop){
    this.paginate(evnt);
    //    console.log('scrolled, Mobile mode');
    // } else {
    //   console.log('Desktop mode');
    // }
  }
  onTabChange(str) {
    this.tabName = str;
    this.dataService.masterTabName = str;
    if(str == 'vendor'){
      this.router.navigate(['/customer/vendor/vendorDetails']);
      this.supplier_data = this.vendors_list[0];
      this.supplier_id = this.vendors_list[0]?.idVendor;
      this.vendorTabNames();
    } else if (str == 'service') {
      this.router.navigate(['/customer/vendor/ServiceDetails']);
      this.supplier_data = this.SP_list[0];
      this.supplier_id = this.SP_list[0]?.idServiceProvider;
      this.serviceTabNames();
    }
  }
  vendorTabNames(){
    this.sub_tab2 = 'Vendor Sites';
    this.sub_tab3 = 'Vendor Details';
  }
  serviceTabNames(){
    this.sub_tab2 = 'Account numbers';
    this.sub_tab3 = 'Service Details';
  }
  onSubTabChange(str){
    this.dataService.masterSubTabName = str;
    this.masterSubTabName = str;
  }
  readVendorMasterData(ven_acc_id) {
    this.sharedService.readItemListData(ven_acc_id).subscribe((data:any)=>{
      this.itemsList = data.result;
    })
  }
  onChange(data){
    this.supplier_data = data;
    if(this.tabName == 'vendor'){
      this.supplier_id = data.idVendor;
    } else {
      this.supplier_id = data.idServiceProvider;
    }
  }
  getServicesList() {
    this.SpinnerService.show();
    this.sharedService.readserviceprovider().subscribe((data:any) => {

      let mergerdArray = [];
      data.forEach(element => {
        let spData = {...element.Entity,...element.ServiceProvider};
        mergerdArray.push(spData);
      });
      this.SP_list = mergerdArray;
      this.supplier_data = this.SP_list[0];
      this.supplier_id = this.SP_list[0].idServiceProvider;
      this.SpinnerService.hide();
      var res = [];
      for (var x in this.SP_list) {
        this.SP_list.hasOwnProperty(x) && res.push(this.SP_list[x])
      }
      if (res.length > 10 && this.isDesktop) {
        this.showPaginator = true;
      }
    }, err =>{
      this.SpinnerService.hide();
    })
  }
}