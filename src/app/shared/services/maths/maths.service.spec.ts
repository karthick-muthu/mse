/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MathsService } from './maths.service';

describe('Service: Maths', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MathsService]
    });
  });

  it('should ...', inject([MathsService], (service: MathsService) => {
    expect(service).toBeTruthy();
  }));
});