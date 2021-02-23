import { TestBed, async, inject } from '@angular/core/testing';

import { CheckLicensingGuard } from './check-licensing.guard';

describe('CheckLicensingGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckLicensingGuard]
    });
  });

  it('should ...', inject([CheckLicensingGuard], (guard: CheckLicensingGuard) => {
    expect(guard).toBeTruthy();
  }));
});
