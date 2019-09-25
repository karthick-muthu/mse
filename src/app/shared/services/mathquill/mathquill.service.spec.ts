/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MathQuillService } from './mathquill.service';

describe('Service: Mathquill', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MathQuillService]
    });
  });

  it('should ...', inject([MathQuillService], (service: MathQuillService) => {
    expect(service).toBeTruthy();
  }));
});