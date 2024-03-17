import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppNotificationComponent } from 'src/app/base/app-notification/app-notification.component';
import { DataService } from '../dataStore/data.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  errorObject = {
    severity: "error",
    summary: "error",
    detail: "Something went wrong"
  }
  addObject = {
    severity: "success",
    summary: "Success",
    detail: "Created Successfully"
  }
  updateObject = {
    severity: "info",
    summary: "Updated",
    detail: "Updated Successfully"
  }

  currentUserMsg = new BehaviorSubject<any>([]);
  currentUser: Observable<any>;
  snackBarRef: MatSnackBarRef<any>;

  constructor(private _snackBar:MatSnackBar,
    private dataService: DataService) {
    this.currentUser = this.currentUserMsg.asObservable();
   }

  public get currentUserMsgBox(){
    return this.currentUserMsg.value;
}

openCustomSnackbar(img:string,t_head:string,t_foot:string,bg_clr:string) {
  const position: MatSnackBarHorizontalPosition = 'right';
  const verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  const snackBarRef: MatSnackBarRef<any> = this._snackBar.openFromComponent(AppNotificationComponent, {
    duration: 5000,
    data: { image:img, text_header: t_head, text_foot:t_foot,bg_color:bg_clr },
    horizontalPosition: position,
    verticalPosition: verticalPosition,
    panelClass: ['custom_snackbar'],
  });
  this.dataService.snackBarRef = snackBarRef;
}

success_alert(msg){
  this.openCustomSnackbar('/assets/Serina Assets/new_theme/Group 1391.svg','Hurray!',msg,'#14BB12');
}
error_alert(msg){
  this.openCustomSnackbar('/assets/Serina Assets/new_theme/Group 1599.svg',"Oops!",msg,'#FF5858');
}
update_alert(msg){
  this.openCustomSnackbar('/assets/Serina Assets/new_theme/Group 1599.svg',"Suggestion",msg,'#B2B2B2');
}

}
