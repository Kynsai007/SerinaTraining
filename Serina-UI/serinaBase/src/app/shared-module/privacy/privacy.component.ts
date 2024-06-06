import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  isPrivacy:boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if(this.router.url.includes('privacy-policy')){
      this.isPrivacy = true;
    }
  }

}
