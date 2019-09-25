/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StarredQuestionsService } from './starred-questions.service';

describe('Service: StarredQuestions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarredQuestionsService]
    });
  });

  it('should ...', inject([StarredQuestionsService], (service: StarredQuestionsService) => {
    expect(service).toBeTruthy();
  }));
});