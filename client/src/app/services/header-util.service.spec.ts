import { TestBed } from '@angular/core/testing';

import { HeaderUtilService } from './header-util.service';

describe('HeaderUtilService', () => {
  let service: HeaderUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
