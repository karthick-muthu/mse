/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionDisplayReformService } from './questionDisplayReform.service';

describe('Service: QuestionDisplayReform', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionDisplayReformService]
    });
  });

  it('should ...', inject([QuestionDisplayReformService], (service: QuestionDisplayReformService) => {
    expect(service).toBeTruthy();
  }));
});