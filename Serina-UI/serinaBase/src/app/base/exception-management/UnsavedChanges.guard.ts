import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanUploadComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard
  implements CanDeactivate<CanUploadComponentDeactivate>
{
  canDeactivate(
    component: CanUploadComponentDeactivate
  ): boolean {
    return component.canDeactivate
      ? component.canDeactivate()
      : true;
  }
}
