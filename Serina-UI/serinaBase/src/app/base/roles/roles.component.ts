import { Subscription } from 'rxjs';
import { DataService } from './../../services/dataStore/data.service';
import { SettingsService } from './../../services/settings/settings.service';
import { Location } from '@angular/common';
import { PermissionService } from './../../services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface UserData {
  name: string;
  role: string;
  userId: string;
  designation: string;
  entities: number;
  emailId: string;
  mobile: string;
}
export interface updateUserEntityData {
  idUserAccess?: number;
  EntityID?: number;
  EntityBodyID?: number;
  DepartmentID?: number;
  categoryID?: 0;
  userPriority?: number;
  maxAmount?: number;
  preApprove?: boolean;
  subRole:number;
}

export interface dropdownData {
  Entity: string;
  value: dropdownDatavalue[];
}
export interface dropdownDatavalue {
  name: string;
}

export interface selectedValue {
  idUserAccess?: number;
  entity?: string;
  entityBody?: string;
  entityDept?: string;
  EntityID?: number;
  EntityBodyID?: number;
  DepartmentID?: number;
  userPriority?: number;
  category?:string;
  categoryID?:number;
  maxAmount?: number;
  preApprove?: boolean;
  subRole?:any;
}
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  normalRole: boolean = true;
  checked1: boolean = false;
  initialView: boolean = true;
  users: UserData[];
  usersData;
  roles = [];
  NameOfRole: any;
  Flevel: any = null;

  selectedEntityName;
  selectedEntityBodyName;
  selectedEntityDeptName;

  createUserCode: string;
  createUserName: string;
  emailIdInvite: string;
  InviteRole: string;
  InviteUserPassword: string;
  InviteFlevel: any;
  createUserDesignation;

  createRoleRequiredBoolean: boolean = false;
  newRoleName: string;
  newRoleDescription: string;

  events1: any[];

  loginUserData: any;
  visible = true;
  filteredEntities: any[];
  dEntityBody: dropdownData[] = [];
  dEntityDept: dropdownData[] = [];
  filterDentityBody: any[] = [];
  filterDentityDept: any[] = [];

  selectedEntitys: selectedValue[] = [];
  CreateNewRole: boolean = false;
  editUserdata: boolean = false;
  saveRoleBoolean: boolean;
  header_Ac:string

  roletype: string;
  CustomerUserReadData;
  vendorAdminReadData = [];
  vendorAdminReadDataAP = [];

  userName: string;
  firstName: string;
  lastName: string;
  designation;
  userEmail: string;
  userCode: any;
  custuserid: any;
  editRoleName: string;
  selectedEntityBody: any;
  selectedEntityDept: any;
  entityList: any;
  selectedEntityId: any;
  entityBodyList: any[];
  entityDeptList: any;
  SelectedCategory:any;
  SelectedEntity:any;

  showPaginator: boolean;
  DisplayRoleName: any[];

  roleInfoDetails: any;
  someParameterValue;

  AddorModifyUserBoolean: boolean = false;
  userRoleBoolean: boolean = false;
  invoiceBoolean: boolean = false;
  viewInvoiceBoolean: boolean = false;
  editInvoiceBoolean: boolean = false;
  changeApproveBoolean: boolean = false;
  financeApproveBoolean: boolean = false;
  spTriggerBoolean = false;
  vendorTriggerBoolean = false;
  configAccessBoolean: boolean = false;
  dashboardAccessBoolean: boolean = false;
  vendorPageBoolean = false;
  settingsPageBoolean = false;
  GRNPageBoolean = false;
  exceptionPageBoolean = false;

  userAccess: number = 0;
  userRoleAccess = 0;
  invoiceAccess = 0;

  AccessPermissionTypeId: number;

  deleteBtnText: string;

  viewType = 'user';
  updateroleData;
  appied_permission_def_id: number;
  displayResponsive: boolean;
  displayAddUserDialog: boolean;
  headerEdituserboolean: boolean;
  updateUserEnt_body_id: number;
  updateUserEnt_dept_id: number;
  updateUsersEntityInfo: updateUserEntityData[] = [];
  updateEntityUserDummy: updateUserEntityData[] = [];
  userBoolean: boolean;
  userNotBoolean: boolean;
  resetBtnText: string;
  vendorList: any;
  vendorCreate: string;
  createVAccount: string;
  createVlastName: string;
  createVfirstName: string;
  idVendor: number;
  idVendorAccount: any;
  vendorSuperUsersReadData: any;
  showPaginatorSp: boolean;
  showPaginatorAp:boolean;
  deleteBtnTextBoolean: boolean;
  deleteRoleBoolean: boolean;
  deactivateBoolean: boolean;
  resetVendorMail: any;
  vendorResetBtnBoolean: boolean;
  userResetBtnBoolean: boolean;
  max_role_amount = 0;
  role_priority: number;

  financeApproveDisplayBoolean: boolean;
  addRoleBoolean: boolean;
  vendorsSubscription: Subscription;
  entitySubscription: Subscription;
  filteredVendors = [];
  entitySelection: any[];
  entityForVendorCreation = [];
  vendorEntityCodes: any;
  vendorCode: any;
  vendorMatch:any;

  row_customer: number = 10;
  row_vendor: number = 10;
  first_cust: number = 0;
  first_vendor: number = 0;
  editVndrUserbool: boolean;
  selectedEnt_venor: any[];
  vendorUserId: any;
  dailogText: string;
  updateIdaccessArr = [];
  updateVenrEntityAccess = [];
  entLengthforup_vendr: any;
  approveDialog: boolean;
  tempVendorName: string;
  tempDisplayVName:string;
  vendorMatchList = [];
  vendorOnboarderStatus: boolean;
  approval_priority: any = null;
  skipList = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];
  skip_approval_boolean: boolean;
  entityBaseApproveBoolean: boolean;
  subRole:any;

  alertBoolean:boolean;
  subroleList: any[];
  isAmountBasedON: boolean;
  isEvrythingGood: boolean;
  isVendorportalRequired: boolean;
  vendorInvoiceAccess: boolean;
  APIParam:any
  offsetCount = 1;
  serachStr = '';
  totalC_users: any;
  ap_boolean: any;
  party_type: string;
  is_fp= false;
  is_fpa = false;
  isDesktop: boolean;
  thCount: number;
  entities: { idEntity: number, EntityName: string }[] = [];
  // newEntities: any;
  // selEntity: string;
  fullList: any;
  flipPO_approval_bool: boolean;
  expandFull: boolean;
  isTableView:boolean;
  header_role: string;
  is_grn_approval:boolean;
  searchText:string;
  departmentData = [];
  selectedDept = [];
  entitySelection_user = [];
  serviceData: any[];
  selectedService = [];
  constructor(
    private dataService: DataService,
    private sharedService: SharedService,
    private router: Router,
    public routeIn: ActivatedRoute,
    private permissionService: PermissionService,
    private SpinnerService: NgxSpinnerService,
    private _location: Location,
    private settingsService: SettingsService,
    private Alert : AlertService,
    private mat_dlg : MatDialog
  ) {
    routeIn.params.subscribe((params) => {
      this.setupComponent(params['someParam']);
    });
  }

  ngOnInit(): void {
    this.isDesktop = this.dataService.isDesktop;
    this.vendorInvoiceAccess = this.dataService.configData.vendorInvoices;
    this.flipPO_approval_bool = this.dataService.configData.enableflippoapprovals;
    if(this.isDesktop){
      this.thCount = 6;
    } else {
      this.thCount = 4;
    }
    this.ap_boolean = this.dataService.ap_boolean;
    if(this.ap_boolean){
      this.party_type = 'Vendor';
    } else {
      this.party_type = 'Customer';
    }
    this.inIt();
    this.readUserDepartment();
  }

  inIt() {
    if (this.permissionService.addUsersBoolean == true) {
      this.router.navigate(['/customer/roles', 'createdUsers']);
      this.someParameterValue = 'createdUsers';
      this.DisplayCustomerUserDetails();
      this.toGetEntity();
      this.getDisplayTotalRoles();
      this.getVendorsListTocreateNewVendorLogin();
      this.getVendorSuperUserList();
      this.financeApproveDisplayBoolean =
        this.settingsService.finaceApproveBoolean;
      this.addRoleBoolean = this.permissionService.addUserRoleBoolean;
      this.isVendorportalRequired = this.dataService?.configData?.enablevendorportal;
      this.vendorInvoiceAccess = this.dataService?.configData?.vendorInvoices;

    } else {
      // this.alertBoolean = true;
      // this.displayResponsive = true;
      // this.deleteBtnText = ;
      this.alertFun("Sorry!, you don't have access");
      this._location.back();
    }
  }
  setupComponent(someParam) {
    this.someParameterValue = someParam;
  }

  showDialog(event:Event,e) {
    event.stopPropagation();
    this.CreateNewRole = false;
    if (this.addRoleBoolean == true) {
      this.confirmation_pop('Are you sure you want to delete this Role?','role');
      this.sharedService.ap_id = e.idAccessPermissionDef;
    } else {
      alert('Sorry, you do not have access!');
    }
  }

  DeleteRole() {
    this.sharedService.deleteRole().subscribe((data: any) => {
      if (data.result == 'success') {
        this.successAlert('Deleted Successfully');
        this.getDisplayTotalRoles();
      }
    });
    this.displayResponsive = false;
  }

  createRoles() {
    this.header_role = "Add new role";
    this.CreateNewRole = true;
    if (this.addRoleBoolean == true) {
      // this.router.navigate(['/customer/roles', 'createNewRole']);
      this.SpinnerService.hide();
      // this.normalRole = false;
      this.newRoleName = '';
      // this.CreateNewRole = true;
      // this.editUserdata = false;
      this.saveRoleBoolean = true;
    } else {
      alert('Sorry!, you do not have access');
    }
  }
  cancelRoles() {
    this.router.navigate(['/customer/roles', 'definedRoles']);
    this.normalRole = true;
    this.CreateNewRole = false;
    this.editUserdata = false;
  }
  saveRoles() {
    if (!this.newRoleName) {
      this.createRoleRequiredBoolean = true;
    } else {
      this.addandUpdaterole();
      this.sharedService
        .createRole(this.updateroleData)
        .subscribe(
          (data: any) => {
            if (data.result) {
              this.successAlert('Role Created Successfully');
              this.getDisplayTotalRoles();
              this.normalRole = true;
              this.CreateNewRole = false;
              this.editUserdata = false;
              delete this.AccessPermissionTypeId;
            }
          },
          (error) => {
            if (error.status == 400) {
                this.alertFun("Please provide other priority, the given priority is already taken.");
            } else {
              this.alertFun(error.statusText);
            }
          }
        );
      this.createRoleRequiredBoolean = false;
      this.normalRole = true;
      this.CreateNewRole = false;
      this.editUserdata = false;
    }
  }
  editRole(e) {
    this.header_role = "Edit Role";
    this.CreateNewRole = true;
    if (this.addRoleBoolean) {
      // this.router.navigate(['/customer/roles', `${e.idAccessPermissionDef}editRoleDetails`]);
      this.sharedService.ap_id = e.idAccessPermissionDef;
      this.newRoleName = e.NameOfRole;
      this.saveRoleBoolean = false;

      this.SpinnerService.show();
      this.max_role_amount = 0;
  
      this.sharedService.displayRoleInfo().subscribe((data: any) => {
        this.roleInfoDetails = data.roleinfo.AccessPermissionDef;
        this.role_priority = this.roleInfoDetails.Priority;
  
        this.max_role_amount = data.roleinfo?.AmountApproveLevel?.MaxAmount || 0;
  
        this.AddorModifyUserBoolean = this.roleInfoDetails.User === 1;
        this.userRoleBoolean = this.roleInfoDetails.Permissions === 1;
        this.invoiceBoolean = this.roleInfoDetails.NewInvoice === 1;
  
        this.vendorTriggerBoolean = this.roleInfoDetails.allowBatchTrigger;
        this.spTriggerBoolean = this.roleInfoDetails.allowServiceTrigger;
        this.configAccessBoolean = this.roleInfoDetails.isConfigPortal;
        this.dashboardAccessBoolean = this.roleInfoDetails.isDashboard;
        this.exceptionPageBoolean = this.roleInfoDetails.is_epa;
        this.GRNPageBoolean = this.roleInfoDetails.is_gpa;
        this.vendorPageBoolean = this.roleInfoDetails.is_vspa;
        this.settingsPageBoolean = this.roleInfoDetails.is_spa;
        this.is_fp = this.roleInfoDetails.is_fp;
        this.is_fpa = this.roleInfoDetails.is_fpa;
        // this.is_grn_approval = this.roleInfoDetails.is_grn_approval;
  
        const accessPermissionTypeId = this.roleInfoDetails.AccessPermissionTypeId;
  
        this.viewInvoiceBoolean = accessPermissionTypeId >= 1;
        this.editInvoiceBoolean = accessPermissionTypeId >= 2;
        this.changeApproveBoolean = accessPermissionTypeId >= 3;
        this.financeApproveBoolean = accessPermissionTypeId === 4;
  
        this.SpinnerService.hide();
      });
    } else {
      alert('Sorry, you do not have access!');
    }
  }
  changeUserPermission(e) {
    if (e.target.checked === true) {
      this.userAccess = 1;
      this.AddorModifyUserBoolean = true;
    } else {
      this.userAccess = 0;
      this.AddorModifyUserBoolean = false;
    }
  }
  changeUserRolePermission(e) {
    if (e.target.checked === true) {
      this.userRoleAccess = 1;
      this.userRoleBoolean = true;
    } else {
      this.userRoleAccess = 0;
      this.userRoleBoolean = false;
    }
  }
  changeInvoicePermission(e) {
    if (e.target.checked === true) {
      this.invoiceAccess = 1;
      this.invoiceBoolean = true;
    } else {
      this.invoiceAccess = 0;
      this.invoiceBoolean = false;
    }
  }
  changeSpTriggerPermission(e) {
    if (e.target.checked === true) {
      this.spTriggerBoolean = true;
    } else {
      this.spTriggerBoolean = false;
    }
  }
  changeVendorTriggerPermission(e) {
    if (e.target.checked === true) {
      this.vendorTriggerBoolean = true;
    } else {
      this.vendorTriggerBoolean = false;
    }
  }
  changeViewInvoice(e) {
    this.handleChangeInvoice(e, true, false, false, false);
  }
  changeEditInvoice(e) {
    this.handleChangeInvoice(e, true, true, false, false);
  }
  changeChangeApproveInvoice(e) {
    this.handleChangeInvoice(e, true, true, true, false);
  }
  changeFinanceApproveInvoice(e) {
    this.handleChangeInvoice(e, true, true, true, true);
  }
  handleChangeInvoice(e, enableView, enableEdit, enableChangeApprove, enableFinanceApprove) {
    this.viewInvoiceBoolean = enableView && e.target.checked;
    this.editInvoiceBoolean = enableEdit && this.viewInvoiceBoolean;
    this.changeApproveBoolean = enableChangeApprove && this.editInvoiceBoolean;
    this.financeApproveBoolean = enableFinanceApprove && this.changeApproveBoolean && e.target.checked;
    
    if (!this.viewInvoiceBoolean) {
      this.editInvoiceBoolean = false;
      this.changeApproveBoolean = false;
      this.financeApproveBoolean = false;
    }
  }
  addandUpdaterole() {
    if (
      this.viewInvoiceBoolean == true &&
      this.editInvoiceBoolean == true &&
      this.changeApproveBoolean == true &&
      this.financeApproveBoolean == true
    ) {
      this.AccessPermissionTypeId = 4;
    } else if (
      this.viewInvoiceBoolean == true &&
      this.editInvoiceBoolean == true &&
      this.changeApproveBoolean == true &&
      this.financeApproveBoolean == false
    ) {
      this.AccessPermissionTypeId = 3;
    } else if (
      this.viewInvoiceBoolean == true &&
      this.editInvoiceBoolean == true &&
      this.changeApproveBoolean == false &&
      this.financeApproveBoolean == false
    ) {
      this.AccessPermissionTypeId = 2;
    } else if (
      this.viewInvoiceBoolean == true &&
      this.editInvoiceBoolean == false &&
      this.changeApproveBoolean == false &&
      this.financeApproveBoolean == false
    ) {
      this.AccessPermissionTypeId = 1;
    }

    this.updateroleData = {
      NameOfRole: this.newRoleName,
      Priority: this.role_priority,
      User: this.AddorModifyUserBoolean,
      Permissions: this.userRoleBoolean,
      AccessPermissionTypeId: this.AccessPermissionTypeId,
      allowBatchTrigger: this.vendorTriggerBoolean,
      isConfigPortal: this.configAccessBoolean,
      isDashboard: this.dashboardAccessBoolean,
      allowServiceTrigger: this.spTriggerBoolean,
      NewInvoice: this.invoiceBoolean,
      max_amount: this.max_role_amount,
      is_epa: this.exceptionPageBoolean,
      is_gpa: this.GRNPageBoolean,
      is_vspa: this.vendorPageBoolean,
      is_spa: this.settingsPageBoolean,
      is_fp : this.is_fp,
      is_fpa:this.is_fpa
    };
  }

  updateRoleInfoData() {
    this.addandUpdaterole();
    this.sharedService
      .updateRoleData(this.updateroleData)
      .subscribe(
        (data: any) => {
          if (data.result) {
            this.successAlert("Updated successfully");
            this.getDisplayTotalRoles();
            this.normalRole = true;
            this.CreateNewRole = false;
            this.editUserdata = false;
            delete this.AccessPermissionTypeId;
          }
        },
        (error) => {
          this.alertFun(error.statusText);
        }
      );
  }

  toGetEntity() {
    this.entityList = [];
    this.fullList = [];
    this.sharedService.getEntityDept().subscribe((data: any) => {

      let arr = [];
      data?.forEach(ele => {
        ele.EntityName = `${ele.EntityName} ${ele.EntityCode ? '-' +ele.EntityCode : ""}`;
        arr.push({ EntityName: ele.EntityName, 
          idEntity: ele.idEntity, 
          department:ele?.department,
          entityTypeID:ele.entityTypeID,
          sourceSystemType:ele.sourceSystemType,
          EntityCode:ele.EntityCode
           })
      })
      this.entityList = arr;
      this.fullList = arr;
    });
  }

  filterEntity(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.entityList.length; i++) {
      let country = this.entityList[i];
      if (country.EntityName.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(country);
      }
    }
    this.filteredEntities = filtered;
  }
  filterEntityBody(event) {
    if (this.entityBodyList) {
      let query = event.query;
      this.filterDentityBody = this.entityBodyList.filter((element) => {
        return (
          element.DepartmentName.toLowerCase().includes(query.toLowerCase())
        );
      });
    } else {
      // this.alertBoolean = true;
      // this.displayResponsive = true;
      // this.deleteBtnText = '';
      this.alertFun("Please select Entity");
    }
  }
  filterEntityDept(event) {
    if (this.entityDeptList) {
      let query = event.query;
      this.filterDentityDept = this.entityDeptList.filter((element) => {
        return (
          element.DepartmentName.toLowerCase().includes(query.toLowerCase())
        );
      });
    } else {
      // this.alertBoolean = true;
      // this.displayResponsive = true;
      // this.deleteBtnText = ;
      this.alertFun('Please select Department');
    }
  }
  onSelectEntity(value) {
    if(this.financeApproveDisplayBoolean){
      delete this.skip_approval_boolean;
      // this.newEntities = value;
      let clubedEnt = value.EntityName
      if(value?.EntityCode){
        clubedEnt = `${value?.EntityName}-${value?.EntityCode}`
      }
      this.entities.push({ idEntity: value.idEntity, EntityName: clubedEnt })
      if (this.selectedEntitys?.length > 0 && this.AccessPermissionTypeId == 4 && this.entityBaseApproveBoolean) {
        if (
          this.selectedEntitys[this.selectedEntitys?.length - 1]?.entity &&
          this.selectedEntitys[this.selectedEntitys?.length - 1]?.subRole &&
          this.selectedEntitys[this.selectedEntitys?.length - 1]?.userPriority &&
          this.selectedEntitys[this.selectedEntitys?.length - 1]?.preApprove != undefined
        ) {
          this.sharedService.selectedEntityId = value.idEntity;
          this.selectedEntityId = value.idEntity;
          this.readDeparment();
          this.selectedEntitys.push({
            entity: value.EntityName,
            EntityID: value.idEntity,
            subRole : this.appied_permission_def_id
          });
          this.updateUsersEntityInfo.push({
            idUserAccess: null,
            EntityID: value.idEntity,
            DepartmentID : null,
            categoryID :null,
            subRole : this.appied_permission_def_id
          });
          this.selectedEntityName = value.EntityName;
          this.isEvrythingGood =  true;
          this.checkStatus(0,'approval');
        } else {
          // this.alertBoolean = true;
          // this.displayResponsive = true;
          // this.deleteBtnText = ;
          this.alertFun('Please add all the mandatory fields')
          this.isEvrythingGood =  false;
        }
      } else {
        this.sharedService.selectedEntityId = value.idEntity;
        this.selectedEntityId = value.idEntity;
        this.readDeparment();
        this.selectedEntitys.push({
          entity: value.EntityName,
          EntityID: value.idEntity,
        });
        this.updateUsersEntityInfo.push({
          idUserAccess: null,
          EntityID: value.idEntity,
          DepartmentID : null, 
          categoryID :null,
          subRole : this.appied_permission_def_id
        });
        this.selectedEntityName = value.EntityName;
        this.checkStatus(0,'approval');
      }
      this.subRole = '';
      this.getSkipList();
      this.checkEntity();
    } else {
      this.withoutApproval(value);
    }
    
  }

  withoutApproval(event){
    if(event?.itemValue){
      let bool,index,arr;
      this.selectedEntitys.filter((x,i,array)=>{
        if(event.itemValue.idEntity == x.EntityID){
          index = i;
          arr = x
        }
      })
      if(event?.itemValue?.idEntity == arr?.EntityID){
        this.selectedEntitys.splice(index,1);
        this.updateUsersEntityInfo.push({ idUserAccess: arr?.idUserAccess, EntityID: arr.EntityID,DepartmentID : null,
          categoryID :null,
          subRole : this.appied_permission_def_id })
      } else {
        this.selectedEntitys.push({ entity: event?.itemValue?.EntityName, EntityID: event?.itemValue?.idEntity });
        this.updateUsersEntityInfo.push({ idUserAccess: null, EntityID: event?.itemValue?.idEntity,DepartmentID : null,
          categoryID :null,
          subRole : this.appied_permission_def_id })
      }
    } else if(event.value.length>0){
      event?.value?.forEach((obj1)=>{
        let isIdPresent = this.selectedEntitys.some(obj=> obj1.idEntity == obj.EntityID);
          if(!isIdPresent){
            this.selectedEntitys.push({ entity: obj1.EntityName, EntityID: obj1.idEntity });
            this.updateUsersEntityInfo.push({ 
              idUserAccess: null, 
              EntityID: obj1.idEntity,
              DepartmentID : null,
              categoryID :null,
              subRole : this.appied_permission_def_id})
            this.selectedEntityName = obj1.EntityName;
          }

      });
    }
  }

  readDeparment(){
    this.entityBodyList = [];
    this.sharedService.getDepartment().subscribe((data: any) => {
      this.entityBodyList = data.department;

    });
  }
  readUserDepartment(){
    this.departmentData = [];
    this.sharedService.getUserDepartment().subscribe((data: any) => {
      this.departmentData = data;
    });
  }
  readServiceData(){
    this.serviceData = [];
    this.sharedService.readserviceprovider().subscribe((data: any) => {
      let arr = [];
      data.forEach(element => {
        let spData = { ...element.Entity, ...element.ServiceProvider };
        arr.push(spData);
      });
      this.serviceData = arr.filter((el,i,array)=> 
        i === array.findIndex(val=> el.ServiceProviderName === val.ServiceProviderName));      
    });
  }
  onSelectService(event){
    // this.serviceList = [];
    // event.value.forEach(el=>this.serviceList.push(el.ServiceProviderName));
    this.selectedService = event?.value;
  }
  onSelectDepartment(event){
    this.selectedDept = event.value;
  }

  readCategory(){
    this.sharedService.readCategory().subscribe((data:any)=>{

      // this.entityDeptList = this.entityBodyList[0].department
    })
  }

  /* To select Deparment  */
  onSelectEntityBody(e) {
    // let ent_body_name = this.entityBodyList.filter((element => {
    //   return element.DepartmentName == e.DepartmentName;
    // }))
    this.entityDeptList = []
    // this.updateUsersEntityInfo.push({EntityBodyID: e.idEntityBody});
    this.updateUsersEntityInfo.forEach((value) => {
      if (value.EntityID == this.selectedEntityId && !value.DepartmentID) {
        value.DepartmentID = e.idDepartment;
        value.categoryID = null;
        this.updateUserEnt_dept_id = e.idDepartment;
      }
    });
    this.selectedEntitys.forEach((element) => {
      if (
        element.entity == this.selectedEntityName &&
        (!element.entityDept || element.entityDept.length == 0)
      ) {
        element.entityDept = e.DepartmentName;
        element.DepartmentID = e.idDepartment;
        this.selectedEntityDeptName = '';
      }
    });
  }

  /* To selcet catagory */
  onSelectEntityDept(e) {
    this.updateUsersEntityInfo.forEach((value) => {
      if (
        value.EntityID == this.selectedEntityId &&
        value.EntityBodyID == this.updateUserEnt_body_id &&
        !value.categoryID
      ) {
        value.categoryID = e.categoryID;
        this.updateUserEnt_dept_id = e.categoryID;
      }
    });
    let count = 0;
    this.selectedEntitys.forEach((element) => {
      if (element.entityDept === e.DepartmentName) {
        // this.alertBoolean = true;
        // this.displayResponsive = true;
        // this.deleteBtnText = '';
        this.alertFun("Please select other Department");
      } else if (!element.entityDept || element.entityDept == '') {
        count = count + 1;
      } else {
        count = count + 1;
      }
    });
    if (count === this.selectedEntitys.length) {
      if (
        this.selectedEntitys[this.selectedEntitys.length - 1].entity ==
          this.selectedEntityName &&
        this.selectedEntitys[this.selectedEntitys.length - 1].entityBody ==
          this.selectedEntityBodyName &&
        (!this.selectedEntitys[this.selectedEntitys.length - 1].entityDept ||
          this.selectedEntitys[this.selectedEntitys.length - 1].entityDept
            .length == 0)
      ) {
        this.selectedEntitys[this.selectedEntitys.length - 1].entityDept =
          e.DepartmentName;
        this.selectedEntitys[this.selectedEntitys.length - 1].DepartmentID =
          e.idDepartment;
        this.selectedEntityDeptName = e.DepartmentName;
      }
    }
  }

  onSelectsubRole(e){
    let roleInfo = this.subroleList.filter(ele=>{
      return ele.idAccessPermissionDef == e;
    });
    this.updateUsersEntityInfo.forEach((value) => {
      if (value.EntityID == this.selectedEntityId && (value.subRole == this.appied_permission_def_id || !value.subRole)) {
        value.subRole = e;
      }
    });

    this.selectedEntitys.forEach((element) => {
      if (element.entity == this.selectedEntityName && !element.subRole) {
        element.subRole = roleInfo[0]['NameOfRole'];
      }
    });
    delete this.subRole;
  }

  onSelectPriority(e){
    this.checkStatus(e,'priority');
    
  }
  checkStatus(e,type) {
      this.updateUsersEntityInfo.forEach((value) => {
        if (value.EntityID == this.selectedEntityId) {
            value.userPriority = e;
        }
      });
      let bool = false;
      if(type == 'approval'){
        bool = true;
      }
    let obj = this.updateUsersEntityInfo[this.updateUsersEntityInfo.length-1];
    this.sharedService.checkPriority(bool,obj).subscribe((data:any)=>{
      if(bool == true){
        if(data.status == 1){
          this.entityBaseApproveBoolean = true;
          this.isAmountBasedON = data.isAmountBased;
        } else {
          this.entityBaseApproveBoolean = false;
        }
      } else {
        if(data.status == 2){
            this.selectedEntitys.forEach((element) => {
              if (element.entity == this.selectedEntityName && !element.userPriority) {
                element.userPriority = e;
              }
            });
            delete this.approval_priority;
        } else if(data.status == 1){
          this.entityBaseApproveBoolean = true;
          // this.alertBoolean = true;
          // this.displayResponsive = true;
          // this.deleteBtnText = data.result;
          this.alertFun(data.result);
        }
      }

    },err=>{
      this.alertFun("Server error");
    })

  }

  onSelectAmount(e) {
    this.updateUsersEntityInfo.forEach((value) => {
      if (value.EntityID == this.selectedEntityId && !value.maxAmount) {
        value.maxAmount = e;
      }
    });
    this.selectedEntitys.forEach((element) => {
      if (element.entity == this.selectedEntityName && !element.maxAmount) {
        element.maxAmount = e;
      }
    });
    delete this.max_role_amount;
  }

  onSelectSkip(e) {
    this.updateUsersEntityInfo.forEach((value) => {
      if (value.EntityID == this.selectedEntityId && !value.preApprove) {
        value.preApprove = e;
      }
    });
    this.selectedEntitys.forEach((element) => {
      if (element.entity == this.selectedEntityName && !element.preApprove) {
        element.preApprove = e;
      }
    });
    // this.getSkipList();
  }

  getSkipList(){
    return     this.skipList = [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ];
  }

  // checkPriority(){
  //   let obj = this.updateUsersEntityInfo[this.updateUsersEntityInfo.length-1]
  //   this.sharedService.checkPriority(JSON.stringify(obj)).subscribe()
  // }
  onRemove(index, value) {
    this.removeItem(value.EntityID);
    if (this.selectedEntitys.length > 1) {
      if (value.idUserAccess) {
        this.updateUsersEntityInfo.push({
          idUserAccess: value.idUserAccess,
          EntityID: value.EntityID,
          EntityBodyID: value.EntityBodyID,
          DepartmentID: value.DepartmentID,
          subRole: this.appied_permission_def_id
        });
      } else {
        let Ent_id = value.EntityID ? value.EntityID : null;
        let Ent_body_id = value.EntityBodyID ? value.EntityBodyID : null;
        let Ent_dept_id = value.DepartmentID ? value.DepartmentID : null;
        this.updateUsersEntityInfo.forEach((element, index) => {
          if (Ent_id && Ent_body_id && Ent_dept_id) {
            if (
              element.EntityID == Ent_id &&
              element.EntityBodyID == Ent_body_id &&
              element.DepartmentID == Ent_dept_id
            ) {
              this.updateUsersEntityInfo.splice(index, 1);
            }
          } else if (Ent_id && Ent_body_id) {
            if (
              element.EntityID == Ent_id &&
              element.EntityBodyID == Ent_body_id
            ) {
              this.updateUsersEntityInfo.splice(index, 1);
            }
          } else {
            if (element.EntityID == Ent_id) {
              this.updateUsersEntityInfo.splice(index, 1);
            }
          }
        });
      }
      this.selectedEntitys.splice(index, 1);
    } else {
      this.alertFun('Atleast one entity required');
    }
  }

  editUser(value) {
    this.toGetEntity();
    this.readServiceData();
    this.header_Ac = "Edit user";
    delete this.skip_approval_boolean;
    this.selectedDept = [];
    this.selectedService = [];
    this.departmentData.filter(ele=>{
      if(value?.dept_ids?.some(id=> ele.iduserdept ==id)){
        this.selectedDept.push(ele)
      };
    })
    // this.router.navigate(['/customer/roles', `${value.idUser}editUser`]);
    if (value.isActive == 0) {
      this.resetBtnText = 'Resend Activation Link';
    } else {
      this.resetBtnText = 'Reset Account';
    }
    this.appied_permission_def_id = value.idAccessPermissionDef;
    this.sharedService.cuserID = value.idUser;
    // this.headerEdituserboolean = true;
    // this.normalRole = false;
    // this.CreateNewRole = false;
    this.editUserdata = true;
    this.firstName = value.firstName;
    this.lastName = value.lastName;
    this.userEmail = value.email;
    this.userCode = value.UserCode;
    this.editRoleName = value.NameOfRole;
    this.AccessPermissionTypeId = value.AccessPermissionTypeId;
    if (value && value.MaxAmount) {
      this.Flevel = value.MaxAmount;
    }
    this.entities = [];
    this.sharedService
      .readEntityUserData(value.idUser)
      .subscribe((data: any) => {
        let entityData = [];
        this.entitySelection_user = [];
        this.selectedService = []
        this.serviceData.forEach(ser=>{
          if(data?.service_providers?.some(id=> ser?.ServiceProviderName == id)){
            this.selectedService.push(ser);
          }
        })
        data.result.forEach((element) => {
          // if (!element.EntityBody && !element.Department) {
          //   this.selectedEntitys.push({ entity: element.Entity.EntityName, entityBody: element.EntityBody, entityDept: element.DepartmentName, idUserAccess: element.UserAccess.idUserAccess, EntityID: element.Entity.idEntity, EntityBodyID: element.EntityBody, DepartmentID: element.idDepartment });
          //   this.updateEntityUserDummy.push({ idUserAccess: element.UserAccess.idUserAccess, EntityID: element.Entity.idEntity, EntityBodyID: element.EntityBody, DepartmentID: element.DepartmentName });
          // }
          // else if (!element.Department) {
          //   this.selectedEntitys.push({ entity: element.Entity.EntityName, entityBody: element.EntityBody.EntityBodyName, entityDept: element.DepartmentName, idUserAccess: element.UserAccess.idUserAccess, EntityID: element.Entity.idEntity, EntityBodyID: element.EntityBody.idEntityBody, DepartmentID: element.Department });
          //   this.updateEntityUserDummy.push({ idUserAccess: element.UserAccess.idUserAccess, EntityID: element.Entity.idEntity, EntityBodyID: element.EntityBody.idEntityBody, DepartmentID: element.DepartmentName });
          // }
          // else {
            let merge = { ...element.Entity,...element.EntityBody,...element.UserAccess,...element.Department};
            entityData.push(merge);
            if (element.Entity) {
              // Push the Entity object into the entities array
              this.entities.push({ idEntity: element.Entity.idEntity, EntityName: `${element.Entity.EntityName}-${element?.Entity?.EntityCode}` }); 
            }
            let preApproveBool = false;
            if(element.UserAccess?.preApprove == 1){
              preApproveBool = true;
            } else {
              preApproveBool = false;
            }

            let roleName = this.subroleList?.filter(el=>{
              return el.idAccessPermissionDef == element.UserAccess?.subRole
            })
            let clubedEnt = element.Entity?.EntityName
            if(element?.Entity?.EntityCode){
              clubedEnt = `${element.Entity?.EntityName}-${element?.Entity?.EntityCode}`
            }
          this.selectedEntitys.push({
            entity: clubedEnt,
            entityBody: element.EntityBody?.EntityBodyName,
            entityDept: element.Department?.DepartmentName,
            idUserAccess: element.UserAccess?.idUserAccess,
            EntityID: element.Entity?.idEntity,
            EntityBodyID: element.EntityBody?.idEntityBody,
            DepartmentID: element.Department?.idDepartment,
            maxAmount:element.UserAccess?.maxAmount,
            userPriority:element.UserAccess?.userPriority,
            preApprove:preApproveBool,
            subRole: roleName[0]?.NameOfRole
          });
          this.updateEntityUserDummy.push({
            idUserAccess: element.UserAccess?.idUserAccess,
            EntityID: element.Entity?.idEntity,
            EntityBodyID: element.EntityBody?.idEntityBody,
            DepartmentID: element.Department?.idDepartment,
            subRole:element.UserAccess?.idUserAccess
          });
          if(!this.financeApproveDisplayBoolean){
              this.entitySelection_user = this.entityList.filter(ele=>{
                return  entityData?.some(id => id.idEntity == ele.idEntity)
              })
          }
          // }
        });
        if(this.financeApproveDisplayBoolean){
          this.checkEntity();
        }

      });
  }

  canceleditUser() {
    this.router.navigate(['/customer/roles', 'createdUsers']);
    this.normalRole = true;
    this.CreateNewRole = false;
    this.editUserdata = false;
    this.selectedEntitys = [];
    this.updateUsersEntityInfo = [];
    this.userNotBoolean = false;
    this.userBoolean = false;
    this.toGetEntity();
  }
  UpdateUser() {
    const dept_ids = this.getDept_ids();
    const s_list = this.getServiceNames();
    let editUser = {
      User: {
        firstName: this.firstName,
        lastName: this.lastName,
        UserName: this.userName,
        email: this.userEmail,
        "dept_ids": dept_ids,
        
      },
      "service_access":s_list,
      userentityaccess: this.updateUsersEntityInfo,
    };
    if (this.selectedEntitys?.length > 0 && this.AccessPermissionTypeId == 4 && this.entityBaseApproveBoolean) {
      if(this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.EntityID &&
        this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.subRole &&
        this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.userPriority &&
        this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.preApprove != undefined)
        {
          this.updateAccessAPICall(editUser);
        } else {
          // this.alertBoolean = true;
          // this.displayResponsive = true;
          // this.deleteBtnText = '';
          this.alertFun("Please add all the mandatory fields")
        }
    } else {
      this.updateAccessAPICall(editUser);
    }
  }

  updateAccessAPICall(editUser){
    this.sharedService.updatecustomeruser(editUser).subscribe(
      (data: any) => {
        if (data.result == 'Updated') {
          const userData = data.customer_user_details;
          let selectrole = {
            applied_uid: this.sharedService.cuserID,
            isUser: true,
            appied_permission_def_id: this.appied_permission_def_id,
          };

          if (this.AccessPermissionTypeId) {
            this.sharedService
              .editRole(selectrole)
              .subscribe((data: any) => {
                delete this.AccessPermissionTypeId;

              });
          }
          this.DisplayCustomerUserDetails();
          this.entityBaseApproveBoolean = false;
          this.successAlert("Updated successfully");

          this.normalRole = true;
          this.CreateNewRole = false;
          this.editUserdata = false;
          this.selectedEntitys = [];
          this.firstName = '';
          this.lastName = '';
          this.updateUsersEntityInfo = [];
        }
      },
      (error) => {
        this.alertFun(error.statusText);
      }
    );
  }

  DisplayCustomerUserDetails() {
    this.roles = [];
    this.sharedService.readcustomeruser().subscribe((data: any) => {
      let usersList = [];
      data.forEach((element) => {
        let mergedData = {
          ...element.AccessPermission,
          ...element.AccessPermissionDef,
          ...element.User
        };
        mergedData.LogName = element?.LogName;
        usersList.push(mergedData);
      });
      this.CustomerUserReadData = usersList;
      if (this.CustomerUserReadData.length > 10 && this.isDesktop ) {
        this.showPaginator = true;
      }
    });
  }

  createCustomerUserPage() {
    this.toGetEntity();
    this.readServiceData();
    // this.headerEdituserboolean = false;
    this.header_Ac = "Add new user";
    // this.normalRole = false;
    // this.CreateNewRole = false;
    this.editUserdata = true;
    this.userName = '';
    this.userEmail = '';
    this.editRoleName = '';
    this.firstName= '';
    this.lastName = '';
    this.Flevel = '';
    this.selectedEntitys = [];
    delete this.skip_approval_boolean;
    this.getSkipList();
  }

  userCheck(name) {
    name = name.trim()
    this.userName = name;
    if(name.length > 5){
      this.sharedService.userCheck(name).subscribe((data: any) => {
        if (!data.LogName) {
          this.userBoolean = true;
          this.userNotBoolean = false;
        } else {
          this.userNotBoolean = true;
          this.userBoolean = false;
        }
      });
    } else {
      this.userNotBoolean = true;
      this.userBoolean = false;
    }
  }
  getDept_ids(){
    const dept_ids = []
    this.selectedDept.forEach(ele=>{
      dept_ids.push(ele.iduserdept);
    })
    return dept_ids
  }
  getServiceNames(){
    const serviceList = []
    this.selectedService.forEach(ele=>{
      serviceList.push(ele.ServiceProviderName);
    })
    return serviceList
  }
  toCreateUser() {
    if (
      this.updateUsersEntityInfo.length > 0 &&
      this.userName != '' &&
      this.userNotBoolean == false
    ) {
      const dept_ids = this.getDept_ids();
      const s_list = this.getServiceNames();
      let createUserData = {
        n_cust: {
          email: this.userEmail,
          firstName: this.firstName,
          lastName: this.lastName,
          userentityaccess: this.updateUsersEntityInfo,
          role_id: this.appied_permission_def_id,
          "dept_ids": dept_ids,
          "service_access": s_list
        },
        n_cred: {
          LogName: this.userName,
          LogSecret: 'string',
        },
      };
      if (this.selectedEntitys?.length > 0 && this.AccessPermissionTypeId == 4 && this.entityBaseApproveBoolean) {
        if(this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.EntityID &&
          this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.subRole &&
          this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.userPriority &&
          this.updateUsersEntityInfo[this.updateUsersEntityInfo?.length - 1]?.preApprove != undefined)
          {
            this.addUserAPICall(createUserData);
          } else {
            // this.alertBoolean = true;
            // this.displayResponsive = true;
            // this.deleteBtnText = '';
            this.alertFun("Please add all the mandatory fields")
          }
      } else {
            this.addUserAPICall(createUserData);
      }


    } else {
      this.alertFun("Please fill all the given fields");
    }
  }

  addUserAPICall(createUserData){
    this.sharedService
    .createNewUser(createUserData)
    .subscribe(
      (data) => {
        this.successAlert('User Created Successfully');
        this.normalRole = true;
        this.CreateNewRole = false;
        this.editUserdata = false;
        this.selectedEntitys = [];
        this.updateUsersEntityInfo = [];
        this.userNotBoolean = false;
        this.userBoolean = false;
        this.firstName = '';
        this.lastName = '';
        this.DisplayCustomerUserDetails();
        this.entityBaseApproveBoolean = false;
      },
      (error) => {
        if (error.status == 422) {
          this.alertFun("Please fill all the given fields");
        } else {
          this.alertFun(error.statusText);
        }
      }
    );
  }

  selectRole(e) {
    let item = this.DisplayRoleName.filter((item) => {
      return e.indexOf(item.NameOfRole) > -1;
    });
    this.appied_permission_def_id = item[0].idAccessPermissionDef;
    this.AccessPermissionTypeId = item[0].AccessPermissionTypeId;
  }

  changeUserRole(e, value) {
    let item = this.DisplayRoleName.filter((item) => {
      return value.indexOf(item.NameOfRole) > -1;
    });
    let roleData = {
      applied_uid: e.idUser,
      isUser: true,
      appied_permission_def_id: item[0].idAccessPermissionDef,
    };
    this.sharedService
      .editRole(roleData)
      .subscribe((data: any) => {
        if (data.result == 'success') {
          this.successAlert('Role Created Successfully');
        }
      });
  }
  getDisplayTotalRoles() {
    this.SpinnerService.show();
    this.sharedService.displayRolesData().subscribe((data: any) => {
      this.SpinnerService.hide();
      this.DisplayRoleName = data.roles;
      this.subroleList = this.DisplayRoleName.filter(ele=>{
        return ele.AccessPermissionTypeId == 4;
      })
      this.DisplayRoleName = this.DisplayRoleName.sort(
        (a, b) => b.isDefault - a.isDefault
      );
    });
  }

  getVendorsListTocreateNewVendorLogin() {
    this.sharedService
      .getVendorUniqueData('?offset=1&limit=100')
      .subscribe((data: any) => {
        this.vendorList = data;
      });
  }
  filterVendor(event,name) {
    let query = event.query.toLowerCase();
    // if(name == ''){
      if (query != '') {
        this.sharedService
          .getVendorUniqueData(`?offset=1&limit=100&ven_name=${query}`)
          .subscribe((data: any) => {
            this.filteredVendors = data;
          });
      } else {
        if(name == ''){
          this.filteredVendors = this.vendorList;
        } else {
          this.filteredVendors = this.vendorMatchList;
        }
      }
    // } else {
    //   if (query != '') {
    //         this.readVendorMatch(this.tempVendorName,`&ven_name_search=${query}&offset=0&limit=0`);
    //         this.filteredVendors = this.vendorMatchList;
    //   } else {

    //     console.log(this.vendorMatchList)
    //     this.filteredVendors = this.vendorMatchList;
    //   }
    // }
  }

  selectVendor(value,type) {
    // const accontData = this.vendorList.filter((element => {
    //   return value === element.VendorName;
    // }));
      this.vendorCode = value.VendorCode;
      this.checkOnboardStatus(value.VendorCode);
      this.readEntityForVendorOnboard(value.VendorCode, null);

    // this.entityForVendorCreation = accontData[0].entity_ids;
    //
    // console.log(accontData,this.entityForVendorCreation)

    // this.idVendor = accontData[0].idVendor;
  }
  checkOnboardStatus(value){
    this.sharedService.check_onboardStatus(value).subscribe((data:any)=>{
      this.vendorOnboarderStatus = data.result.vendor_status;
      if(data.result.vendor_status == false){
        this.alertFun("Vendor template is not Onboarded yet.");
      }
    });
  }

  onSelectedEntityCode(value,type) {
    let arr = [];
    if(type == 'update'){
      let currentCount = value.value.length;
      this.selectedEnt_venor.find(ele=>{
        arr.push(ele.idEntity)
      })

        if(arr.includes(value.itemValue.idEntity)){
          let arr1 = this.selectedEnt_venor.filter(id=>value.itemValue.idEntity === id.idEntity);
          this.updateIdaccessArr.push(arr1[0].idVendorUserAccess);
        } else {
          this.entLengthforup_vendr = this.entitySelection.length;
          if(currentCount >= this.entLengthforup_vendr){
          this.updateVenrEntityAccess.push(value.itemValue.idEntity);
          }
        }
        this.entLengthforup_vendr = value.value.length;

    } else {
      value.value.forEach(ele=>{
        arr.push(ele.idEntity)
      })
      this.updateIdaccessArr = [];
      this.updateVenrEntityAccess = arr;
    }

  }

  readEntityForVendorOnboard(ven_code,uid) {
    this.SpinnerService.show();
    this.sharedService
      .getVendorsCodesToCreateNewlogin(ven_code)
      .subscribe((data: any) => {

        this.entityForVendorCreation = data.ent_details;
        if(!this.editVndrUserbool){
          this.entitySelection = this.entityForVendorCreation;
        } else {
          this.getVendorUserAccess(uid,ven_code);
        }
        this.SpinnerService.hide();
      },err=>{
        this.SpinnerService.hide();
      });
  }

  addVendorUser(){
    this.dailogText = "Add Vendor admin";
    this.editVndrUserbool = false;
    this.displayAddUserDialog = true;
    this.vendorCreate = null;
    this.createVfirstName = null;
    this.createVlastName = null;
    this.emailIdInvite = null;
    this.createUserName = null;
    this.entitySelection = [];

  }
  createVendorSuprUser() {
   if(this.vendorOnboarderStatus){
    let entityIdArray = [];
    this.entitySelection.forEach((ent_id) => {
      entityIdArray.push(ent_id.idEntity);
    });
    let vendorSpUserData = {
      n_ven_user: {
        firstName: this.createVfirstName,
        lastName: this.createVlastName,
        email: this.emailIdInvite,
        role_id: 7,
        uservendoraccess: [
          {
            vendorUserID: 0,
            vendorCode: this.vendorCode,
            entityID: entityIdArray,
            vendorAccountID: null,
          },
        ],
      },
      n_cred: {
        LogName: this.createUserName,
        LogSecret: 'string',
        userID: 0,
      },
    };
    this.sharedService
      .createVendorSuperUser(vendorSpUserData)
      .subscribe(
        (data: any) => {
          this.successAlert("Created Successfully");
          this.displayAddUserDialog = false;

          this.getVendorSuperUserList();
        },
        (error) => {
          this.alertFun(error.statusText);
        }
      );
   } else {
    this.alertFun("Vendor template is not Onboarded yet.");
   }
  }

  editvendorUser(val){
    this.dailogText = "Update Vendor admin";
    this.displayAddUserDialog = true;
    this.editVndrUserbool = true;
    this.createVfirstName = val.firstName;
    this.createVlastName = val.lastName;
    this.readEntityForVendorOnboard(val.vendor_data.VendorCode,val.idUser);
    this.vendorUserId = val.idUser;
    this.vendorCode = val.vendor_data.VendorCode;
    // setTimeout(() => {
    //   this.getVendorUserAccess(val.idUser,val.vendor_data.VendorCode)
    // }, 1000);
  }
  updateVendorAccess(){
    let Obj = {
      "User": {
        "firstName": this.createVfirstName,
        "lastName": this.createVlastName,
      },
      "uservendoraccess": {
        "idVendorUserAccess": this.updateIdaccessArr,
        "vendorCode" : this.vendorCode,
        "entityID": this.updateVenrEntityAccess,
      }
    }
    this.sharedService.updateVendorUserAccess(Obj,this.vendorUserId).subscribe((data:any)=>{
      if(this.approveDialog){
        this.successAlert("Account Activation Done.");
      } else {
        this.successAlert("Updated successfully");
        this.displayAddUserDialog = false;
        this.getVendorSuperUserList();
      }
      this.updateVenrEntityAccess = [];
      this.updateIdaccessArr = [];
    },err=>{
      this.alertFun("Server error");
    })
  }
  approveVendoraccess(user){
    this.approveDialog = true;
    this.tempDisplayVName = user?.vendor_data?.VendorName;
    let word = user?.vendor_data?.VendorName.split(' ');
    let splited = word[0];
    if(word[0].length <=3 ){
      splited = word[0]+' '+word[1]
    }
    this.tempVendorName = splited;
    this.createVfirstName = user.firstName;
    this.createVlastName = user.lastName;
    this.vendorUserId = user.idUser;
    this.readVendorMatch(this.tempVendorName,`&ven_name_search=${this.tempVendorName}&offset=0&limit=0`)
  }
  approveActivateVendor(){
    if(this.vendorOnboarderStatus){
      this.updateVendorAccess();
      this.sharedService.activate_vendor_signup(this.vendorUserId).subscribe(
        (data: any) => {
          this.successAlert(data.result);
          this.approveDialog = false;
          this.vendorUserId = null;
          // this.DisplayCustomerUserDetails();
          this.getVendorSuperUserList();
        },
        (error) => {
          this.alertFun("Server error");
        }
      );
    } else {
      this.alertFun("Vendor template is not onboarded");
    }

  }
  readVendorMatch(ven_name, type) {
    this.SpinnerService.show();
    this.sharedService.getVendorMatch(ven_name, type).subscribe((data: any) => {
      if (data?.vendorlist?.length>0) {
        this.vendorMatchList = data.vendorlist;
        this.vendorMatch = this.vendorMatchList[0];
        this.vendorCode = this.vendorMatch?.VendorCode;
        this.checkOnboardStatus(this.vendorMatch?.VendorCode);
        this.readEntityForVendorOnboard(this.vendorMatch?.VendorCode, null);
      } else {
        this.alertFun("Match not found please select");
      }
      // this.onSelectedEntityCode(this.entitySelection,type);
      let arr = [];

      setTimeout(() => {
        this.entitySelection?.forEach(ele => {
          arr.push(ele.idEntity)
        })
        this.updateVenrEntityAccess = arr;
      }, 1000);
      this.SpinnerService.hide();
    }, err => {
      this.SpinnerService.hide();
    })
  }
  getVendorUserAccess(uid,ven_code){
    this.SpinnerService.show();
    this.entitySelection = [];
    this.selectedEnt_venor = [];
    this.sharedService.readVendorAccess(uid,ven_code).subscribe((data:any)=>{
      let mergeArr = [];
      data?.ent_details?.forEach(ele => {
        let mergeObj = {
          ...ele.Entity,
          ...ele.VendorUserAccess
        }
        this.entitySelection.push({...ele.Entity});
        mergeArr.push(mergeObj)
      })
      this.selectedEnt_venor = mergeArr;
      this.SpinnerService.hide();
    },err=>{
      this.SpinnerService.hide();
    })
  }

  getVendorSuperUserList() {
    this.sharedService.readVendorSuperUsersList().subscribe((data: any) => {
      let vendorUsersList = [];
      let vendorUsersListAp = [];
      data.forEach((element) => {
        let mergerdObject = {
          ...element.AccessPermission,
          ...element.AccessPermissionDef,
          ...element.User,
          ...element.Vendor,
        };
        // mergerdObject.idVendorUserAccess = element.idVendorUserAccess;
        mergerdObject.LogName = element.LogName;
        if(mergerdObject.vendor_data?.VendorCode == ''){
          vendorUsersListAp.push(mergerdObject);
        } else {
          vendorUsersList.push(mergerdObject);
        }
      });
      this.vendorAdminReadData = vendorUsersList;
      this.vendorAdminReadDataAP = vendorUsersListAp;
      if (this.vendorAdminReadData.length > 10 && this.isDesktop) {
        this.showPaginatorSp = true;
      }
      if(this.vendorAdminReadDataAP.length >10 && this.isDesktop) {
        this.showPaginatorAp = true;
      }
    });
  }
  resetPassword() {
    this.confirmation_pop('Are you sure you want to reset this account?','reset_u');
  }
  resetPasswordUserAPI() {
    this.sharedService.resetPassword(this.userEmail).subscribe(
      (data: any) => {
        this.displayResponsive = false;
        if (data.result != 'failed mail') {
          this.successAlert(data.result);
          this.displayResponsive = false;
          this.DisplayCustomerUserDetails();
        } else {
          this.alertFun(data.result);
        }
      },
      (error) => {
        this.alertFun("Server error");
      }
    );
  }
  resetPasswordVendor(mail) {
    this.resetVendorMail = mail;
    this.confirmation_pop('Are you sure you want to reset this account?','reset_v');
  }

  resetPassVendorAPI() {
    this.sharedService.resetPassword(this.resetVendorMail).subscribe(
      (data: any) => {
        if (data.result != 'failed mail') {
          this.successAlert(data.result);
          this.displayResponsive = false;
          this.getVendorSuperUserList();
        } else {
          this.alertFun(data.result);
        }
      },
      (error) => {
        this.alertFun("Server error");
      }
    );
  }

  confirmationPopUp(id, bool,event:Event) {
    event.stopPropagation();
    this.editUserdata = false;
    let text = 'Activate';
    if(bool){
      text = 'Deactivate'
    }
    this.custuserid = id;
    this.confirmation_pop(`Are you sure you want to ${text} this Account?`,'active');
  }

  activa_deactive() {
    this.sharedService.activate_deactivate(this.custuserid).subscribe(
      (data: any) => {
        this.successAlert(data.result);
        this.displayResponsive = false;
        this.custuserid = null;
        this.DisplayCustomerUserDetails();
        this.getVendorSuperUserList();
      },
      (error) => {
        this.alertFun(error.statusText);
      }
    );
  }
  paginate(event, type) {
    if (type == 'vendor') {
      this.row_vendor = event.rows;
      this.first_vendor = event.first;
    } else {
      this.row_customer = event.rows;
      this.first_cust = event.first;
    }
  }
  alertFun(txt) {
    this.Alert.error_alert(txt);
  }
  successAlert(txt) {
    this.Alert.success_alert(txt);
  }
  // entityChange(){
  //   this.selEntity = '';
  // }
  removeItem(idEntity: number){
    const index = this.entities.findIndex(item => item.idEntity === idEntity);
    if (index !== -1 && this.entities.length > 1) {
      this.entities.splice(index, 1);
    }
    this.entityList = this.fullList;
    this.checkEntity()
  }
  checkEntity(){
    this.entities.forEach(selectedEntity => {
      this.entityList = this.entityList.filter(entity => {
          return !(entity.idEntity === selectedEntity.idEntity);
      });
    });
    
  }
  confirmation_pop(d_msg,type){
    const drf:MatDialogRef<ConfirmationComponent> = this.mat_dlg.open(ConfirmationComponent,{ 
      width : '400px',
      height: '300px',
      hasBackdrop: false,
      data : { body: d_msg, type: 'confirmation',heading:'Confirmation',icon:'assets/Serina Assets/new_theme/Group 1336.svg'}})

      drf.afterClosed().subscribe((bool)=>{
        if(bool){
          if(type == 'role') {
            this.DeleteRole()
          } else if(type == 'reset_u'){
            this.resetPasswordUserAPI();
          } else if(type == 'reset_v'){
            this.resetPassVendorAPI();
          } else if(type == 'active'){
            this.activa_deactive()
          }
        } 
      })
  }

  expand(bool){
    this.expandFull = bool;
  }
}
