import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyComponent } from './privacy/privacy.component';
import { RouterModule,Routes } from '@angular/router';

const routes: Routes =[
  { path:'privacy-policy', component: PrivacyComponent },
  { path:'DPA', component: PrivacyComponent },
  { path: '', redirectTo:'privacy-policy', pathMatch:'full'}
]


@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class SharedModuleModule { }
