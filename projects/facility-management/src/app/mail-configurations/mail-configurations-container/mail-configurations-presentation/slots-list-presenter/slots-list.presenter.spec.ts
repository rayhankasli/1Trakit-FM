import { TestBed } from '@angular/core/testing';

import { SlotsPresenterService } from './slots-presenter.service';

describe('SlotsPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlotsPresenterService = TestBed.get(SlotsPresenterService);
    expect(service).toBeTruthy();
  });
});
