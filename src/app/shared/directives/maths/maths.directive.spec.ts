/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { MathsDirective } from './maths.directive';
import { ElementRef } from '@angular/core/src/linker/element_ref';

describe('Directive: Maths', () => {
  it('should create an instance', () => {
    let el: ElementRef;
    const directive = new MathsDirective(el);
    expect(directive).toBeTruthy();
  });
});