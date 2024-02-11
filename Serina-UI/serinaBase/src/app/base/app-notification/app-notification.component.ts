import { AlertService } from 'src/app/services/alert/alert.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/dataStore/data.service';

@Component({
  selector: 'app-app-notification',
  templateUrl: './app-notification.component.html',
  styleUrls: ['./app-notification.component.scss']
})
export class AppNotificationComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  private dataService: DataService) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  closeSnackBar(){
    this.dataService.closeSnackbar();
  }

}
