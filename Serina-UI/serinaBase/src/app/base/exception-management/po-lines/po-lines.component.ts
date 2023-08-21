import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { DataService } from 'src/app/services/dataStore/data.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'po-lines',
  templateUrl: './po-lines.component.html',
  styleUrls: ['./po-lines.component.scss','../../invoice/view-invoice/view-invoice.component.scss']
})
export class PoLinesComponent implements OnInit {
  @Input() po_num ;
  POlineBool: boolean;
  poDocId: any;
  polineTableData = [
    { TagName: 'LineNumber', linedata: [] },
    { TagName: 'ItemId', linedata: [] },
    { TagName: 'Name', linedata: [] },
    { TagName: 'ProcurementCategory', linedata: [] },
    { TagName: 'PurchQty', linedata: [] },
    { TagName: 'UnitPrice', linedata: [] },
    { TagName: 'DiscAmount', linedata: [] },
    { TagName: 'DiscPercent', linedata: [] }
  ]
  poLineData = [];
  isDesktop: boolean;
  currentlyOpenedItemIndex = -1;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private SharedService: SharedService,
    private SpinnerService : NgxSpinnerService,
    private AlertService :AlertService,
    private messageService :MessageService,
    private exceptionService : ExceptionsService,
    private ds :DataService) { }

  ngOnInit(): void {
    this.readPOLines();
    this.isDesktop = this.ds.isDesktop;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getPODocId(changes?.po_num?.currentValue);
   }

  getPODocId(po_num) {
    console.log(po_num)
    this.SharedService.get_poDoc_id(po_num).subscribe((data: any) => {
      this.poDocId = data.result;
    })
  }
  refreshPO(){
    this.SpinnerService.show();
    this.SharedService.updatePO(this.poDocId).subscribe((data:any)=>{
      this.readPOLines();
      this.SpinnerService.hide();
      this.successAlert("PO data updated.");
    },err=>{
      this.SpinnerService.hide();
      this.errorTriger("Server error");
    })
  }

  readPOLines() {
    this.exceptionService.getPOLines('').subscribe((data: any) => {
      this.poLineData = data.Po_line_details;
      this.ds.poLineData = this.poLineData;
      console.log(this.poLineData)
      if(this.poLineData){
        if (this.poLineData.length > 0) {
          this.POlineBool = true;
        } else {
          this.POlineBool = false;
        }
      }
      this.SpinnerService.hide();
    }, err => {
      this.errorTriger("Server error");
      this.SpinnerService.hide();
    })
  }
  errorTriger(error){
    this.AlertService.errorObject.detail = error;
    this.messageService.add(this.AlertService.errorObject);
  }
  successAlert(txt) {
    this.AlertService.addObject.severity = 'success';
    this.AlertService.addObject.detail = txt;
    this.messageService.add(this.AlertService.addObject);
  }
  setOpened(itemIndex) {
    this.currentlyOpenedItemIndex = itemIndex;
  }

  setClosed(itemIndex) {
    if (this.currentlyOpenedItemIndex === itemIndex) {
      this.currentlyOpenedItemIndex = -1;
    }
  }
}
