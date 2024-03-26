import { Component, Input, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss','../roles.component.scss']
})
export class EditUserComponent implements OnInit {
  viewType = 'Accepted';
  queueVendorList = [];
  userDetails = [
    { label:'Name of Company', name:'companyName', id:0,value:''},
    { label:'Name of General Manager', name:'manager', id:7,value:''},
    { label:'Name of Local Sponsor', name:'sponsor', id:5,value:''},
    { label:'Name of Business Associates (multiple)', name:'businessAssociates', id:6 ,value:''},
    { label:'Name of Authorized Signatories', name:'authSign', id:10,value:''},
    { label:'Name of Head of Finance', name:'financeHead', id:8,value:''},
    { label:'Document Type', name:'docType', id:11,value:'',options:[{ id:'001',name:'International'},{ id:'002',name:'Local'}]},
    { label:'Business References', name:'businessRef', id:9,value:''},


    // { label:'Office Location', name:'location', id:3,value:''},
    // { label:'VATLicense', name:'VATnumber', id:12,value:''},
    // { label:'VAT expiry date', name:'VATEx', id:13,value:''},
    // { label:'TradeLicense', name:'TL', id:14,value:''},
    // { label:'TLExpiryDate', name:'TLExp', id:15,value:''},
  ];
  BankDetails = [
    { label:'Bank Groups', name:'bankGroups', id:'bk00',value:'' },
    { label:'Name of Bankers', name:'bankName', id:'bk01',value:'' },
    { label:'Bank Account Number', name:'accountNumber', id:'bk02',value:'' },
    { label:'Swift Code', name:'SwiftCode', id:'bk03',value:'' },
    { label:'IBAN No', name:'IBANNo', id:'bk04',value:'' },
    { label:'Routing Number', name:'bankName', id:'bk05',value:'' },
    { label:'Branch Address of Bankers', name:'branchAddress', id:'bk06',value:'' },
    { label:'Currency', name:'Currency', id:'bk07',value:'' },
    { label:'IFSC Code', name:'IFSCCode', id:'bk08',value:'' },
  ]
  constructor() { }

  ngOnInit(): void {
    this.queueVendorList =[
      { vendorName:'Health Choice General Trading', emailId:'Karthik.prasad@datasemantics.co', phone:'123456789', manager:'Vigna raja'},
      { vendorName:'Health Ahoice General Trading', emailId:'Karthik.prasad@datasemantics.co', phone:'123456789', manager:'Vigna raja'},
      { vendorName:'Health Bhoice General Trading', emailId:'Karthik.prasad@datasemantics.co', phone:'123456789', manager:'Vigna raja'},
      { vendorName:'Health Dhoice General Trading', emailId:'Karthik.prasad@datasemantics.co', phone:'123456789', manager:'Vigna raja'}
    ];
    this.queueVendorList.forEach(el=>{
      let nameSplit = el.vendorName.split(' ');
      el.shortName = nameSplit[0][0]+nameSplit[1][0];
    })
  }
 

}
