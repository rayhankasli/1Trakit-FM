import { TestBed } from '@angular/core/testing';

import { MeterReadPresenterService } from './meter-read-presenter.service';

describe('MeterReadPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeterReadPresenterService = TestBed.get(MeterReadPresenterService);
    expect(service).toBeTruthy();
  });
});
