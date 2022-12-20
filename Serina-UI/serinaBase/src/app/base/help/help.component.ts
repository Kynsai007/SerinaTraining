import { SharedService } from 'src/app/services/shared.service';
import { Component,  OnInit } from '@angular/core';
import * as fileSaver from 'file-saver';
@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }
  downloadPdf() { 
    this.sharedService.downloadHelpDoc('AGI_Help_guide.xlsx').subscribe((data:any)=>{
      fileSaver.saveAs(data, `Quick_upload_Help_guide.xlsx`);
    })
  }
}
