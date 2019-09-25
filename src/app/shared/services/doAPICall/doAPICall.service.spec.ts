/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DoAPICallService } from './doAPICall.service';

describe('Service: doAPICall', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoAPICallService]
    });
  });

  it('should ...', inject([DoAPICallService], (service: DoAPICallService) => {
    expect(service).toBeTruthy();
  }));
});