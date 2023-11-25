import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss']
})
export class FeatureComponent implements OnInit {
  featureList = [];
  currentSlide = 0;
  videoSource: SafeResourceUrl;
  doNotShowBool = false;

  constructor(private sanitizer: DomSanitizer,
    private settingService : SettingsService,
    public dialogRef: MatDialogRef<FeatureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.videoSource = this.sanitizer.bypassSecurityTrustResourceUrl('assets/CREATE GRN - INVOICE PENDING.mp4');
   }

  ngOnInit(): void {
    // this.featureList = [
    //   { name: 'GRN creation with PO' , descrption:'some info about the feature'},
    //   { name: 'Help section' , descrption:'some info about the feature'},
    //   { name: 'About versions' , descrption:'some info about the feature'}
    // ];
    this.featureList= this.data;
    console.log(this.featureList)
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  nextSlide() {
    this.currentSlide++;
    if (this.currentSlide === this.featureList.length) {
      this.currentSlide = 0;
    }
  }
  selectSlide(index: number) {
    this.currentSlide = index;
  }
  isCurrentSlide(index: number) {
    return this.currentSlide === index;
  }
  closeForMe(){
    if(this.doNotShowBool){
      this.settingService.removeRelesebyId().subscribe((data:any)=>{
        let userdata = JSON.parse(localStorage.getItem('currentLoginUser'))
        userdata.userdetails.show_updates = 0;
        localStorage.setItem('currentLoginUser',JSON.stringify(userdata));
      })
    }
  }
}
