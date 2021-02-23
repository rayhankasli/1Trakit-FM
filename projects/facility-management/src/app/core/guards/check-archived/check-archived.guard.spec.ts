import { TestBed, async, inject } from '@angular/core/testing';

import { CheckArchivedGuard } from './check-archived.guard';

describe('CheckArchivedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckArchivedGuard]
    });
  });

  it('should ...', inject([CheckArchivedGuard], (guard: CheckArchivedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
