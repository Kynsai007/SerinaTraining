import { VendorItemListComponent } from './vendor-item-list/vendor-item-list.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { VendorComponent } from './vendor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Comparision3WayComponent } from '../exception-management/comparision3-way/comparision3-way.component';

const routes: Routes = [
  {
    path: '', component: VendorComponent,
    children: [
      { path: 'vendorDetails', component: VendorDetailsComponent },
      { path: 'ServiceDetails', component: VendorDetailsComponent },
      {
        path: '', redirectTo: 'vendorDetails', pathMatch: 'full'
      },
    ]
  },
  {
    path: 'vendorDetails/InvoiceDetails/:id',
    component: Comparision3WayComponent,
  },
  {
    path: 'serviceDetails/serviceInvoice/:id',
    component: Comparision3WayComponent,
  },
  { path: 'item_master', component: VendorItemListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
