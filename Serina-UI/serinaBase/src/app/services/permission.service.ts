import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
viewBoolean:boolean;
editBoolean:boolean;
changeApproveBoolean:boolean;
financeApproveBoolean:boolean;

addUsersBoolean:boolean;
addUserRoleBoolean:boolean;
serviceTriggerBoolean: boolean;
  isSuperAdmin: boolean;
  dashboardUserBoolean: boolean;
  excpetionPageAccess: boolean;
  GRNPageAccess: boolean;
  settingsPageAccess: boolean;
  vendor_SP_PageAccess: boolean;
  uploadPermissionBoolean: any;
  enable_create_grn: boolean;
  show_document_status: boolean;
  constructor() { }
}
