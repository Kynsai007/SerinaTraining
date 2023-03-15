
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit} from '@angular/core';
import { FormArray, FormGroup,} from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import {
  MessageService,
  PrimeNGConfig
} from "primeng/api";
import { PermissionService } from 'src/app/services/permission.service';


export interface UserData {
  name: string;
  uploaded: string;
  lastModified: string;
  status: string;
  emailId: string;
  id: string;
}
export function matcherFunction(url: UrlSegment[]) {
  if (url.length == 1) {
      const path = url[0].path;
       if(path.startsWith('invoice') 
         || path.startsWith('accountDetails') 
         || path.startsWith('itemList')
         || path.startsWith('spDetails') ){
        return {consumed: url};
      }
  }
  return null;
}

@Component({
  selector: 'app-non-po',
  templateUrl: './non-po.component.html',
  styleUrls: ['./non-po.component.scss']
})
export class NonPoComponent implements OnInit {
  viewType = 'invoice'
  users: UserData[];

  openFilter: boolean = false;

  selectedVender: string;
  selectedVenderPriceList: any;
  selectedCountry: any;

  selectedCustomer: string;
  venderdetails: any;
  initialViewVendor: boolean;
  vendorList: boolean;
  createSp: boolean;
  createspAccount: boolean = false;


  providerDetailsForm: FormGroup;
  accounts: FormArray;
  costAllocation: FormArray;
  submitted = false;
  savedatabooleansp: boolean
  first = 0;

  rows = 10;

  p1: number = 1;
  last: number;
  mergedData: any[];
  finalArray = [];
  serviceproviderreaddata: Object;


  entityList: any[];
  entityBodyList: any[];
  entityDeptList: any[];

  editable: boolean = false;
  savebooleansp = false;


  selectedEntityId: number;
  selectedEntityBodyId: number;
  selectedEntityDeptId: number;
  previousAccountData: any;

  activerow:string;

  someParameterValue = null;
  displayAddspDialog:boolean;

  errorObject ={
    severity: "error",
    summary: "error",
    detail: "Something went wrong"
  }
  addObject = {
    severity: "info",
    summary: "Added",
    detail: "Created Successfully"
  }
  updateObject ={
    severity: "info",
    summary: "Updated",
    detail: "Updated Successfully"
  }
  showPaginator: boolean;


  constructor(
    public routeIn: ActivatedRoute,
    private messageService: MessageService,
    private sharedService: SharedService,
    private SpinnerService: NgxSpinnerService,
    private permissionService: PermissionService,
    private router: Router,
    private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
    if (this.permissionService.vendor_SP_PageAccess == true) {
      this.initialViewVendor = this.sharedService.initialViewSpBoolean;
      this.vendorList = this.sharedService.spListBoolean;
      this.venderdetails = this.sharedService.spDetailsArray;
      this.primengConfig.ripple = true;
      this.DisplayServiceProviderDetails();
      this.toGetEntity();
      if (this.initialViewVendor == false) {
        // this.DisplayspAccountDetails();
        // this.DisplaySpDetailsById();
        // this.DisplaySpInvoice();
      }
    } else {
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }

  }

  submitAccountdata() {
  }
  toCreateNew() {
    this.vendorList = false;
    this.sharedService.spListBoolean = false;
    this.savedatabooleansp = true;
  }

  viewFullDetails(e) {
    this.sharedService.initialViewSpBoolean = false
    this.initialViewVendor = this.sharedService.initialViewSpBoolean;
    this.venderdetails = e;
    this.sharedService.spDetailsArray = e;
    this.sharedService.spID = e.idServiceProvider;
  }
  colseDiv() {
    this.sharedService.initialViewSpBoolean = true;
    this.initialViewVendor = this.sharedService.initialViewSpBoolean;
  }
  getDisplayInitialBoolean(value) {
    this.initialViewVendor = value;
    if (value === true) {
      this.ngOnInit();
    }
  }
  displayAddspDialogmethod(value) {
    this.displayAddspDialog = value;
  }

  DisplayServiceProviderDetails() {
    this.SpinnerService.show();
    this.sharedService.readserviceprovider().subscribe((data: any) => {

      let mergerdArray = [];
      data.forEach(element => {
        let spData = { ...element.Entity, ...element.ServiceProvider };
        mergerdArray.push(spData);
      });
      this.serviceproviderreaddata = mergerdArray;
      this.SpinnerService.hide();
      var res = [];
      for (var x in this.serviceproviderreaddata) {
        this.serviceproviderreaddata.hasOwnProperty(x) && res.push(this.serviceproviderreaddata[x])
      }
      if (res.length > 10) {
        this.showPaginator = true;
      }
    }, err => {
      this.SpinnerService.hide();
    })
  }

  toGetEntity() {
    this.entityList = [];
    this.sharedService.getEntityDept().subscribe((data: any) => {
      this.entityList = data;
    })
  }

  accntSearch(val) {
    this.SpinnerService.show();
    let spAccount = []
    this.sharedService.readserviceprovideraccount(`sp_acc_number=${val}`).subscribe((data: any) => {
      data.forEach((element) => {
        let mergedData = {
          ...element.Credentials,
          ...element.Entity,
          ...element.EntityBody,
          ...element.ServiceAccount,
          ...element.ServiceProvider
        };
        spAccount.push(mergedData)
      });
      if (spAccount.length > 0) {
        this.viewFullDetails(spAccount[0])
        this.sharedService.spAccountSub.next(spAccount);
      } else {
        this.errorObject.detail = `${val} account is not exist in the Serina`;
        this.messageService.add(this.errorObject);
      }
      this.SpinnerService.hide();
    });
  }
  ngOnDestroy() {
    this.sharedService.spAccountSub.next([]);
  }

}
