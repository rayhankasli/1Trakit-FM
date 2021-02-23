import { TestBed } from '@angular/core/testing';

import { HelpContentDataService } from './help-content-data.service';

describe('HelpContentDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelpContentDataService = TestBed.get(HelpContentDataService);
    expect(service).toBeTruthy();
  });
});
