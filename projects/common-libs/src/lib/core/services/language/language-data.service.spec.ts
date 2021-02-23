import { TestBed } from '@angular/core/testing';

import { LanguageDataService } from './language-data.service';

describe('LanguageDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageDataService = TestBed.get(LanguageDataService);
    expect(service).toBeTruthy();
  });
});
