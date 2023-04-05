import { DataService } from 'src/app/services/dataStore/data.service';
import { SharedService } from 'src/app/services/shared.service';
import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MessageService } from 'primeng/api';
import { PermissionService } from 'src/app/services/permission.service';
import { TaggingService } from 'src/app/services/tagging.service';

@Component({
  selector: 'app-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss']
})
export class CreateGRNComponent implements OnInit {
  ColumnsForGRN = [
    { field: 'docheaderID', header: 'Invoice Number' },
    { field: 'VendorName', header: 'Vendor Name' },
    // { field: 'Name', header: 'Rule' },
    { field: 'CreatedOn', header: 'Uploaded Date' },
    { field: 'PODocumentID', header: 'PO number' },
    // { field: 'status', header: 'Status' },
    { field: 'totalAmount', header: 'Amount' },
  ];
  columnsData = [];
  showPaginatorAllInvoice: boolean;
  columnsToDisplay = [];

  ColumnsForGRNApproval = [
    { field: 'docheaderID', header: 'Invoice Number' },
    { field: 'VendorName', header: 'Vendor Name' },
    { field: 'Name', header: 'Rule' },
    // { field: 'documentdescription', header: 'Description' },
    // { field: 'All_Status', header: 'Status' },
    { field: 'Approvaltype', header: 'Approval Type' },
    { field: 'totalAmount', header: 'Amount' },
  ];
  columnsToDisplayGRNApproval = [];
  viewType: any;
  allSearchInvoiceString: any[];
  rangeDates: Date[];
  dataLength: number;
  columnsDataAdmin: any[];
  showPaginatorApproval: boolean;
  dataLengthAdmin: number;
  GRNTableColumnLength: number;
  approvalPageColumnLength: number;
  entityList: any;
  filteredEnt: any[];
  entityName: any;
  vendorsList: any[];
  selectedEntityId: any;
  filteredVendors: any[];
  filteredPO = [];
  po_lines = [];
  PO_GRN_Number_line = [];
  poNumbersList: any;
  poLineData: any;
  constructor(
    private tagService: TaggingService,
    private ImportExcelService: ImportExcelService,
    private sharedService : SharedService,
    private ngxSpinner: NgxSpinnerService,
    private MessageService: MessageService,
    private alertService: AlertService,
    private router: Router,
    private permissionService : PermissionService,
    private dataS : DataService
  ) { }

  ngOnInit(): void {
    if(this.permissionService.GRNPageAccess == true){
      this.viewType = this.tagService.GRNTab;
      this.prepareColumnsArray();
      this.readTableData();
      this.readEntity();
    } else{
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }

  }

  
  // to prepare display columns array
  prepareColumnsArray() {
    this.ColumnsForGRN.filter((element) => {
      this.columnsToDisplay.push(element.field);
      // this.invoiceColumnField.push(element.field)
    });
    this.ColumnsForGRNApproval.filter((ele) => {
      this.columnsToDisplayGRNApproval.push(ele.field);
    });

    this.GRNTableColumnLength = this.ColumnsForGRN.length + 1;
    this.approvalPageColumnLength = this.ColumnsForGRN.length + 1;
  }

  chooseEditedpageTab(value) {
    this.viewType = value;
    this.tagService.GRNTab = value;
    this.allSearchInvoiceString = [];
  }

  searchInvoiceDataV(value) {
    // this.allSearchInvoiceString = []
    this.allSearchInvoiceString = value.filteredValue;
  }

  exportExcel() {
    let exportData = [];
    if (this.tagService.batchProcessTab == 'normal') {
      exportData = this.columnsData;
    } else if (this.tagService.batchProcessTab == 'editApproveBatch') {
      exportData = this.columnsDataAdmin;
    }
    if (this.allSearchInvoiceString && this.allSearchInvoiceString.length > 0) {
      this.ImportExcelService.exportExcel(this.allSearchInvoiceString);
    } else if (exportData && exportData.length > 0) {
      this.ImportExcelService.exportExcel(exportData);
    } else {
      alert('No Data to import');
    }
  }

  readTableData(){
    this.ngxSpinner.show();
    this.sharedService.readReadyGRNData().subscribe((data:any)=>{
      let array = [];
      data.result.forEach(ele=>{
        let mergedArray = {...ele.Document,...ele.Vendor};
        array.push(mergedArray);
      });
      this.columnsData = array;

      this.dataLength = this.columnsData.length;
      if(this.dataLength >10){
        this.showPaginatorAllInvoice = true;
      }
      this.ngxSpinner.hide();
    },err=>{
      this.ngxSpinner.hide();
    })
  }
  readEntity(){
    this.dataS.entityData.subscribe((data:[])=>{
      this.entityList = data;
    })
  }
  filterEntity(event) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.entityList?.length > 0) {
      for (let i = 0; i < this.entityList?.length; i++) {
        let ent: any = this.entityList[i];
        if (ent.EntityName.toLowerCase().includes(query.toLowerCase())) {
          filtered.push(ent);
        }
      }
    }
    this.filteredEnt = filtered;
  }
  selectEntity(value) {
    this.selectedEntityId = value.idEntity;
    this.sharedService.selectedEntityId = value.idEntity;
    this.entityName = value.EntityName;
    this.getCustomerVendors();
  }
  getCustomerVendors() {
    this.sharedService
      .getVendorsListToCreateNewlogin(`?offset=1&limit=100&ent_id=${this.selectedEntityId}`)
      .subscribe((data: any) => {
        this.vendorsList = data.vendorlist
        // let arr = [];
        // data.vendorlist.forEach(ele => {
        //   ele.VendorName1 = `${ele.VendorName} - ${ele.VendorCode}`;
        //   arr.push({ VendorName: ele.VendorName1, idVendor: ele.idVendor, is_onboarded: ele.is_onboarded })
        // })
        // this.vendorsList = arr;
        // this.filteredVendors = arr;
      });
  }
  filterVendor(event) {
    let query = event.query.toLowerCase();
    if (query != '') {
      this.sharedService.getVendorsListToCreateNewlogin(`?offset=1&limit=100&ent_id=${this.selectedEntityId}&ven_name=${query}`).subscribe((data: any) => {
        this.filteredVendors = data.vendorlist;
      });
    } else {
      this.filteredVendors = this.vendorsList;
    }
  }
  selectedVendor(val){
    this.getPO_numbers(val.idVendor)
  }
  getPO_numbers(idVen){
    this.sharedService.getPo_numbers(idVen).subscribe((data:any)=>{
      this.poNumbersList = data.result;
    })
  }

  filterPOnumber(event){
    let filtered: any[] = [];
    let query = event.query;
    if (query != '') {
      if (this.poNumbersList?.length > 0) {
        for (let i = 0; i < this.poNumbersList?.length; i++) {
          let PO: any = this.poNumbersList[i];
          if (PO.PODocumentID.toLowerCase().includes(query.toLowerCase())) {
            filtered.push(PO);
          }
          this.filteredPO = filtered;
        }
      }
    }
     else {
      this.filteredPO = this.poNumbersList;
    }
  }
  selectedPO(id){
    this.readPOLines(id.PODocumentID)
  }
  readPOLines(po_num) {
    this.sharedService.getPO_Lines(po_num).subscribe((data: any) => {
      this.poLineData = data.result;
      this.PO_GRN_Number_line = this.poLineData;
    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.MessageService.add(this.alertService.errorObject);
    })
  }
  addPODetailsToQueue(val){
    console.log(val)
    this.sharedService.checkGRN_PO_duplicates(val.PONumber.PODocumentID).subscribe((data:any)=>{
      if(data.result.length > 0){
        if(confirm(`GRN is already availablle for ${val.PONumber.PODocumentID}, still you want to create one more?`)){
          this.routeToGRN(val);
        } else {
          this.alertService.errorObject.detail = "Please select other PO to create GRN";
          this.MessageService.add(this.alertService.errorObject);
        }
      } else {
        this.routeToGRN(val);
      }
    })
    
  }
  routeToGRN(val){
    this.dataS.GRN_PO_Data = [];
    this.dataS.grnWithPOBoolean = true;
    this.dataS.GRN_PO_Data = val.PO_GRN_Number_line;
    this.router.navigate([
      `customer/Create_GRN_inv_list/Inv_vs_GRN_details/${val.PONumber.idDocument}`,
    ]);
  }
}
