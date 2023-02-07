import { SharedService } from 'src/app/services/shared/shared.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export interface updateUserEntityData {
  entityID?: number,
  EntityBodyID?: number,
  departmentID?: number,
  categoryID?: number,
  isAmountBased?:boolean,
  isActive?:boolean;
  idapproversettings?: number
}

export interface dropdownData {
  Entity: string;
  value: dropdownDatavalue[]
}
export interface dropdownDatavalue {
  name: string;
}
export interface selectedValue {
  entity?: string;
  entityBody?: string;
  entityDept?: string;
  entityID?: number,
  EntityBodyID?: number,
  departmentID?: number,
  categoryID?: number,
  isAmountBased?:any,
  isActive?:boolean,
  idapproversettings?: number
}
@Component({
  selector: 'app-approval-settings',
  templateUrl: './approval-settings.component.html',
  styleUrls: ['./approval-settings.component.scss']
})
export class ApprovalSettingsComponent implements OnInit {
  selectedEntityBody: any;
  selectedEntityDept: any;
  entityList: any;
  selectedEntityId: any;
  entityBodyList: any[];
  entityDeptList: any;
  filteredEntities: any[];
  dEntityBody: dropdownData[] = [];
  dEntityDept: dropdownData[] = [];
  filterDentityBody: any[] = [];
  filterDentityDept: any[] = [];
  selectedEntitys: selectedValue[] = [];
  updateUsersEntityInfo: updateUserEntityData[] = [];
  updateUserEntityDummy: updateUserEntityData[] = [];
  updateUserEnt_body_id: number;
  updateUserEnt_dept_id: number;
  selectedEntityName;
  selectedEntityBodyName;
  selectedEntityDeptName;

  approval_boolean:boolean;
  amount_approval:boolean;
  booleanList = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ]
  readSettingsData: any;
  constructor(private router: Router,
    private sharedService: SharedService,
    private messageService: MessageService ) { }

  ngOnInit(): void {
    this.toGetEntity();
    this.readSettings();
    this.readfinanceSettingsData();
  }
  backToSettings(){
    this.router.navigate(['/IT_Utility/settings/configuration'])
  }
  readSettings(){
    this.sharedService.readApprovalSettings().subscribe((data:any)=>{
      data.result.forEach((element) => {
        let amountBoolean = false;
        if (element.ApproveSetting?.isAmountBased){
          amountBoolean = true;
        }

        this.selectedEntitys.push({
          entity: element.Entity?.EntityName,
          entityBody: element.EntityBody?.EntityBodyName,
          entityDept: element.Department?.DepartmentName,
          entityID: element.Entity?.idEntity,
          EntityBodyID: element.EntityBody?.idEntityBody,
          departmentID: element.Department?.idDepartment,
          isAmountBased: amountBoolean,
          idapproversettings : element.ApproveSetting?.idapproversettings
        });
        // this.updateUsersEntityInfo.push({
        //   entityID: element.Entity?.idEntity,
        //   EntityBodyID: element.EntityBody?.idEntityBody,
        //   departmentID: element.Department?.idDepartment,
        //   isAmountBased: element.ApproveSetting?.isAmountBased,
        //   isActive: element.ApproveSetting?.isActive,
        // });
      });
      // this.updateUserEntityDummy = this.updateUsersEntityInfo;
    })
  }
  UpdateSettings(){
   
    this.sharedService.updateApprovalSettings(JSON.stringify(this.updateUsersEntityInfo)).subscribe((data:any)=>{
      
      this.sharedService.updateObject.detail = "Entity data updated."
      this.messageService.add(this.sharedService.updateObject);
      this.updateUsersEntityInfo = [];
      this.selectedEntitys = [];
      this.readSettings();
    },err=>{
      this.sharedService.errorObject.detail = "Server error"
      this.messageService.add(this.sharedService.errorObject);
    })
  }
  toGetEntity() {
    this.entityList = [];
    this.sharedService.getEntityDept().subscribe((data: any) => {
      this.entityList = data;
    })
  }

  filterEntity(event) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.entityList.length; i++) {
      let country = this.entityList[i];
      if (country.EntityName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
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
          element.DepartmentName.toLowerCase().indexOf(query.toLowerCase()) == 0
        );
      });
    } else {
      alert('Please select Entity');
    }
  }
  filterEntityDept(event) {
    this.filterDentityDept = [];
    // if (this.entityDeptList) {
    //   let query = event.query;
    //   this.filterDentityDept = this.entityDeptList.filter((element) => {
    //     return (
    //       element.DepartmentName.toLowerCase().indexOf(query.toLowerCase()) == 0
    //     );
    //   });
    // } else {
    //   alert('Please select Entitybody');
    // }
  }
  onSelectEntity(value) {
    this.entityBodyList = [];
    this.entityDeptList = [];
    this.sharedService.selectedEntityId = value.idEntity;
    this.selectedEntityId = value.idEntity;
    this.sharedService.getDepartment().subscribe((data: any) => {
      this.entityBodyList = data.department;
      // this.entityDeptList = this.entityBodyList[0].department
    });
    if (this.selectedEntitys?.length > 0) {
      if (
        this.selectedEntitys[this.selectedEntitys?.length - 1]?.entity &&
        this.selectedEntitys[this.selectedEntitys?.length - 1]?.isAmountBased != undefined
      ) {
        this.selectedEntitys.push({
          entity: value.EntityName,
          entityID: value.idEntity,
          idapproversettings : null
        });
        this.updateUsersEntityInfo.push({
          entityID: value.idEntity,
          isActive: true,
          idapproversettings : null
        });
        this.selectedEntityName = value.EntityName;
      } else {
        alert('Please Select amount based approvals required or not');
      }
    } else {
      this.selectedEntitys.push({
        entity: value.EntityName,
        entityID: value.idEntity,
        idapproversettings : null
      });
      this.updateUsersEntityInfo.push({
        entityID: value.idEntity,
        isActive: true,
        idapproversettings : null
      });
      this.selectedEntityName = value.EntityName;
    }
  }

  /* To select Deparment  */
  onSelectEntityBody(e) {
    // let ent_body_name = this.entityBodyList.filter((element => {
    //   return element.DepartmentName == e.DepartmentName;
    // }))
    // this.entityDeptList = ent_body_name[0].department
    // this.updateUsersEntityInfo.push({EntityBodyID: e.idEntityBody});
    this.updateUsersEntityInfo.forEach((value) => {
      if (value.entityID == this.selectedEntityId && !value.departmentID) {
        value.departmentID = e.idDepartment;
        this.updateUserEnt_dept_id = e.idDepartment;
      }
    });
    this.selectedEntitys.forEach((element) => {
      if (
        element.entity == this.selectedEntityName &&
        (!element.entityDept || element.entityDept.length == 0)
      ) {
        element.entityDept = e.DepartmentName;
        element.departmentID = e.idDepartment;
        this.selectedEntityDeptName = e.DepartmentName;
      }
    });
  }

  onSelectEntityDept(e) {
    this.updateUsersEntityInfo.forEach((value) => {
      if (
        value.entityID == this.selectedEntityId &&
        value.EntityBodyID == this.updateUserEnt_body_id &&
        !value.departmentID
      ) {
        value.departmentID = e.idDepartment;
        this.updateUserEnt_dept_id = e.idDepartment;
      }
    });
    let count = 0;
    this.selectedEntitys.forEach((element) => {
      if (element.entityDept === e.DepartmentName) {
        alert('Please select other Department');
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
        this.selectedEntitys[this.selectedEntitys.length - 1].departmentID =
          e.idDepartment;
        this.selectedEntityDeptName = e.DepartmentName;
      }
    }
  }

  onRemove(index1, value) {
    if(!value.idapproversettings){
      let Ent_id = value.entityID ? value.entityID : null
      let Ent_cat_id = value.categoryID ? value.categoryID : null;
      let Ent_dept_id = value.departmentID ? value.departmentID : null;
      this.updateUsersEntityInfo.forEach((element, index) => {
        if (Ent_id && Ent_cat_id && Ent_dept_id) {
          if (element.entityID == Ent_id && element.categoryID == Ent_cat_id && element.departmentID == Ent_dept_id) {
            
              this.updateUsersEntityInfo.splice(index, 1);
          }
        } else if (Ent_id && Ent_cat_id) {
          if (element.entityID == Ent_id && element.categoryID == Ent_cat_id) {
              this.updateUsersEntityInfo.splice(index, 1);
          }
        }
        else {
          if (element.entityID == Ent_id) {
              this.updateUsersEntityInfo.splice(index, 1);
          }
        }
      })
    } else {
      this.updateUsersEntityInfo.push(value);
    }
    this.selectedEntitys.splice(index1, 1);
  };
  onSelectAmountApproval(e) {
    this.updateUsersEntityInfo.forEach((value) => {
      if (value.entityID == this.selectedEntityId && !value.isAmountBased) {
        value.isAmountBased = e;
      }
    });
    this.selectedEntitys.forEach((element) => {
      if (element.entity == this.selectedEntityName && !element.isAmountBased) {
        element.isAmountBased = e;
      }
    });
    this.booleanList = [
      { text: 'Yes', value: true },
      { text: 'No', value: false },
    ];
  }

  readfinanceSettingsData() {
    this.sharedService.readGeneralSettings().subscribe((data:any)=>{
      this.readSettingsData = data.data ;
      this.approval_boolean = this.readSettingsData.isApprovalEnabled;
    })
  }

  changeFinanceApproveSettings(e){
    this.sharedService.financeApprovalSetting(e.target.checked).subscribe((data:any)=>{
      this.messageService.add(this.sharedService.updateObject)
    },error=>{
      this.sharedService.errorObject.detail = error.statusText;
      this.messageService.add(this.sharedService.errorObject)
    })
    // if(confirm("Are you sure you want to change setting")){
    //   this.financeApproveBoolean = e.target.checked;
    //   console.log(this.financeApproveBoolean)
    //   this.settingsService.financeApprovalSetting(e.target.checked).subscribe((data:any)=>{
    //     console.log(data);
    //   })
    // } else if (this.financeApproveBoolean == false){
    //   console.log(this.financeApproveBoolean)
    //   this.financeApproveBoolean = true;
    //   console.log('f false');
    // } else if (this.financeApproveBoolean == true){
    //   this.financeApproveBoolean = false;
    //   console.log('f trur');
    // }
    
  }
}
