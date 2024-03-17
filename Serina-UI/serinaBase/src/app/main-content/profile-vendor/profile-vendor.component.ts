import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-vendor',
  templateUrl: './profile-vendor.component.html',
  styleUrls: ['./profile-vendor.component.scss']
})
export class ProfileVendorComponent implements OnInit {
  currentTab:string = 'details';
  userDetails = [
    { label:'Name of Company', name:'companyName', id:0,value:''},
    { label:'Email Id (Payable Dept.)', name:'emailId', id:1,value:''},
    { label:'Address of Company', name:'address', id:2,value:''},
    { label:'Office Location', name:'location', id:3,value:''},
    { label:'Telephone / Fax No', name:'phone', id:4,value:''},
    { label:'Name of Local Sponsor', name:'sponsor', id:5,value:''},
    { label:'Name of Business Associates', name:'businessAssociates', id:6 ,value:''},
    { label:'Name of General Manager', name:'manager', id:7,value:''},
    { label:'Name of Head of Finance', name:'financeHead', id:8,value:''},
    { label:'Business References', name:'businessRef', id:9,value:''},
    { label:'Name of Authorized Signatories', name:'authSign', id:10,value:''},
    { label:'Document Type', name:'docType', id:11,value:''},
    { label:'VATLicense', name:'VATnumber', id:12,value:''},
    { label:'VAT expiry date', name:'VATEx', id:13,value:''},
    { label:'TradeLicense', name:'TL', id:14,value:''},
    { label:'TLExpiryDate', name:'TLExp', id:15,value:''},
  ];
  BankDetails = [
    { label:'Name of Bankers', name:'bankName', id:'bk01',value:'' },
    { label:'Branch Address of Bankers', name:'bankBranch', id:'bk02',value:'' },
    { label:'IBAN No', name:'Iban', id:'bk03',value:'' },
    // { label:'Name of Bankers', name:'bankName', id:'bk01',value:'' },
    // { label:'Name of Bankers', name:'bankName', id:'bk01',value:'' },
  ]
  constructor() { }

  ngOnInit(): void {
  }

  changeTab(val){
    console.log(val)
    this.currentTab = val;
  }

}
