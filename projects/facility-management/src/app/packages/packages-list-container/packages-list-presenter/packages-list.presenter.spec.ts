import { TestBed } from '@angular/core/testing';

import { PackagesPresenterService } from './packages-presenter.service';

describe('PackagesPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PackagesPresenterService = TestBed.get(PackagesPresenterService);
    expect(service).toBeTruthy();
  });
});
