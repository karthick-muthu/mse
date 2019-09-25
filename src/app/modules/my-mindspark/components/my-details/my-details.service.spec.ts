/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyDetailsService } from './my-details.service';

describe('Service: MyDetails', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyDetailsService]
    });
  });

  it('should ...', inject([MyDetailsService], (service: MyDetailsService) => {
    expect(service).toBeTruthy();
  }));
});