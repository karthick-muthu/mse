/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommentModalService } from './comment-modal.service';

describe('Service: CommentModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentModalService]
    });
  });

  it('should ...', inject([CommentModalService], (service: CommentModalService) => {
    expect(service).toBeTruthy();
  }));
});