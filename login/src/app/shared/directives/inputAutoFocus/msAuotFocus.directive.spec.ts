/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { MsAuotFocusDirective } from './msAuotFocus.directive';
import { ElementRef } from '@angular/core/src/linker/element_ref';

describe('ParentLoginComponent', () => {

  describe('Directive: Maths', () => {
    it('should create an instance', () => {
      let el: ElementRef;
      const directive = new MsAuotFocusDirective(el);
      expect(directive).toBeTruthy();
    });
  })
});