import { TestBed, async, inject } from '@angular/core/testing';

import { CheckUserProfileGuard } from './check-user-profile.guard';

describe('CheckUserProfileGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckUserProfileGuard]
    });
  });

  it('should ...', inject([CheckUserProfileGuard], (guard: CheckUserProfileGuard) => {
    expect(guard).toBeTruthy();
  }));
});
