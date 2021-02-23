import { TestBed, async, inject } from '@angular/core/testing';

import { ActivateDashboardGuard } from './activate-dashboard.guard';

describe('ActivateDashboardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivateDashboardGuard]
    });
  });

  it('should ...', inject([ActivateDashboardGuard], (guard: ActivateDashboardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
