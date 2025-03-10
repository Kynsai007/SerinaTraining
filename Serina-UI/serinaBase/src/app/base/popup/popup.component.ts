import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ExceptionsService } from 'src/app/services/exceptions/exceptions.service';
import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/dataStore/data.service';
import { DatePipe } from '@angular/common';
import { DateFilterService } from 'src/app/services/date/date-filter.service';
import { Calendar } from 'primeng/calendar';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  POLineData = [];
  selectedPOLines = [];
  type: string;
  component: string;
  uploadBool: boolean = false;
  GRNData = [];
  po_num: string;
  approveBool: boolean = false;
  entityList = [];
  approverList: any;
  rejectionComments: string;
  isQuantityChanged: boolean;
  linesTotal: number = 0;
  inv_total: number;
  select_all_bool: boolean;
  approversSendData: any;
  lineTable = [
    { name: 'Description', data: [] },
    { name: 'PO Quantity', data: [] },
    { name: 'Balance Qty', data: [] }
  ];
  orderHistoryData: any;
  masterData: any;
  orderData: any;
  textlngth: any;
  updateSOObj: any;
  line_num: number;
  v_a_id: any;
  so_id: any;
  minDate: Date;
  maxiDate: Date;
  rangeDates: Date[];
  @ViewChild('datePicker') datePicker: Calendar;
  manPowerData = [];
  manPowerMetadata = [];
  grnLineCount: any
  timeSheet: any[];
  replicaSheetData = [];
  manpowerTableHeaders: { header: string; field: string; }[];
  number_of_days: number;
  disabledDates: Date[] = [];
  startDate: Date;
  endDate: Date;
  isEditGRN: boolean = false;
  createdDates = [];
  disabledSaveMetadata: boolean = true;

  isDragging = false;
  isResizing = false;
  isResizingEnabled = false;
  resizeDirection: string = '';
  startX!: number;
  startY!: number;
  startWidth!: number;
  startHeight!: number;
  edgeThreshold = 10; // Pixels from the edge to trigger resize
  decimal_count: number;
  dragRootElement = '.cdk-overlay-pane';

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private ES: ExceptionsService,
    private alert: AlertService,
    private spin: NgxSpinnerService,
    private ds: DataService,
    private mat_dlg: MatDialog,
    private datePipe: DatePipe,
    private dateFilterService: DateFilterService,
    private sharedService: SharedService,
    private el: ElementRef, 
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.type = this.data.type;
    this.rejectionComments = this.data.rejectTxt
    this.po_num = this.data?.po_num
    let grn = this.data?.grnLine;
    this.POLineData = this.data?.resp?.podata;
    this.inv_total = this.data?.resp?.sub_total;
    this.isEditGRN = this.ds?.isEditGRN;
    this.decimal_count = this.ds.configData?.miscellaneous?.No_of_Decimals;
    if(!this.decimal_count){
      this.decimal_count = 2;
     }
    if (grn) {
      grn?.forEach(el => {
        let obj = { LineNumber: el.POLineNumber, grnpackagingid: el.PackingSlip };
        this.GRNData.push(obj);
      })
    }
    if (this.type == 'flip' || this.type == 'flip returns') {
      this.component = 'normal';
      this.flipPOFun();
    } else if (this.type == 'flip line') {
      this.component = 'mapping';
      this.flipPOFun();
    } else if (this.type == 'editApprover') {
      this.approveBool = true;
      this.flipApproverlist();
    } else if (this.type == 'manpower') {
      this.dateRange();
      this.manPowerData = this.ds.added_manpower_data;
      if(this.isEditGRN){
        this.getTimeSheetData();
      }
      if(!this.manPowerData){
        this.manpowerCreateFunction();
      } else {
        this.grnLineCount = this.manPowerData[0].linedata;
      }

    } else if (this.type == 'manpower_metadata') {
      // this.manPowerMetadata = JSON.parse(JSON.stringify(this.data?.resp?.manpower_metadata));
      this.manPowerMetadata = this.ds.GRN_PO_Data.map(ele => {
        const matchingItem = this.ds?.grn_manpower_metadata?.headerFields?.find(item => item.itemCode == ele.LineNumber);
        return {
          description: ele.Name,
          itemCode: ele.LineNumber,
          durationMonth: matchingItem?.durationMonth || '',
          isTimesheets: matchingItem ? true : false,
          shifts: matchingItem?.shifts || ''
        };
      });
      // Create table headers
      this.manpowerTableHeaders = [
        { header: 'Description', field: 'description' },
        { header: 'Is Timesheets', field: 'isTimesheets' },
        { header: 'Duration in months', field: 'duration' },
        { header: 'Number of Shifts', field: 'shifts' }
      ];
    }
    if (this.data.comp == 'upload') {
      this.uploadBool = true;
    }
    this.POLineData = this.data?.resp?.podata;
    this.inv_total = this.data?.resp?.sub_total;
  }

  flipPOFun() {
    this.POLineData.forEach(val => {
      val.isSelected = false;
      val.Quantity = val.PurchQty;
      val.AmountExcTax = this.calculateAmount(val);
    })
  }
  onSubmit(value) {
    this.spin.show();
    this.ES.flip_po(this.selectedPOLines).subscribe((data: any) => {
      if (data?.result) {
        if (data.Flippo_Approval) {
          this.flipApproverlist();
          this.success("PO flip is successful")
          this.approveBool = true;
          this.spin.hide();
        } else {
          this.ES.popupmsg.next(this.component);
          this.success("PO flip is successful")
          this.dialogRef.close();
        }


        // this.mat_dlg.open(FlipApprovalComponent, {
        //   width: '60%',
        //   height: '70vh',
        //   hasBackdrop: false
        // });
      } else {
        this.error(data?.error)
        this.spin.hide();
      }
      
    }, err => {
      this.error("Server error");
      this.spin.hide();
    })
  }
  calculateAmount(data){
    console.log(data)
    let lineTotal;
    if (data?.DiscPercent && data?.DiscPercent != '0') {
      lineTotal = data?.Quantity * data?.UnitPrice * (1 - data?.DiscPercent / 100);
    } else if (data?.DiscAmount && data?.DiscAmount != '0') {
      lineTotal = (data?.Quantity * data?.UnitPrice) - data?.DiscAmount;
    } else {
      lineTotal = data?.Quantity * data?.UnitPrice;
    }
    return lineTotal;
  }
  onSelect(bool, data, field) {
    let id = data[field];
    data.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
    if (bool) {
      let boolean = this.selectedPOLines?.findIndex(el => el[field] == data[field]);
      if (boolean) {
        this.selectedPOLines.push(data);
        let lineTotal = this.calculateAmount(data);
        this.linesTotal = Number(this.linesTotal) + Number(this.decimalRoundOff(lineTotal));
      }
    } else {
      const ind = this.selectedPOLines?.findIndex(el => el[field] == data[field]);
      if (ind != -1) {
        this.selectedPOLines.splice(ind, 1)
        let lineTotal= this.calculateAmount(data);
        this.linesTotal = Number(this.linesTotal) - Number(this.decimalRoundOff(lineTotal));
        // this.linesTotal = Number(this.linesTotal) - Number((data?.Quantity * data?.UnitPrice).toFixed(2))
      }
    }
    if (this.selectedPOLines.length == this.POLineData.length) {
      this.select_all_bool = true;
    } else {
      this.select_all_bool = false;
    }
  }
  onSelectAll(bool, field) {
    if (bool) {
      this.POLineData.forEach(val => {
        val.isSelected = true;
        let id = val[field];
        val.Quantity = (<HTMLInputElement>document.getElementById(id)).value;
        let lineTotal = this.calculateAmount(val);
        // let lineTotal = val?.DiscAmount ? (val?.Quantity * (val?.UnitPrice - val?.DiscAmount)) : (val?.Quantity * val?.UnitPrice); 
        this.linesTotal = Number(this.linesTotal) + Number(this.decimalRoundOff(lineTotal));
        // this.linesTotal = Number(this.linesTotal) + Number((val?.Quantity * val?.UnitPrice).toFixed(2))
      })
      const allData = [...this.POLineData]
      this.selectedPOLines = allData;
      this.select_all_bool = true;
    } else {
      this.select_all_bool = false;
      this.selectedPOLines = [];
      this.linesTotal = 0;
      this.POLineData.forEach(val => {
        val.isSelected = false;
      })
    }
  }
  changeQty(qty, lineid, field) {
    let el_flied = 'Quantity';
    this.isQuantityChanged = true;
    this.linesTotal = 0;
    if (this.type == 'flip returns') {
      el_flied = 'rtn_qty'
    }
    this.selectedPOLines.forEach(el => {
      if (el[field] == lineid) {
        el[el_flied] = qty;
      }
      let lineTotal = this.calculateAmount(el);
      this.linesTotal = Number(this.linesTotal) + Number(this.decimalRoundOff(lineTotal));
      // this.linesTotal = Number(this.linesTotal) + Number((el?.Quantity * el?.UnitPrice).toFixed(2))
    });
    // this.linesTotal = 0;
    this.POLineData.forEach(el => {
      if (el.LineNumber == lineid) {
        el.Quantity = qty;
      }
      // this.linesTotal = Number(this.linesTotal) + Number((el.PurchQty * el.UnitPrice).toFixed(2))

    })
  }
  onSubmitRequest(val) {
    this.dialogRef.close(this.rejectionComments);
  }

  validateFlip() {
    this.spin.show();
    if (this.type != 'flip returns') {
      let obj = {
        Podata: this.selectedPOLines,
        GRNdata: this.GRNData
      }
      this.ES.validateFlipPO(obj, this.po_num).subscribe((data: string) => {
        if (data == 'success') {
          this.ES.popupmsg.next(this.component);
          this.success("PO flip is successful")
          this.dialogRef.close(this.selectedPOLines);
        } else {
          this.error(data)
        }
        this.spin.hide();
      }, err => {
        this.error("Server error");
        this.spin.hide();
      });
    } else {
      let APIdata = [];
      this.selectedPOLines.forEach(el => {
        APIdata.push({
          "description": el.Description,
          "rtn_qty": el.rtn_qty || el.Quantity,
          "item_code": el.itemCode,
          "po_line_number": el.itemCode,
          "inv_qty": el.Quantity
        })
      })
      this.ES.validateReturns(APIdata).subscribe((data: any) => {
        if (data.result == 'Success') {
          this.success("Successful")
          this.dialogRef.close(APIdata);
        } else {
          this.error(data.result)
        }
        this.spin.hide();
      }, err => {
        this.error("Server error");
        this.spin.hide();
      });
    }

  }

  flipApproverlist() {
    this.ES.getFlipApprovers().subscribe((data: any) => {
      let resultData = data?.result;
      this.approverList = data?.result
      let array = [];
      let list = [];
      let count = 0;
      for (const item in resultData) {
        count = count + 1;
        // list = resultData[item].sort((a, b) => a.priority - b.priority);
        // console.log(item)
        // this.approverList[`${item}`] = list;
        // console.log(item)
        array.push(resultData[item][0]);
      }
      this.approversSendData = array;
    })
  }
  onSelectApprovers(val, i) {

  }

  setApprover() {
    this.ES.setFlipApproval(this.approversSendData).subscribe((data) => {
      this.success("Successfully sent for Approvals")
      this.dialogRef.close('success');
    }, err => {
      this.error("Server error");
    })
  }

  updateMapping() {
    this.ES.updateSOmap(this.so_id, this.v_a_id, this.updateSOObj).subscribe((data) => {
      // this.alert.addObject.detail = "SO Line is mapped successfully";
      // this.message.add(this.alert.addObject);
      this.dialogRef.close('Mapped');
    })
  }
  success(msg) {
    this.alert.success_alert(msg);
  }
  error(msg) {
    this.alert.error_alert(msg);
  }

  // Function to generate all dates between start and end date
  generateDisabledDates(start: Date, end: Date): void {
    let currentDate = new Date(start);

    while (currentDate <= end) {
      this.disabledDates.push(new Date(currentDate)); 
      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  dateRange() {
    this.dateFilterService.dateRange();
    this.minDate = this.dateFilterService.minDate;
    this.maxiDate = this.dateFilterService.maxDate;
    const datesFilled = this.ds.grn_manpower_metadata?.datesFilled;
    if(datesFilled.length > 0){
      let date = datesFilled[0]?.startdate;
      let day = date.split('-')[2];
      let month = date.split('-')[1];
      let year = date.split('-')[0];
      let e_date = datesFilled[0].enddate;
      let e_day = e_date.split('-')[2];
      let e_month = e_date.split('-')[1];
      let e_year = e_date.split('-')[0];
      this.startDate = new Date(year, month-1, day);
      this.endDate = new Date(e_year, e_month-1, e_day);
      this.generateDisabledDates(this.startDate, this.endDate);
    }
    }

  filterByDate(date_input) {
      if(date_input != '') {
        if(this.isEditGRN){
          this.rangeDates = date_input
        }
        const frmDate = this.datePipe.transform(date_input[0], 'MMM d, y');
        const toDate = this.datePipe.transform(date_input[1], 'MMM d, y');
        const s_Date = this.datePipe.transform(date_input[0], 'yyyy-MM-dd');
        const e_Date = this.datePipe.transform(date_input[1], 'yyyy-MM-dd');
        let selectedMonth: any = s_Date.split("-")[1]
        let today = new Date();
        let c_month: any = today.getMonth()
        let year: any = s_Date.split("-")[0];
        if (Number(selectedMonth) != c_month + 1) {

          this.maxiDate = new Date(Number(year), Number(selectedMonth), 0)
          setTimeout(() => {
            const input = document.querySelector('.p-inputtext') as HTMLElement;
            if (input && !e_Date) {
              input.focus();  // Re-focus the input element to keep the calendar open
            }
          }, 0);
        }
        const numDays = (y, m) => new Date(y, m, 0).getDate();
        this.number_of_days = numDays(year, selectedMonth);
        this.ds.number_of_days = this.number_of_days;
        if (frmDate && toDate) {
          this.ds.manpower_saved_date_range = this.rangeDates;
          // this.getTimeSheetData(s_Date,e_Date);
          if (!this.isEditGRN && this.datePicker.overlayVisible) {
            this.datePicker.hideOverlay();

          }
          let old_data = [];
          this.ES.getManpowerPrefill(this.sharedService.po_num, s_Date, e_Date).subscribe((data: any) => {
            old_data =  data?.data?.timesheets;

            if(old_data){
              let item_codes = [];
              old_data.filter(el=> {
                if(!item_codes.includes(el.itemCode)){
                  item_codes.push(el.itemCode)
                }
              })
              let va_bool:boolean;
              let lineArr = [];
              this.manPowerData[0].linedata.filter(id=>{
                if(!lineArr.includes(id.LineNumber)){
                  lineArr.push(Number(id.LineNumber))
                }
              });
              va_bool = lineArr.every(e=> item_codes.includes(e))
              if(old_data.length > 0 && !this.isEditGRN && va_bool ){
                const matD: MatDialogRef<ConfirmationComponent> = this.confirmFun("Overlapping dates are there. Please close this window and try again with another date range.","ok","Information")

                matD.afterClosed().subscribe((bool) => {
                  this.dialogRef.close();
                })
              }
              old_data.forEach(el => {
                el.quantity.forEach(item => {
                  item.itemCode = el.itemCode
                  item.LineNumber = el.itemCode
                  if(el.shift == 'Shift 1'){
                    item.tagName = 'timeSheet0'
                  }
                  if(el.shift == 'Shift 2'){
                    item.tagName = 'timeSheet1'
                  }
                  if(el.shift == 'Shift 3'){
                    item.tagName = 'timeSheet2'
                  }
                  if(el.shift == 'Shift 4'){
                    item.tagName = 'timeSheet3'
                  }
                })
              })
            }
          })
          let month = frmDate?.split(',')[0]?.split(' ')[0];
          let date: any = frmDate?.split(',')[0]?.split(' ')[1];
          let date1: any = toDate?.split(',')[0]?.split(' ')[1];
          let sampleData = JSON.parse(JSON.stringify(this.manPowerData))
          this.timeSheet = []
          if (this.manPowerData.length > 4) {
            this.manPowerData = [];
            sampleData = sampleData.filter(el => {
              return ['Description', 'PO Qty', 'PO Balance Qty', 'Monthly quantity', 'Number of Shifts', 'Shift', 'GRN - Quantity'].includes(el.TagName)
            })
            this.manPowerData = sampleData;
            let shiftIndex = this.manPowerData.findIndex(el => el.TagName == 'Number of Shifts');
            let shiftLineData = this.manPowerData[shiftIndex].linedata
            if(this.manPowerData.filter(el => el.TagName == 'Shift').length == 0){
              this.manPowerData.splice(shiftIndex, 0, { TagName: `Shift`, linedata: shiftLineData })
            }
          }
          this.timeSheet = [];
          let index1 = 0;
          let item_Code = '';
          this.grnLineCount.forEach((el, index) => {
            index1++;
            let lineNumber = el.LineNumber || el.itemCode;
            if(item_Code != lineNumber){
              item_Code = lineNumber;
              index1 = 0;
            }

            this.timeSheet.push({
              Value: '',
              tagName: `timeSheet${index1}`,
              tagName_u: `timeSheet${index1}`,
              ErrorDesc: '',
              idDocumentLineItems: `${lineNumber}-${index1+1}`,
              is_mapped: '',
              old_value: '',
              LineNumber: lineNumber
            })
          })
          let index = 3
          for (let i = Number(date); i <= Number(date1); i++) {
            let currentDate = new Date(year, selectedMonth-1, i);
            if (currentDate >= this.startDate && currentDate <= this.endDate) {
              continue; // Skip the dates within the excluded range
            }
            let data = []
            let sheet = []
            sheet = JSON.parse(JSON.stringify(this.timeSheet))
            sheet.forEach((el, index) => {
              el.tagName_u = `${month}-${i}-${index}`
              data.push(el)
            })
            this.manPowerData.splice(index, 0, { TagName: `${year}-${selectedMonth}-${i}`, linedata: data })
            index++
          }
          setTimeout(() => {
            if(old_data){
              old_data.forEach(el => {
                el.quantity.forEach(item => {
                  this.manPowerData.forEach(manpower => {
                    if(item.date == manpower.TagName){
                      manpower.linedata.forEach(line => {
                        if(line.tagName == item.tagName && line.LineNumber == item.itemCode){
                          line.Value = item.quantity;
                        }
                      })
                    }
                    manpower.linedata.forEach(line => {
                      if(line.LineNumber == el.itemCode && !this.createdDates.includes(manpower.TagName) && !this.isEditGRN){
                        line.isSavedData = true;
                      }
                      if(line.tagName == 'Quantity' && line.LineNumber == el.itemCode && this.createdDates.includes(manpower.TagName)){
                        line.Value = 0;
                      }
                    })
                  })
                })
              })
            }
          }, 1000)
        }

    }
  }

  clearDates() {
    this.filterByDate('');
    this.dateRange();
  }

  // addNewShift(str, index) {
  //   this.manPowerData.forEach(el => {
  //     el.linedata.splice(index + 1, 0, JSON.parse(JSON.stringify(el.linedata[index])))
  //   })
  //   this.manPowerData.forEach(el => {
  //     el.linedata.forEach((v, i) => {
  //       if (index + 1 == i && el.TagName != 'Description' && el.TagName != "PO Qty") {
  //         v.tagName_u = `shift${index + 1}-${el.TagName}`
  //       }
  //     })
  //   })
  // }

  // removeShift(str, index) {
  //   const matD: MatDialogRef<ConfirmationComponent> = this.mat_dlg.open(ConfirmationComponent, {
  //     width: '400px',
  //     height: '300px',
  //     hasBackdrop: false,
  //     data: { body: "Are you sure, you want to delete?", type: "confirmation", heading: "Confirmation", icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
  //   })
  //   matD.afterClosed().subscribe((bool: Boolean) => {
  //     if (bool) {
  //       this.manPowerData.forEach((el) => {
  //         el.linedata.splice(index, 1)
  //       })
  //     }
  //   })
  // }

  getTimeSheetData() {
    this.ES.getManPowerData().subscribe((data: any) => {
      if(data?.data){
        const fDate = new Date(data?.data?.startdate);
        const eDate = new Date(data?.data?.enddate)
        let dates = [fDate,eDate ]
        this.filterByDate(dates)
      }
      if(data?.data?.timesheets?.length>0){
        data?.data?.timesheets[0].quantity.forEach(e=>{
          if(!this.createdDates.includes(e.date)){
            this.createdDates.push(e.date);
          }
        })
      }
    })
  }
  updateManpowerMetadata(index: number, field: string, value: any, row: any) {
    this.manPowerMetadata[index][field] = value;
    let existingRecord = this.ds.grn_manpower_metadata.headerFields.find(el => el.itemCode == row);
    if (existingRecord) {
      existingRecord[field] = value;
    } else {
      this.ds.grn_manpower_metadata.headerFields.push({
        itemCode: row,
        [field]: value
      });
    }
    this.ds.grn_manpower_metadata.headerFields.forEach(el=>{
      if(Object.keys(el).length <= 3){
        this.disabledSaveMetadata = true;
      } else {
        this.disabledSaveMetadata = false;
      }
    })
    // this.ds.grn_manpower_metadata.headerFields[index][field] = value;
  }
  saveManpowerMetadata() {
    this.dialogRef.close(this.manPowerMetadata);
  }


  onSubmitManpower() {
    let startDate = this.datePipe.transform(this.ds.manpower_saved_date_range[0], 'yyyy-MM-dd');    
    let endDate = this.datePipe.transform(this.ds.manpower_saved_date_range[1], 'yyyy-MM-dd');
    let response = {
      dates: { startdate: startDate, enddate: endDate },  
      data: this.manPowerData
    }
    this.dialogRef.close(response);
    this.ds.added_manpower_data = this.manPowerData;
    this.ds.manpowerResponse = response;
  }
  closeDialog(bool,bool1){
    if(bool && bool1){
      const matD: MatDialogRef<ConfirmationComponent> = this.confirmFun("You have unsaved timesheet data. Are you sure you want to cancel? Please click 'Save' to proceed.","confirmation","Confirmation")
      matD.afterClosed().subscribe((bool:Boolean)=>{
        if(bool){
          this.dialogRef.close();
        }
      })
    } else {
      this.dialogRef.close();
    }
  }

  manpowerCreateFunction() {
    this.replicaSheetData = JSON.parse(JSON.stringify(this.data?.resp?.grnData_po));

    // Step 1: Filter out the entries where "isTimesheet" value is false
    const isTimesheetsTag = this.replicaSheetData.find(item => item.TagName === 'Is Timesheets');
    // Get ids of "Is Timesheets" lines where value is false
    const excludedLineItemIds = isTimesheetsTag.linedata
      .filter(data => data.Value != true)  // Adjust as needed based on the value's type
      .map(data => data.idDocumentLineItems);  // Collect IDs of entries to exclude

    // Step 2: Filter out the lines with matching IDs in all tags
    const grnData_po_filtered = this.replicaSheetData.map((item) => {
      return {
        ...item,
        linedata: item.linedata.filter(data => !excludedLineItemIds.includes(data.idDocumentLineItems))
      };
    });

    // Step 3: Find the "Number of Shifts" tag to get shift counts
    const numberOfShiftsTag = grnData_po_filtered.find(item => item.TagName === 'Number of Shifts');
    let replicatedData = [];
    if (!numberOfShiftsTag) {
      console.error('Number of Shifts tag not found!');
    } else {
      // Step 4: Replicate lines based on shift count and add shift info to each line
      replicatedData = grnData_po_filtered.map((item) => {
        return {
          ...item,
          linedata: item.linedata.flatMap((line) => {
            // Find the corresponding shift count from the Number of Shifts tag using the same idDocumentLineItems
            const shiftCountLine = numberOfShiftsTag.linedata.find(shiftLine => shiftLine.idDocumentLineItems === line.idDocumentLineItems);
            const shiftCount = shiftCountLine ? parseInt(shiftCountLine.Value, 10) : 1;  // Default to 1 if not found
            // Replicate the line based on the shift count
            return Array.from({ length: shiftCount }, (_, index) => ({
              ...line,
              idDocumentLineItems: `${line.idDocumentLineItems}-${index + 1}`,
              tagName_u: `${line.tagName_u}-${index + 1}`,
              Value: item.TagName == 'Number of Shifts' ? `Shift ${index + 1}` : line.Value  // Add Shift information per replication
            }));
          })
        };
      });
    }

    this.manPowerData = replicatedData;
    this.grnLineCount = this.manPowerData[0].linedata;
  }

  onChange(line, value) {
    const numberOfDays = this.ds.number_of_days; 


    let sepValuesByLineNumber = {};
    this.manPowerData.forEach(item => {
      if (!['Description', 'PO Qty', 'PO Balance Qty', 'GRN - Quantity', 'Number of Shifts', 'Shift', 'Monthly quantity'].includes(item.TagName)) {
        item.linedata.forEach(line => {
          const lineNumber = line.LineNumber;
          const value = parseFloat(line.Value);

          // Initialize the data structure if it doesn't exist for this line number
          if (!sepValuesByLineNumber[lineNumber]) {
            sepValuesByLineNumber[lineNumber] = { totalValue: 0, shiftCount: 0 };
          }

          // Accumulate Sep values across shifts
          if (!isNaN(value)) {
            sepValuesByLineNumber[lineNumber].totalValue += value;
          } 
        });
      } else if (item.TagName === "Number of Shifts") {
        // Get the number of shifts for each LineNumber
        item.linedata.forEach(line => {
          const lineNumber = line.LineNumber;
          const shiftCount = parseInt(line.Value.replace("Shift", ""));

          if (!isNaN(shiftCount)) {
            sepValuesByLineNumber[lineNumber].shiftCount = shiftCount;
          } 
        });
      }
    });

    // Now calculate the GRN quantity and update the JSON
    this.manPowerData.forEach(item => {
      if (item.TagName === "GRN - Quantity") {
        item.linedata.forEach(line => {
          const lineNumber = line.LineNumber;
          const sepData = sepValuesByLineNumber[lineNumber];

          if (sepData && (!line.isSavedData || this.isEditGRN)) {
            const { totalValue, shiftCount } = sepData;

            // Check for valid shiftCount and totalValue before dividing
            if (totalValue && shiftCount && !isNaN(totalValue) && !isNaN(shiftCount) && shiftCount > 0) {

              const calculatedGRNQuantity = totalValue / (numberOfDays);
              line.Value = this.decimalRoundOff(calculatedGRNQuantity);
            } else {
              line.Value = "0"; // Default to 0 if something is missing
            }
          } else {
            line.Value = "0"; // Default to 0 if no data
          }
        });
      }
    });
  }

  confirmFun(body, type, head) {
    return this.mat_dlg.open(ConfirmationComponent, {
      width: '400px',
      height: '300px',
      hasBackdrop: false,
      data: { body: body, type: type, heading: head, icon: 'assets/Serina Assets/new_theme/Group 1336.svg' }
    })
  }
  toggleResize() {
    this.isResizingEnabled = !this.isResizingEnabled;
  }
  decimalRoundOff(num: any) {
    return Number(num).toLocaleString(undefined,
       { minimumFractionDigits: this.decimal_count, 
          maximumFractionDigits: this.decimal_count,
          useGrouping: false 
        });
  }
  addDrag() {
    this.dragRootElement = '.cdk-overlay-pane';
  }
  removeDrag() {
    this.dragRootElement ='';
  }
 
}

