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
import { DatePipe } from '@angular/common';
import { Calendar } from 'primeng/calendar';
@Component({
  selector: 'app-create-grn',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.scss']
})
export class CreateGRNComponent implements OnInit {
  ColumnsForGRN = [];
  columnsData = [];
  columnsDataPO = [];
  showPaginator: boolean;
  showPaginatorAllInvoice: boolean;
  columnsToDisplay = [];
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
  isPO_confirmed: boolean;
  grnWithPOdialog:boolean;
  searchText:string;
  search_placeholder = 'Ex : By Vendor. By PO, Select Date range from the Calendar icon';
  filterData: any[];
  minDate: Date;
  maxDate: Date;
  api_route: string;
  EntityName:string;
  vendorName:string;
  PONumber:any;
  @ViewChild('datePicker') datePicker: Calendar;
  pageNumber: any;
  entityFormatList = [
  ]
  
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
    private md: MatDialog,
    private datePipe :DatePipe
  ) { }

  ngOnInit(): void {
    if(this.permissionService.GRNPageAccess == true){
      if(this.router.url.includes('Create_GRN_inv_list')){
        this.pageNumber = this.ds.crGRNTabPageNumber;
        this.api_route = 'readGRNReadyInvoiceList';
        this.viewType = this.tagService.GRNTab;
        this.isDesktop = this.ds.isDesktop;
        if(!this.isDesktop){
          this.mob_columns()
        }
        
        this.readTableData('');
        this.readEntity();
      } else {
        this.pageNumber = this.ds.aprTabPageNumber;
        this.api_route = 'GRNToBeApproved';
        this.readTableData_apr('');
      }
      this.prepareColumnsArray();
    } else{
      alert("Sorry!, you do not have access");
      this.router.navigate(['customer/invoice/allInvoices'])
    }

  }

  mob_columns() {
    this.ColumnsForGRN = [
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      // { dbColumnname: 'Name', columnName: 'Rule' },
      // { dbColumnname: 'CreatedOn', columnName: 'Uploaded Date' },
      { dbColumnname: 'PODocumentID', columnName: 'PO number' },
      // { dbColumnname: 'status', columnName: 'Status' },
      // { dbColumnname: 'totalAmount', columnName: 'Amount' },
    ];
  }

  
  // to prepare display columns array
  prepareColumnsArray() {
    this.ColumnsForGRN = [
      { dbColumnname: 'docheaderID', columnName: 'Invoice Number' },
      { dbColumnname: 'VendorName', columnName: 'Vendor Name' },
      // { field: 'Name', header: 'Rule' },
      { dbColumnname: 'CreatedOn', columnName: 'Uploaded Date' },
      { dbColumnname: 'PODocumentID', columnName: 'PO number' },
      // { field: 'DocumentState', header: 'PO Status' },
      { dbColumnname: 'totalAmount', columnName: 'Amount' },
    ];
    this.ColumnsForGRN.filter((element) => {
      if(this.router.url.includes('GRN_approvals') && element.dbColumnname == 'docheaderID'){
        element.header = "GRN Number"
      }
      this.columnsToDisplay.push(element.dbColumnname);
      // this.invoiceColumnField.push(element.field)
    });
    // this.ColumnsForGRNApproval.filter((ele) => {
    //   this.columnsToDisplayGRNApproval.push(ele.field);
    // });
    this.GRNTableColumnLength = this.ColumnsForGRN.length + 1;
    console.log(this.ColumnsForGRN)
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
    this.sharedService.readReadyGRNData(this.api_route,query).subscribe((data:any)=>{
      let array = [];
      data.result?.forEach(ele=>{
        let mergedArray = {...ele.Document,...ele.Vendor,...ele.Entity};
        array.push(mergedArray);
      });
      this.columnsData = array;
      this.filterData = this.columnsData;
      setTimeout(() => {
          this.searchText = this.ds.grn_exc_uniSearch;
          this.universalSearch(this.searchText);
      }, 1000);
      this.dataLength = this.columnsData.length;
      if(this.dataLength >10){
        this.showPaginatorAllInvoice = true;
      }
      this.ngxSpinner.hide();
    },err=>{
      this.ngxSpinner.hide();
    })
  }
  readTableData_apr(query){
    this.ngxSpinner.show();
    this.sharedService.readReadyGRNData(this.api_route,query).subscribe((data:any)=>{
      let array = [];
      data?.forEach(ele=>{
        let mergedArray = {...ele.Document};
        mergedArray.EntityName = ele.EntityName;
        mergedArray.VendorName = ele.VendorName;
        array.push(mergedArray);
      });
      this.columnsData = array;
      this.filterData = this.columnsData;
      setTimeout(() => {
          this.searchText = this.ds.grn_aprve_uniSearch;
          this.universalSearch(this.searchText);
      }, 1000);
      this.dataLength = this.columnsData.length;
      if(this.dataLength >10){
        this.showPaginatorAllInvoice = true;
      }
      this.ngxSpinner.hide();
    },err=>{
      this.ngxSpinner.hide();
    })
  }
  // readTableDataPO(query){
  //   this.sharedService.readReadyGRNData(query).subscribe((data:any)=>{
  //     let array = [];
  //     data.result.forEach(ele=>{
  //       let mergedArray = {...ele.Document,...ele.Vendor};
  //       array.push(mergedArray);
  //     });
  //     this.columnsDataPO = array;
  //     if(this.columnsDataPO.length > 0){
  //       this.MessageService.add({
  //         severity : 'warn',
  //         summary  : 'Alert',
  //         detail  : "Hey, Invoice is already available in Serina for the Selected PO, Please create the GRN using the invoice."
  //       })
  //     }
  //     if(this.columnsDataPO.length >10){
  //       this.showPaginator = true;
  //     }
  //   })
  // }
  readEntity(){
    this.ds.entityData.subscribe((data:[])=>{
      this.entityList = data;
      if(this.entityList.length>0){
        this.selectEntity(this.entityList[0]);
      }
    })
  }
  filterEntity(event) {
    let filtered: any[] = [];
    let query = event.query;

    if (this.entityList?.length > 0) {
      for (let i = 0; i < this.entityList?.length; i++) {
        let ent: any = this.entityList[i];
        if (ent.EntityName?.toLowerCase().includes(query?.toLowerCase())) {
          filtered.push(ent);
        }
      }
    }
    this.filteredEnt = filtered;
  }
  selectEntity(value) {
    this.selectedEntityId = value.idEntity;
    this.sharedService.selectedEntityId = value.idEntity;
    this.entityName = value;
    this.getCustomerVendors();
    this.PO_GRNForm?.controls['vendor'].reset();
    this.PO_GRNForm?.controls['PONumber'].reset();
    this.PO_GRNForm?.controls['PO_GRN_Number_line'].reset();
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
    let query = event.query?.toLowerCase();
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
    this.PO_GRNForm?.controls['PONumber'].reset();
    this.PO_GRNForm?.controls['PO_GRN_Number_line'].reset();
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
          if (PO.PODocumentID?.toLowerCase().includes(query?.toLowerCase())) {
            filtered.push(PO);
          }
          this.filteredPO = filtered;
        }
      }
  }
  selectedPO(id){
    this.sharedService.po_doc_id = id.idDocument;
    this.sharedService.po_num = id.PODocumentID;
    this.EntityName = id.EntityName;
    this.vendorName = id.VendorName;
    
    this.checkPOData(id)
  }
  readPOLines(po_num) {
    this.ngxSpinner.show();
    this.sharedService.getPO_Lines(po_num).subscribe((data: any) => {
      this.ngxSpinner.hide();
      this.poLineData = data.result;
      this.PO_GRN_Number_line = this.poLineData;
      this.permissionService.enable_create_grn = true;
      // this.readTableDataPO(`?po_header_id=${this.sharedService.po_num}`);
      if(this.poLineData?.length <= 0){
        this.alertService.errorObject.detail = "Oops, sorry no lines are available";
        this.MessageService.add(this.alertService.errorObject);
      }

    }, err => {
      this.ngxSpinner.hide();
      this.error("Server error");
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
          data : { body: 'The invoice already exist for this PO, Still you want to create GRN from PO for remaining balance?', type: 'confirmation'}})

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
          width : '400px',
          height: '300px',
          hasBackdrop: false,
          data : { body: `GRN is already available for ${val}, are you sure to create one more record?`, type: 'confirmation'}})

          drf.afterClosed().subscribe(bool=>{
            if(bool){
              this.readPOLines(val);
            } else {
              this.error("Please select other PO to create GRN");
            }
          })
       
      } else {
        this.readPOLines(val);
      }
    })
  }
  checkPOData(e){
    this.ngxSpinner.show();
    this.sharedService.updatePO(e.idDocument).subscribe((data: any) => {
      let confirmText:string;
      let icon;
      let header:string;
      if(data.po_status?.toLowerCase() == 'open' && data.po_confirmation_status?.toLowerCase() == 'confirmed'){
        this.checkGRNPO(e.PODocumentID);
      } else if(data.po_status?.toLowerCase() != 'open') {
        icon = 'assets/Serina Assets/new_theme/closed_icon.svg';
        header = 'Closed';
        confirmText = `PO(${e.PODocumentID}) is closed. \n Please check if entered PO value is correct, if still issue persist, please contact support.`;
      } else if(data.po_confirmation_status?.toLowerCase() != 'confirmed') {
        header = 'Amended';
        icon = 'assets/Serina Assets/new_theme/Group 1005.svg';
        confirmText = `PO(${e.PODocumentID}) was amended and not confirmed. \n Please ensure the confirmation in the ERP system and then retry.`;
      }
      if(confirmText){
        const drf:MatDialogRef<ConfirmationComponent> = this.md.open(ConfirmationComponent,{ 
          width : '400px',
          height: '300px',
          hasBackdrop: false,
          data : { body: confirmText, type: 'normal',icon:icon, heading: header}})
          // this.PO_GRNForm?.controls['PONumber'].reset();
          this.resetForm()
      }
      
      this.ngxSpinner.hide();
    }, err => {
      this.ngxSpinner.hide();
      this.error("Server error");
    })
  }
  resetForm(){
    // this.PO_GRNForm?.controls['PONumber'].reset();
    this.PO_GRNForm?.controls['EntityName'].reset();
    this.PO_GRNForm?.controls['vendor'].reset();
  }
  routeToGRN(val){
    this.ds.GRN_PO_Data = [];
    this.ds.grnWithPOBoolean = true;
    this.ds.GRN_PO_Data = val.PO_GRN_Number_line;
    this.router.navigate([
      `customer/Create_GRN_inv_list/Inv_vs_GRN_details/${this.sharedService.po_doc_id}`,
    ]);
  }

  universalSearch(txt){
      if(this.api_route == 'readGRNReadyInvoiceList'){
        this.ds.grn_exc_uniSearch = txt;
      } else {
        this.ds.grn_aprve_uniSearch = txt;
      }
      this.columnsData = this.filterData;
      this.columnsData = this.ds.searchFilter(txt,this.filterData);
  }
  filterByDate(date) {
    if (date != '') {
      const frmDate = this.datePipe.transform(date[0], 'yyyy-MM-dd');
      const toDate = this.datePipe.transform(date[1], 'yyyy-MM-dd');
      this.search_placeholder = `From "${frmDate}" to "${toDate}"`;
        if(frmDate && toDate){
          if (this.datePicker.overlayVisible) {
            this.datePicker.hideOverlay();
          }
            this.columnsData = this.filterData;
            this.columnsData = this.columnsData.filter((element) => {
              const dateF = this.datePipe.transform(element.CreatedOn, 'yyyy-MM-dd')
              return dateF >= frmDate && dateF <= toDate;
            });
            this.dataLength = this.columnsData.length;
        }
    } else {
      this.search_placeholder = 'Ex : By Vendor. By PO, Select Date range from the Calendar icon'
      this.columnsData = this.filterData;
      this.dataLength = this.columnsData.length;
    }
  }
  clearDates() {
    this.filterByDate('');
  }

  // paginateEmit(event){
  //   console.log(event);
  //   if(this.dataLength > 49){
  //     this.readTableData(`?offset=${event.offset}&limit=50`);
  //     console.log("yui");
  //   }
  // }

  getPODetails(po_num,event:KeyboardEvent){
    if(!this.PO_GRN_Number_line){
      if(po_num.length>7 && event.key === 'Enter') {
        this.ngxSpinner.show();
        this.sharedService.getPO_details(po_num).subscribe((data:any)=>{
          if(data.message == 'success' && data.data.length == 1){
            this.EntityName = data.data[0].Entity.EntityName;
            this.vendorName = data.data[0].Vendor.VendorName;
            this.sharedService.po_doc_id = data.data[0].Document.idDocument;
            this.sharedService.po_num = po_num;
            this.success("We found the match!");
            this.checkPOData(data.data[0].Document);
            this.ngxSpinner.hide();
          } else if(data.data.length > 1){
            let arr = []
            data.data.forEach(el=>{
              let merged = {
                ...el.Document,
                ...el.Entity,
                ...el.Vendor
              }
              arr.push(merged)
            })
            this.success("ohh, We found multiple matches please select the PO by clicking the dropdown");
            this.poNumbersList = arr;
          } else {
            this.error("Oops! Sorry no match found");
          }
          this.ngxSpinner.hide();
  
        },err=>{
          this.ngxSpinner.hide();
          this.error("Server error");
        })
      }
    } else {
      this.PO_GRNForm?.controls['PO_GRN_Number_line'].reset();
      this.PO_GRNForm?.controls['EntityName'].reset();
      this.PO_GRNForm?.controls['vendor'].reset();
    }

  }
  success(msg) {
    this.alertService.success_alert(msg);
  }
  error(msg) {
   this.alertService.error_alert(msg);
  }
  paginate(event){
    console.log(event)
    if(this.router.url.includes('Create_GRN_inv_list')){
    this.ds.crGRNTabPageNumber = event.pageNumber;
    } else {
      this.ds.aprTabPageNumber = event.pageNumber;
    }
  }
  ngOnDestroy(){
    this.md.closeAll();
  }

}
