import { TestBed } from '@angular/core/testing';

import { WorkflowFilterPresenterService } from './workflow-filter.presenter';

describe('WorkflowFilterPresenterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkflowFilterPresenterService = TestBed.get(WorkflowFilterPresenterService);
    expect(service).toBeTruthy();
  });
});
