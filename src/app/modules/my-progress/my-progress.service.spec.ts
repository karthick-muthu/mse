/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyProgressService } from './my-progress.service';

describe('Service: MyProgress', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyProgressService]
    });
  });

  it('should ...', inject([MyProgressService], (service: MyProgressService) => {
    expect(service).toBeTruthy();
  }));
});