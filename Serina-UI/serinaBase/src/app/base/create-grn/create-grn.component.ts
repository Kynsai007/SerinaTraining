import { DataService } from 'src/app/services/dataStore/data.service';
import { SharedService } from 'src/app/services/shared.service';
import { ImportExcelService } from 'src/app/services/importExcel/import-excel.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert/alert.service';
import { MessageService } from 'primeng/api';
import { PermissionService } from 'src/app/services/permission.service';
import { TaggingService } from 'src/app/services/tagging.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
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
  columnsDataPO = [];
  showPaginator: boolean;
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
  @ViewChild('PO_GRNForm')PO_GRNForm : NgForm
  isDesktop: boolean;
  constructor(
    private tagService: TaggingService,
    private ImportExcelService: ImportExcelService,
    private sharedService : SharedService,
    private ngxSpinner: NgxSpinnerService,
    private MessageService: MessageService,
    private alertService: AlertService,
    private router: Router,
    private permissionService : PermissionService,
    private ds : DataService,
    private md: MatDialog
  ) { }

  ngOnInit(): void {
    if(this.permissionService.GRNPageAccess == true){
      this.viewType = this.tagService.GRNTab;
      this.isDesktop = this.ds.isDesktop;
      // if(!this.isDesktop){
      //   this.mob_columns()
      // }
      // this.prepareColumnsArray();
      // this.readTableData('');
      // if(this.sharedService.po_num){
      //   this.readTableDataPO(`?po_header_id=${this.sharedService.po_num}`)
      // }
      this.readEntity();
    } else{
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }

  }

  mob_columns() {
    this.ColumnsForGRN = [
      { field: 'docheaderID', header: 'Invoice Number' },
      { field: 'VendorName', header: 'Vendor Name' },
      // { field: 'Name', header: 'Rule' },
      // { field: 'CreatedOn', header: 'Uploaded Date' },
      { field: 'PODocumentID', header: 'PO number' },
      // { field: 'status', header: 'Status' },
      // { field: 'totalAmount', header: 'Amount' },
    ];
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

  readTableData(query){
    this.ngxSpinner.show();
    this.sharedService.readReadyGRNData(query).subscribe((data:any)=>{
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
  readTableDataPO(query){
    this.sharedService.readReadyGRNData(query).subscribe((data:any)=>{
      let array = [];
      data.result.forEach(ele=>{
        let mergedArray = {...ele.Document,...ele.Vendor};
        array.push(mergedArray);
      });
      this.columnsDataPO = array;
      if(this.columnsDataPO.length > 0){
        this.MessageService.add({
          severity : 'warn',
          summary  : 'Alert',
          detail  : "Hey, Invoice is already available in Serina for the Selected PO, Please create the GRN using the invoice."
        })
      }
      if(this.columnsDataPO.length >10){
        this.showPaginator = true;
      }
    })
  }
  readEntity(){
    this.ds.entityData.subscribe((data:[])=>{
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
    this.PO_GRNForm.controls['vendor'].reset();
    this.PO_GRNForm.controls['PONumber'].reset();
    this.PO_GRNForm.controls['PO_GRN_Number_line'].reset();
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
    this.getPO_numbers(val.idVendor);
    this.PO_GRNForm.controls['PONumber'].reset();
    this.PO_GRNForm.controls['PO_GRN_Number_line'].reset();
  }
  getPO_numbers(idVen){
    this.sharedService.getPo_numbers(idVen).subscribe((data:any)=>{
      this.poNumbersList = data.result;
    })
  }

  filterPOnumber(event){
    let filtered: any[] = [];
    let query = event.query;
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
  selectedPO(id){
    this.sharedService.po_doc_id = id.idDocument;
    this.sharedService.po_num = id.PODocumentID
    this.checkGRNPO(id.PODocumentID);
  }
  readPOLines(po_num) {
    this.sharedService.getPO_Lines(po_num).subscribe((data: any) => {
      this.poLineData = data.result;
      this.PO_GRN_Number_line = this.poLineData;
      // this.readTableDataPO(`?po_header_id=${this.sharedService.po_num}`);

    }, err => {
      this.alertService.errorObject.detail = "Server error";
      this.MessageService.add(this.alertService.errorObject);
    })
  }
  addPODetailsToQueue(val){
    this.sharedService.checkGRN_PO_balance(true).subscribe((data:any)=>{
      if(data.result > 0 && this.columnsDataPO.length == 0 ){
          this.routeToGRN(val);
      } else {
        // this.alertService.updateObject.summary = 'Alert';
        // this.alertService.updateObject.detail = "Hey, Invoice is already available in Serina, Please create the GRN using the invoice.";
        // this.MessageService.add(this.alertService.updateObject);
        const drf:MatDialogRef<ConfirmationComponent> = this.md.open(ConfirmationComponent,{ 
          width : '30%',
          height: '45vh',
          hasBackdrop: false,
          data : { body: 'The invoice alreday exist for this PO, Still you want to create GRN from PO for remaining balance?'}})

          drf.afterClosed().subscribe((bool)=>{
            if(bool){
              this.routeToGRN(val);
            } else {
              this.MessageService.add({
                severity : 'warn',
                summary  : 'Alert',
                detail  : "Okay, Please create the GRN from the given list of invoices."
              })
            }
          })
          
      }
    })
  }
  checkGRNPO(val){
    this.sharedService.checkGRN_PO_duplicates(val).subscribe((data:any)=>{
      if(data.result.length > 0){
        const drf:MatDialogRef<ConfirmationComponent> = this.md.open(ConfirmationComponent,{ 
          width : '30%',
          height: '35vh',
          hasBackdrop: false,
          data : { body: `GRN is already availablle for ${val}, still you want to create one more?`}})

          drf.afterClosed().subscribe(bool=>{
            if(bool){
              this.readPOLines(val);
            } else {
              this.alertService.errorObject.detail = "Please select other PO to create GRN";
              this.MessageService.add(this.alertService.errorObject);
            }
          })
       
      } else {
        this.readPOLines(val);
      }
    })
  }
  routeToGRN(val){
    this.ds.GRN_PO_Data = [];
    this.ds.grnWithPOBoolean = true;
    this.ds.GRN_PO_Data = val.PO_GRN_Number_line;
    this.router.navigate([
      `customer/Create_GRN_inv_list/Inv_vs_GRN_details/${val.PONumber.idDocument}`,
    ]);
  }
}
