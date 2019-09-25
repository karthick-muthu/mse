import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[msPasswordShowHide]'
})
export class PasswordShowHideDirective {
  @HostBinding() type: string;
  constructor() {
    this.type = 'password';
  }
  changeType(type: string): void {
    this.type = type;
  }
}
