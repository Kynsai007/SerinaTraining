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
  contactDetails= [
    { label:'Email Id (Payable Dept.)', name:'emailId', id:1,value:''},
    { label:'Telephone / Fax No', name:'phone', id:4,value:''},

  ];
  addressDetails = [
    { label:'Address of Company', name:'primary_address', id:1,value:''},
    { label:'Purpose', name:'Purpose', id:2,value:'',options:[{ id:'001',name:'Business'},{ id:'002',name:'Local'}]},
  ]
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

  uploadDocDetails= [
    { label:'Receive filled form', name:'form', id:'idu01',value:'', size:'1mb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]},
    { label:'Supply agreement', name:'supplyDoc', id:'idu02',value:'', size:'200kb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]},
    { label:'Account opening form', name:'ACform', id:'idu03',value:'', size:'1mb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]},
    { label:'Bank letter', name:'bankLetter', id:'idu04',value:'', size:'1mb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]},
    { label:'Passport copies of authorized signatories', name:'passport', id:'idu05',value:'', size:'1mb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]},
    { label:'Trade License (If available) or Tax certificate', name:'trn', id:'idu06',value:'', size:'1mb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]},
    { label:'Invoice copy ( to setup bank details )', name:'invCopy', id:'idu07',value:'', size:'1mb',insideObj:[
      { label1: 'Registration type', name:'reg_num',id:'id1', value:'' },
      { label1: 'Document Number', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issuing agency', name:'reg_num',id:'id1', value:'' },
      { label1: 'Issued Date', name:'reg_num',id:'id1', value:'' },
      { label1: 'Expiry Date', name:'reg_num',id:'id1', value:'' },
    ]}
  ]
  constructor() { }

  ngOnInit(): void {
  }

  changeTab(val){
    this.currentTab = val;
  }

  addSecondary(){
    let count = this.addressDetails.length;
    this.addressDetails.push(
      { label:'Address of Company', name:'secondary_address', id:count+1,value:''},
      { label:'Purpose', name:'Purpose', id:count+2,value:'',options:[{ id:'001',name:'Business'},{ id:'002',name:'Local'}]}
    )
  }
  uploadDocs(data){
    console.log(data)
  }

  onSelectFile(event,index){
    console.log(event.target.files)
    // for (var i = 0; i < event.target.files?.length; i++) {
      this.uploadDocDetails[index].value = event.target.files;
    // }

  }

}
