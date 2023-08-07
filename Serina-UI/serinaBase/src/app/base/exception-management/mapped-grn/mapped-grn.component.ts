import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'mapped-grn',
  templateUrl: './mapped-grn.component.html',
  styleUrls: ['./mapped-grn.component.scss','../../invoice/view-invoice/view-invoice.component.scss']
})
export class MappedGRNComponent implements OnInit {
  grnTabDatalength:number;
  GRNTabData: {};

  constructor(private SharedService: SharedService) { }

  ngOnInit(): void {
    this.getGRNtabData();
  }
  getGRNtabData() {
    this.SharedService.getGRNTabData().subscribe((data: any) => {
      this.GRNTabData = data?.result;
      this.grnTabDatalength = Object.keys(this.GRNTabData).length;
    })
  }
}
