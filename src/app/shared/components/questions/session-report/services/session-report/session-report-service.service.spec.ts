/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionReportService } from './session-report-service.service';

describe('Service: SessionReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionReportService]
    });
  });

  it('should ...', inject([SessionReportService], (service: SessionReportService) => {
    expect(service).toBeTruthy();
  }));
});