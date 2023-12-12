/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuizMusicService } from './quiz-music.service';

describe('Service: QuizMusic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizMusicService]
    });
  });

  it('should ...', inject([QuizMusicService], (service: QuizMusicService) => {
    expect(service).toBeTruthy();
  }));
});
