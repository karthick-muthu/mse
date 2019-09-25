/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorksheetsService } from './worksheets.service';

describe('Service: Worksheets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorksheetsService]
    });
  });

  it('should ...', inject([WorksheetsService], (service: WorksheetsService) => {
    expect(service).toBeTruthy();
  }));
});