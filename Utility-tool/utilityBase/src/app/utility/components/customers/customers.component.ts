import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared/shared.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customersList = [];
  listLoading: boolean;
  customerForm: FormGroup;
  filterString: string;
  filtered: any[];
  customersListDispaly = [];
  submitted: boolean = false;
  entity: any;
  selectedEntityId: any = 'ALL';
  onboardedCustomerList: any[];
  onboard_status: any = 'ALL';
  onBoardArray = [
    { name: 'ALL', value: 'ALL' },
    { name: 'Onboarded', value: true },
    { name: 'Not-Onboarded', value: false },
  ];
  throttle = 300;
  scrollDistance = 7;
  offsetCount = 1;
  APIParams: string;
  customerNameForSearch: any;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  get f(): { [key: string]: AbstractControl } {
    return this.customerForm.controls;
  }
  
  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      VendorName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contact: [''],
      Address: [''],
      VendorCode: [''],
      Desc: [''],
      Website: [''],
      FirstName: [''],
      LastName: [''],
      Designation: [''],
      TRNNumber: [''],
      TradeLicense: [''],
      VATLicense: [''],
      Account: ['', Validators.required],
      AccountType: ['', Validators.required],
      Country: [''],
      City: [''],
      LocationCode: [''],
      vendorType: ['customer']
    });
    if (this.sharedService.storeCustomersList) {
      this.sharedService.readCustomerData().subscribe((data: any) => {
        this.customersList = data;
        this.customersListDispaly = this.customersList;
      });
    }
    // this.customersList = this.sharedService.customerList;
    if (this.customersList.length == 0) {
      this.APIParams = `?offset=1&limit=100&partyType=customer`;
      this.getCustomerData(this.APIParams);
      // this.readOnboardedCustomersList();
    } else {
      // setTimeout(() => {
      //   this.searchCustomer('');
      // }, 50);
      this.listLoading = true;
    }
    this.selectedEntityId = this.sharedService.selectedEntityId;
    this.onboard_status = this.sharedService.onboard_status;
    this.customerNameForSearch = this.sharedService.customerNameForSearch;
    this.getEntitySummary();
  }
  readOnboardedCustomersList() {
    this.sharedService.getOnboardedData().subscribe((data: any) => {
      let array = [];
      data.forEach((val) => {
        let mergeArray = { ...val.Entity, ...val.Vendor };
        array.push(mergeArray);
      });
      this.onboardedCustomerList = array;
    });
  }

  addOnboardStatus() {
    let array = [];
    this.customersList.forEach((ele) => {
      this.onboardedCustomerList.forEach((val) => {
        if (ele.idVendor === val.idVendor) {
          ele.onboardStatus = true;
        }
      });
      array.push(ele);
    });
    this.customersList = array;
  }

  searchCustomer(searchText) {
    const filteredCustomer = this.customersList.filter((customer) => {
      return customer.VendorName.toLowerCase().includes(searchText.toLowerCase());
    });
    this.customersListDispaly = filteredCustomer;
  }

  getEntitySummary() {
    this.sharedService.getSummaryEntity().subscribe((data: any) => {
      this.entity = data.result;
    });
  }
  selectEntity(value) {
    this.selectedEntityId = value;
    this.sharedService.selectedEntityId = value;
  }
  selectedType(val) {
    this.onboard_status = val;
    this.sharedService.onboard_status = val;
  }

  frUpdate(customer) {
    this.sharedService.customerDetails = customer;
    let customerData: any = customer;
    sessionStorage.setItem('customerData', JSON.stringify(customerData));
    this.router.navigate(['IT_Utility/vendors/Fr_update']);
  }

  saveCustomer() {
    if (this.customerForm.invalid) {
      this.submitted = false;
      return;
    }
    this.submitted = true;
    let customerobj = {
      VendorName: this.customerForm.controls['VendorName'].value,
      Address: this.customerForm.controls['Address'].value,
      City: this.customerForm.controls['City'].value,
      Country: this.customerForm.controls['Country'].value,
      Desc: this.customerForm.controls['Desc'].value,
      VendorCode: this.customerForm.controls['VendorCode'].value,
      Email: this.customerForm.controls['Email'].value,
      Contact: this.customerForm.controls['Contact'].value,
      Website: this.customerForm.controls['Website'].value,
      Salutation: '',
      FirstName: this.customerForm.controls['FirstName'].value,
      LastName: this.customerForm.controls['LastName'].value,
      Designation: this.customerForm.controls['Designation'].value,
      TradeLicense: this.customerForm.controls['TradeLicense'].value,
      VATLicense: this.customerForm.controls['VATLicense'].value,
      TRNNumber: this.customerForm.controls['TRNNumber'].value,
      vendorType: 'customer'
    };
    let vu_id = JSON.parse(sessionStorage.getItem('currentLoginUser'))[
      'userdetails'
    ]['idUser'];
    this.sharedService.addVendor(customerobj, vu_id).subscribe((data) => {
      let customeraccobj = {
        Account: this.customerForm.controls['Account'].value,
        AccountType: this.customerForm.controls['AccountType'].value,
        entityID: 1,
        entityBodyID: 1,
        City: this.customerForm.controls['City'].value,
        Country: this.customerForm.controls['Country'].value,
        LocationCode: this.customerForm.controls['LocationCode'].value,
      };
      this.sharedService
        .addCustomerAccount(customeraccobj, vu_id, data['idVendor'])
        .subscribe((data) => {
          (<HTMLButtonElement>document.getElementById('closebtn')).click();
          location.reload();
          this.submitted = false;
        });
    });
  }
  onScroll() {
    this.offsetCount++;
    this.filtersForAPI();
  }

  getCustomerData(data): void {
    this.sharedService.getVendors(data).subscribe((data) => {
      let pushArray = [];
      let onboardBoolean: boolean;
      data.forEach((ele) => {
        let mergedData = { ...ele.Entity, ...ele.Vendor };
        mergedData.OnboardedStatus = ele.OnboardedStatus;
        pushArray.push(mergedData);
      });
      this.customersListDispaly = this.customersList.concat(pushArray);
      this.listLoading = true;
      this.sharedService.storeCustomersList.next(this.customersListDispaly);
    });
  }

  filter() {
    this.listLoading = false;
    this.customersList = [];
    this.customerNameForSearch = '';
    this.sharedService.customerNameForSearch = '';
    // let booleanValue:boolean;
    // if(this.onboard_status == 'true'){
    //   booleanValue = true;
    // } else if(this.onboard_status == 'false') {
    //   booleanValue = false;
    // }
    // if(this.selectedEntityId != 'ALL' && this.onboard_status == 'ALL'){
    //   this.customersListDispaly = this.customersList.filter(v=>{
    //     return this.selectedEntityId == v.idEntity;
    //   });
    // } else if(this.selectedEntityId == 'ALL' && this.onboard_status != 'ALL'){
    //   this.customersListDispaly = this.customersList.filter(v=>{
    //     return v.onboardStatus == booleanValue;
    //   });
    // } else if(this.selectedEntityId != 'ALL' && this.onboard_status != 'ALL'){
    //   this.customersListDispaly = this.customersList.filter(v=>{
    //     return this.selectedEntityId == v.idEntity &&  v.onboardStatus == booleanValue;
    //   });
    // } else {
    //   this.customersListDispaly = this.customersList;
    // }
    this.offsetCount = 1;
    this.filtersForAPI();
    this.listLoading = true;
  }

  filtersForAPI() {
    if (this.selectedEntityId != 'ALL' && this.onboard_status == 'ALL') {
      this.APIParams = `?partyType=customer&ent_id=${this.selectedEntityId}&offset=${this.offsetCount}&limit=100`;
      this.getCustomerData(this.APIParams);
    } else if (this.onboard_status != 'ALL' && this.selectedEntityId == 'ALL') {
      this.APIParams = `?partyType=customer&onb_status=${this.onboard_status}&offset=${this.offsetCount}&limit=100`;
      this.getCustomerData(this.APIParams);
    } else if (this.selectedEntityId != 'ALL' && this.onboard_status != 'ALL') {
      this.APIParams = `?partyType=customer&ent_id=${this.selectedEntityId}&onb_status=${this.onboard_status}&offset=${this.offsetCount}&limit=100`;
      this.getCustomerData(this.APIParams);
    } else if (this.customerNameForSearch) {
      this.APIParams = `?partyType=customer&ven_code=${this.customerNameForSearch}&offset=${this.offsetCount}&limit=100`;
    } else {
      this.APIParams = `?partyType=customer&offset=${this.offsetCount}&limit=100`;
      this.getCustomerData(this.APIParams);
    }
  }
  filteCustomer() {
    this.onboard_status = 'ALL';
    this.sharedService.onboard_status = 'ALL';
    this.selectedEntityId = 'ALL';
    this.sharedService.selectedEntityId = 'ALL';
    this.customersList = [];
    this.offsetCount = 1;
    this.APIParams = `?partyType=customer&ven_code=${this.customerNameForSearch}&offset=${this.offsetCount}&limit=100`;
    this.getCustomerData(this.APIParams);
    this.sharedService.customerNameForSearch = this.customerNameForSearch;
  }

}
