import { TestBed } from '@angular/core/testing';

import { RezoService } from './rezo.service';

describe('RezoService', () => {
  let service: RezoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RezoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
