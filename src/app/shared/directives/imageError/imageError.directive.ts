import { Directive, Input, HostBinding, HostListener } from '@angular/core';
import { AppSettings } from '../../../settings/app.settings';
import { SharedService } from '../../shared.service';

@Directive({
  selector: '[msImageError]'
})
export class ImageErrorDirective {
  /**
   *
   * This function is not being used in project.
   *
   */

  userInformation: any;
  constructor(private sharedService: SharedService) { }

  @HostBinding('src') src: string;
  @HostListener('error') setErrorImage() {
    this.userInformation = this.sharedService.getUserInformation();
    if (this.src !== undefined && this.src !== null) {
      if (this.userInformation.gender === 'female') {
        this.src = AppSettings.ERROR_PROFILE_IMAGE[0];
      } else {
        this.src = AppSettings.ERROR_PROFILE_IMAGE[1];
      }
    } else {
      if (this.userInformation !== undefined) {
        this.src = this.userInformation.avatar;
      }
    }
  }
}
