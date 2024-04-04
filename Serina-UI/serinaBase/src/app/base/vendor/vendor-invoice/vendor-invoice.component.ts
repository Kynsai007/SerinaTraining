import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'vendor-invoice',
  templateUrl: './vendor-invoice.component.html',
  styleUrls: ['./vendor-invoice.component.scss']
})
export class VendorInvoiceComponent implements OnInit,OnChanges {
  invoiceList = [];
  accountList = [];
  @Input() supplier_data:any;
  @Input() supplier_id:any;
  @Input() masterSubTabName:string;
  accountsSidebar:boolean = false;
  elementList: { id: number; name: string; }[];
  submitted: boolean;
  addSpAccountBoolean: boolean = true;
  spAccount_name: any;
  SpAccountDetails: FormGroup;
  spDetails: any;
  source: string;
  EBS_costData: {};
  EDP_costData: {};
  CostArray: any[];
  mask: (string | RegExp)[];
  costBoolean: boolean;
  allSearchInvoiceString: any;
  disableCostAllocationBoolean: boolean;
  EditSpAccountBoolean: boolean;
  entityBodyList: any;
  entityList: any;
  approverList: any;
  OPUnits: any;
  readOnlyForm: boolean;
  accounts: FormArray;
  costAllocation: FormArray;
  header_Ac = 'Add Service Provider Account';
  offsetCount = 1;
  accountsArray = [];
  ERPname:string;

  constructor(private sharedService: SharedService,
    public dataService : DataService,
    private SpinnerService : NgxSpinnerService,
    private fb: FormBuilder,
    private datePipe : DatePipe,
    private alertService : AlertService,
    public router : Router) { }

  ngOnInit(): void {
    this.SpAccountDetails = this.initialForm();
    this.ERPname = this.dataService.configData.erpname;
  }

  ngOnChanges(changes:SimpleChanges){
      if(this.dataService.masterTabName == 'vendor' && this.supplier_data?.idVendor){
        this.sharedService.vendorID = this.supplier_data?.idVendor;
        this.readVendorInvoiceData();
        this.DisplayVendorAccountDetails();
      } else if(this.dataService.masterTabName == 'service' && this.supplier_data?.idServiceProvider) {
        this.sharedService.spID = this.supplier_data.idServiceProvider;
        this.spDetails = this.supplier_data;
        if(this.dataService.masterSubTabName == 'invoice'){
          this.DisplaySpInvoice();
        } else if(this.dataService.masterSubTabName == 'account'){
          this.SpAccountDetails = this.initialForm();
          this.toGetEntity();
          this.accountList = [];
          this.offsetCount = 1;
          this.SPAccountDetails('&offset=1&limit=50');
        }
        this.getOPunits();
        // this.getApprover();
        this.prepareCostData();
        this.getElementData(this.spDetails);
      }
  }

  readVendorInvoiceData() {
    this.SpinnerService.show();
    this.sharedService.readVendorInvoices().subscribe((data: any) => {
      let pushedVendorInvoices = [];
      data.data.forEach(element => {
        let arrayVendorInvoices = { ...element.Entity, ...element.EntityBody, ...element.Document, ...element.Vendor, ...element.VendorAccount };
        arrayVendorInvoices.docstatus = element.docstatus;
        pushedVendorInvoices.push(arrayVendorInvoices)
      });
      this.invoiceList = pushedVendorInvoices;
      this.SpinnerService.hide();
    })
  }

  DisplayVendorAccountDetails() {
    this.SpinnerService.show();
    this.sharedService.readvendoraccountSite().subscribe((data:any) => {
      if(data.length >0){
        let res = [];
        data.forEach(element => {
         let response = {...element.Entity,...element.VendorAccount};
         res.push(response);
        });
        this.accountList = res;
      }
      // if (this.accountList.length > 10) {
      //   this.showPaginator = true;
      // }
      this.SpinnerService.hide();
    })
  }

  DisplaySpInvoice() {
    this.SpinnerService.show();
    this.sharedService.readServiceInvoice().subscribe((data: any) => {
      const invoicePushedArray = [];
      data.data.forEach((element) => {
        let invoiceData = {
          ...element.Document,
          ...element.Entity,
          ...element.EntityBody,
          ...element.ServiceProvider,
          ...element.ServiceAccount,
        };
        invoiceData.docstatus = element.docstatus;
        invoicePushedArray.push(invoiceData);
      });
      this.invoiceList = invoicePushedArray;
      this.SpinnerService.hide();
    });
  }

  SPAccountDetails(apiParam) {
    this.SpinnerService.show();
    this.sharedService.readserviceprovideraccount(`sp_id=${this.sharedService.spID}`,apiParam).subscribe((data: any) => {
      const accountsPushedArray = [];
      data.forEach((element) => {
        let mergedData = {
          ...element.Credentials,
          ...element.Entity,
          ...element.EntityBody,
          ...element.ServiceAccount,
          ...element.ServiceProvider
        };
        accountsPushedArray.push(mergedData);
      });
      // this.accountList.push();
      this.accountsArray = this.accountList.concat(accountsPushedArray);
      this.accountList = this.accountsArray;
      this.SpinnerService.hide();
    },err=>{
      this.SpinnerService.hide();
    });
  }

  accntSearch(val) {
    this.SpinnerService.show();
    let spAccount = []
    this.sharedService.readserviceprovideraccount(`sp_acc_number=${val}`,'').subscribe((data: any) => {
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
        this.updateSpAccount(spAccount[0]);
        this.sharedService.spAccountSub.next(spAccount);
      } else {
        this.alertService.error_alert(`${val} account is not exist in the Serina`)
      }
      this.SpinnerService.hide();
    });
  }

  getElementData(e){
    if((e.ServiceProviderName =='Dubai Electricity & Water Authority') || e.ServiceProviderName =='DUBAI ELECTRICITY AND WATER AUTHORITY'){
      this.elementList = [
        { id: 1, name: 'Water'},
        { id: 2, name: 'Electricity'},
        { id: 3, name: 'Housing'},
        { id: 4, name: 'Sewerage'},
        { id: 5, name: 'Others'},
      ]
    } else if(e.ServiceProviderName =='EMIRATES INTEGRATED TELECOMMUNICATIONS PJSC(DU)'){
      this.elementList = [
        { id: 1, name: 'Usage charges'},
        { id: 2, name: 'Monthly Fixed Charges'},
        { id: 3, name: 'TV Channels'},
        { id: 4, name: 'Others'}
      ]
    } else if(e.ServiceProviderName =='ETISALAT'){
      this.elementList = [
        { id: 1, name: 'Usage_Credit'},
        { id: 2, name: 'International_Calls'},
        { id: 3, name: 'Others'}
      ]
    } else if(e.EntityName.includes('Cenomi')){
      this.elementList = [
        { id: 1, name: 'Electricity'},
        { id: 2, name: 'Water'},
        { id: 3, name: 'GAS'},
        { id: 4, name: 'Government (GOSI)'},
        { id: 5, name: 'Government (With holding tax)'},
        { id: 6, name: 'Legal'},
        { id: 7, name: 'Others'},
      ]
    } else {
      this.elementList = [
        { id: 1, name: 'Electricity'},
        { id: 2, name: 'Water'},
        { id: 3, name: 'GAS'},
        { id: 4, name: 'Government (GOSI)'},
        { id: 5, name: 'Government (With holding tax)'},
        { id: 6, name: 'Legal'},
        { id: 7, name: 'Others'},
      ]
    }
  }
  initialForm() {
    return this.fb.group({
      entityID: [{ value: this.spDetails?.idEntity }],
      serviceProviderNameAccount: [
        { value: this.spDetails?.ServiceProviderName},
      ],
      Email: [''],
      UserName: ['', Validators.required],
      LogSecret: ['', Validators.required],
      URL: ['', Validators.required],
      subKeyWords: [''],
      Account: ['', Validators.required],
      MeterNumber: [''],
      Address: '',
      ScheduleDateTime: Date,
      isActive: [true],
      LocationCode: [''],
      operatingUnit: '',
      approver: [{ value: this.spDetails?.ApproverID}],
      costDetails: this.fb.array([]),
    });
  }
  get f() {
    return this.SpAccountDetails?.controls;
  }
  // add account
  acDetails(): FormArray {
    return this.SpAccountDetails?.get('acDetails') as FormArray;
  }

  newacDetails(): FormGroup {
    return this.fb.group({
      Account: ['', Validators.required],
      MeterNumber: ['', Validators.required],
      LocationCode: ['', Validators.required],
      Address: '',
      day: '',
    });
  }

  addacDetails() {
    if (this.addSpAccountBoolean == true) {
      this.submitted = true;
      this.acDetails().push(this.newacDetails());
    } else {
      this.acDetails().push(this.newacDetails());
    }
  }

  removeQuantity(i: number) {
    this.acDetails().removeAt(i);
  }

  // add cost details
  costDetails(): FormArray {
    return this.SpAccountDetails.get('costDetails') as FormArray;
  }
  prepareCostData() {
    this.EBS_costData = {
      entityBodyID: ['', Validators.required],
      costCenter: ['', Validators.required],
      project: '',
      departmentID: [''],
      elementFactor: [''],
      interco: [''],
      mainAccount: ['', Validators.required],
      isActive_Alloc: [1],
      naturalAccountWater: '',
      naturalAccountHousing: '',
      product: '',
      segments: [''],
      bsMovements: [''],
      fixedAssetDepartment: [''],
      fixedAssetGroup: [''],
      Element: ['', Validators.required],
    };
    this.EDP_costData = {
      entityBodyID: ['', Validators.required],
      costCenter: ['', Validators.required],
      project: '',
      departmentID: [''],
      elementFactor: [''],
      interco: [''],
      isActive_Alloc: [1],
      mainAccount: ['', Validators.required],
      segments: '',
      bsMovements: '',
      fixedAssetDepartment: '',
      fixedAssetGroup: '',
      product: '',
      Element: ['', Validators.required],
    };
  }

  newcostDetails(): FormGroup {
    if (this.source == ('EBS' || 'ebs')) {
      return this.fb.group(this.EBS_costData);
    } else {
      return this.fb.group(this.EDP_costData);
    }
  }

  addcostDetails() {
    this.costBoolean = true;
    this.costDetails().push(this.newcostDetails());
  }

  removecostDetails(i: number) {
    if (confirm('Are you sure you want to delete!')) {
      this.costDetails().removeAt(i);
    }
  }
  toCreateNewSPAccount() {
    let sp_acct = {
      Account: this.SpAccountDetails.value.Account,
      entityID: +this.SpAccountDetails.value.entityID,
      Email: this.SpAccountDetails.value.Email || '',
      MeterNumber: this.SpAccountDetails.value.MeterNumber || '',
      LocationCode: this.SpAccountDetails.value.LocationCode,
      Address: this.SpAccountDetails.value.Address || '',
      operatingUnit: this.SpAccountDetails.value.operatingUnit || '',
      approver: this.SpAccountDetails.value.approver || '',
      isActive: this.SpAccountDetails.value.isActive,
    };
    let sp_shed = {
      ScheduleDateTime: this.SpAccountDetails.value.ScheduleDateTime,
    };
    let sp_cred = {
      UserName: this.SpAccountDetails.value.UserName,
      LogSecret: this.SpAccountDetails.value.LogSecret,
      URL: this.SpAccountDetails.value.URL,
      entityID: +this.SpAccountDetails.value.entityID,
    };
    if (this.addSpAccountBoolean) {
      let costDetailsData = [];
      let elmentArray = [];
      this.SpAccountDetails.value.costDetails.forEach((element, index) => {
        element.entityBodyID = +element.entityBodyID;
        if (element.departmentID != null) {
          element.departmentID = +element.departmentID;
        }
        element.elementFactor = +element.elementFactor;

        elmentArray.push(element.elementFactor);
        let costObject = element;
        costObject.entityID = +this.SpAccountDetails.value.entityID;
        costDetailsData.push(costObject);
      });
      let ele_fact = elmentArray.reduce((a, b) => a + b, 0);

      let spAcountdata = {
        n_sp_acc: sp_acct,
        n_sp_sched: sp_shed,
        n_sp_cst: costDetailsData,
        n_cred: sp_cred,
      };
      // if (ele_fact == 100) {
      this.sharedService
        .createserviceprovideraccount(JSON.stringify(spAcountdata))
        .subscribe(
          (data: any) => {
            this.alertService.success_alert("Created successfully")
            // this.createspAccount = false;
            this.accountList = [];
            this.offsetCount = 1;
            this.SPAccountDetails('&offset=1&limit=50');
            this.SpAccountDetails = this.initialForm();
            this.accounts = new FormArray([]);
            this.costAllocation = new FormArray([]);
            this.SpAccountDetails.reset();
          },
          (error) => {
            this.error("Server error");
          }
        );
      // } else {
      //   this.errorObject.detail = "Please add element factor properly"
      //   this.messageService.add(this.errorObject);
      // }
    }
    if (this.EditSpAccountBoolean) {
      let costDetailsData = [];
      let u_elmentArray = [];
      this.SpAccountDetails?.value?.costDetails?.forEach((element, index) => {
        const { entityBodyID, departmentID, elementFactor } = element;
        element.entityBodyID = +entityBodyID;
        if (element.departmentID != null) {
          element.departmentID = +departmentID;
        }
        element.elementFactor = +elementFactor;
        u_elmentArray.push(element.elementFactor);
        let u_costObject = element;
        u_costObject.entityID = +this.SpAccountDetails.value.entityID;
        if (index < this.CostArray.length) {
          u_costObject.idAccountCostAllocation =
            this.CostArray[index].idAccountCostAllocation;
        } else {
          u_costObject.idAccountCostAllocation = null;
        }
        costDetailsData.push(u_costObject);
      });
      let u_ele_fact = u_elmentArray.reduce((a, b) => a + b, 0);
      // sp_acct['isActive'] = this.SpAccountDatails.value.isActive;
      let spUpdateAcountdata = {
        u_sp_acc: sp_acct,
        u_sp_sch: sp_shed,
        u_sp_cst_aloc: costDetailsData,
        u_cred: sp_cred,
      };
      // if (u_ele_fact == 100) {
      this.sharedService
        .updateSpAccount(JSON.stringify(spUpdateAcountdata))
        .subscribe(
          (data) => {
            // this.messageService.add(this.alertService.updateObject);
            this.alertService.success_alert("Successfully updated")
            // this.createspAccount = false;
            this.accountList = [];
            this.offsetCount = 1;
            this.SPAccountDetails('&offset=1&limit=50');
            this.SpAccountDetails = this.initialForm();
            this.accounts = new FormArray([]);
            this.costAllocation = new FormArray([]);
            this.SpAccountDetails.reset();
            this.accountsSidebar = false;
          },
          (error) => {
            this.error("Server error");
          }
        );
      // } else {
      //   this.errorObject.detail = "Please add element factor properly"
      //   this.messageService.add(this.errorObject);
      // }
    }
  }

  updateSpAccount(data) {
    // if(data.serviceProviderID == 14){
    //   this.disableCostAllocationBoolean = true;
    // } else {
    //   this.disableCostAllocationBoolean = false;
    // }
    
    if(this.dataService.masterTabName != 'vendor'){
      this.accountsSidebar = true;
      this.header_Ac = 'Edit Service Provider Account'
      this.sharedService.spAccountID = data.idServiceAccount;
      // this.selectedEntityBodyId = data.entityBodyID;
      // this.selectedEntityDeptId = data.departmentID;
      // this.previousAccountData = data;
  
      if (data.EntityName) {
        this.selectedEntity(data.entityID);
        if (data.EntityBodyName) {
          this.selectedEntityBody(data.idEntityBody);
        }
      }
  
      this.entityBodyList = [];
      // this.entityDeptList = [];
  
      let _cost;
      this.CostArray = [];
      data.account_cost.forEach((element) => {
        this.addcostDetails();
        const {
          entityBodyID,
          costCenter,
          project,
          departmentID,
          elementFactor,
          interco,
          mainAccount,
          segments,
          bsMovements,
          fixedAssetDepartment,
          fixedAssetGroup,
          naturalAccountWater,
          naturalAccountHousing,
          product,
          idAccountCostAllocation,
          isActive_Alloc,
          Element
        } = element.AccountCostAllocation;
        _cost = {
          entityBodyID: entityBodyID,
          costCenter: costCenter,
          project: project,
          Element: Element,
          elementFactor: elementFactor,
          interco: interco,
          mainAccount: mainAccount,
          naturalAccountWater: naturalAccountWater,
          naturalAccountHousing: naturalAccountHousing,
          product: product,
          segments: segments,
          bsMovements: bsMovements,
          fixedAssetDepartment: fixedAssetDepartment,
          fixedAssetGroup: fixedAssetGroup,
          isActive_Alloc: isActive_Alloc,
          idAccountCostAllocation: idAccountCostAllocation,
        };
        this.CostArray.push(_cost);
      });
  
      // const FindSpName = this.supplier_data.filter((element) => {
      //   return element.idServiceProvider == data.serviceProviderID;
      // });
      const spName = this.supplier_data?.ServiceProviderName;
      if (data.isActive == 1) {
        this.readOnlyForm = false;
      } else {
        this.readOnlyForm = true;
      }
      this.SpAccountDetails.controls['isActive'].enable();
      // this.SpAccountDatails.controls['Account'].disable();
      this.SpAccountDetails.patchValue({
        Account: data.Account,
        entityID: data.entityID,
        serviceProviderNameAccount: data.ServiceProviderName,
        serviceProviderID: data.serviceProviderID,
        Email: data.Email,
        URL: data.URL,
        UserName: data.UserName,
        LogSecret: data.LogSecret,
        ScheduleDateTime: this.datePipe.transform(
          data.account_schedule.ScheduleDateTime,
          'yyyy-MM-dd'
        ),
        MeterNumber: data.MeterNumber,
        LocationCode: data.LocationCode,
        Address: data.Address,
        operatingUnit: data.operatingUnit,
        approver: data.approver,
        isActive: data.isActive,
        costDetails: this.CostArray,
      });
  
      // this.sharedService.spListBoolean = false;
      this.addSpAccountBoolean = false;
      this.EditSpAccountBoolean = true;
    }

  }

  accontAtiveToggle(val) {
    if (val === false) {
      this.readOnlyForm = true;
    } else {
      this.readOnlyForm = false;
    }
    this.SpAccountDetails.controls['isActive'].enable();
    // this.SpAccountDatails.controls['Account'].disable();
  }

  getOPunits(){
    this.sharedService.readOPUnits().subscribe((data:any)=>{
      this.OPUnits = data;
    })
  }

  // getApprover(){
  //   this.sharedService.readApprovers().subscribe((data:any)=>{
  //     this.approverList = data;
  //   })
  // }
  toGetEntity() {
    this.entityList = [];
    this.sharedService.getEntityDept().subscribe((data: any) => {
      this.entityList = data;
    });
  }
  selectedEntity(value) {
    // this.entityBodyList = [];
    // this.entityDeptList = [];
    let item = this.entityList.filter((item) => {
      return value == item.idEntity;
    });
    this.source = item[0]?.sourceSystemType;
    this.sharedService.selectedEntityId = value;
    // this.selectedEntityId = value;
    this.sharedService.getEntitybody().subscribe((data: any) => {
      this.entityBodyList = data;
    });
  }
  selectedEntityBody(value) {
    // this.entityDeptList = [];
    if (this.entityBodyList) {
      let item = this.entityBodyList.filter((item) => {
        return value == item.idEntityBody;
      });
      if (item.length > 0) {
        // this.entityDeptList = item[0].department;
        // this.selectedEntityBodyId = item[0]['idEntityBody'];
      }
    }
  }
  onCancelAccount() {
    // this.vendorList = true;
    // this.sharedService.spListBoolean = true;
    // this.createspAccount = false;
    this.accountsSidebar = false;
    this.submitted = false;
    this.SpAccountDetails = this.initialForm();
    this.SpAccountDetails.reset();
  }
  
  onClickCard(id){
    if(this.router.url.includes('vendorDetails')){
      this.router.navigate([`/customer/vendor/vendorDetails/InvoiceDetails/${id}`]);
    } else {
      this.router.navigate([`/customer/vendor/serviceDetails/serviceInvoice/${id}`]);
    }
  }

  error(msg) {
   this.alertService.error_alert(msg);
  }

  toCreateNewAccount() {
    this.header_Ac = 'Add Service Provider Account';
    this.accountsSidebar = true;
    this.addSpAccountBoolean = true;
    this.EditSpAccountBoolean = false;
    this.SpAccountDetails.patchValue({
      serviceProviderNameAccount: this.spDetails.ServiceProviderName,
      serviceProviderID: this.sharedService.spID,
      entityID: this.spDetails.idEntity,
      isActive: true,
      URL: this.spDetails.default_url
    });
    this.selectedEntity(this.spDetails.idEntity);
  }
  onScroll(){
    this.offsetCount++
    this.SPAccountDetails(`&offset=${this.offsetCount}&limit=50`);
  }
}
